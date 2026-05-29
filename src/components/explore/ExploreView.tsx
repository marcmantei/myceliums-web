"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, AlertCircle, ChevronLeft, Search, X } from "lucide-react";
import type {
  Cluster,
  GraphOverviewResponse,
  GraphSearchResponse,
  NodeDetailResponse,
} from "@/types/graph";
import ForceGraph from "./ForceGraph";
import NodePanel from "./NodePanel";

interface ExploreViewProps {
  repoId: string;
  apiBaseUrl?: string;
}

type DrillLevel = {
  type: "overview";
} | {
  type: "cluster";
  clusterId: string;
  clusterLabel: string;
};

export default function ExploreView({
  repoId,
  apiBaseUrl = "",
}: ExploreViewProps) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeDetail, setNodeDetail] = useState<NodeDetailResponse | null>(null);
  const [drillLevel, setDrillLevel] = useState<DrillLevel>({ type: "overview" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScores, setSearchScores] = useState<Map<string, number>>(new Map());
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch overview data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${apiBaseUrl}/api/v1/graph/overview/${repoId}`
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data: GraphOverviewResponse = await res.json();
        setClusters(data.clusters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (repoId) fetchData();
  }, [repoId, apiBaseUrl]);

  // Fetch node detail when selected
  useEffect(() => {
    if (!selectedNodeId) {
      setNodeDetail(null);
      return;
    }
    const fetchNode = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/v1/graph/nodes/${repoId}/${selectedNodeId}`
        );
        if (res.ok) {
          const data: NodeDetailResponse = await res.json();
          setNodeDetail(data);
        }
      } catch {
        // Silently fail — panel just won't show detail
      }
    };
    fetchNode();
  }, [selectedNodeId, repoId, apiBaseUrl]);

  // Semantic search with debounce
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!searchQuery.trim()) {
      setSearchScores(new Map());
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/v1/graph/search/${repoId}?q=${encodeURIComponent(searchQuery)}&top_k=50`
        );
        if (res.ok) {
          const data: GraphSearchResponse = await res.json();
          const scores = new Map<string, number>();
          for (const r of data.results) {
            scores.set(r.id, r.score);
          }
          setSearchScores(scores);
        }
      } catch {
        // Search failure is non-critical
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery, repoId, apiBaseUrl]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchScores(new Map());
  }, []);

  const handleClusterClick = useCallback((clusterId: string) => {
    const cluster = clusters.find((c) => c.id === clusterId);
    if (cluster) {
      setDrillLevel({
        type: "cluster",
        clusterId,
        clusterLabel: cluster.label,
      });
      setSelectedNodeId(null);
    }
  }, [clusters]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleBack = useCallback(() => {
    setDrillLevel({ type: "overview" });
    setSelectedNodeId(null);
    setNodeDetail(null);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <span className="ml-3 text-slate-400">Loading knowledge graph...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <AlertCircle className="h-6 w-6 text-red-400" />
        <span className="ml-2 text-red-300">{error}</span>
      </div>
    );
  }

  // Determine what to render based on drill level
  const graphData =
    drillLevel.type === "overview"
      ? {
          nodes: clusters.map((c) => ({
            id: c.id,
            label: c.label,
            x: c.x * 400,
            y: c.y * 400,
            size: Math.max(8, Math.sqrt(c.size) * 4),
            color: c.color,
            kind: "cluster" as const,
            symbolCount: c.size,
          })),
          edges: clusters.flatMap((c) =>
            c.edges.map((e) => ({
              source: c.id,
              target: e.target,
              weight: e.weight,
            }))
          ),
        }
      : {
          // Drill-down: show symbols within a cluster
          nodes: (() => {
            const cluster = clusters.find(
              (c) => c.id === drillLevel.clusterId
            );
            if (!cluster) return [];
            return cluster.top_symbols.map((s, i) => {
              const angle = (2 * Math.PI * i) / cluster.top_symbols.length;
              const r = 150;
              return {
                id: s.id,
                label: s.name,
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r,
                size: 10,
                color: cluster.color,
                kind: "symbol" as const,
                symbolCount: 1,
              };
            });
          })(),
          edges: [],
        };

  return (
    <div className="flex h-screen bg-slate-950">
      <div className="flex flex-1 flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2">
          {drillLevel.type === "cluster" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Overview
            </button>
          )}
          <span className="text-sm font-medium text-slate-300">
            {drillLevel.type === "overview"
              ? `${clusters.length} Communities`
              : drillLevel.clusterLabel}
          </span>
          {/* Semantic search */}
          <div className="relative ml-auto flex items-center">
            <Search className="absolute left-2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search semantically..."
              className="w-56 rounded bg-slate-800 py-1 pl-7 pr-7 text-xs text-slate-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-2 h-3 w-3 animate-spin text-indigo-400" />
            )}
          </div>
          <span className="ml-2 text-xs text-slate-600">
            {repoId}
          </span>
        </div>

        {/* D3 Graph */}
        <ForceGraph
          nodes={graphData.nodes}
          edges={graphData.edges}
          onNodeClick={
            drillLevel.type === "overview" ? handleClusterClick : handleNodeClick
          }
          selectedNodeId={selectedNodeId}
          highlightScores={searchScores}
        />
      </div>

      {/* Detail panel */}
      {nodeDetail && (
        <NodePanel
          node={nodeDetail}
          onClose={() => setSelectedNodeId(null)}
          onNavigate={handleNodeClick}
        />
      )}
    </div>
  );
}
