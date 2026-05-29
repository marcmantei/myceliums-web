"use client";

import { useEffect, useState, useMemo } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  GraphNode,
  GraphEdge,
  GraphCommunity,
  ProcessCluster,
} from "@/types/graph";
import SchematicCanvas from "./SchematicCanvas";
import SchematicSidebar from "./SchematicSidebar";
import DetailPanel from "./DetailPanel";
import {
  AlertCircle,
  Loader2,
  MousePointerClick,
  GitBranch,
  Layers,
  Box,
  Code2,
} from "lucide-react";

type ViewMode = "processes" | "modules" | "definitions";

interface SchematicViewProps {
  repoId: string;
  apiBaseUrl?: string;
}

export default function SchematicView({
  repoId,
  apiBaseUrl = "",
}: SchematicViewProps) {
  const [allNodes, setAllNodes] = useState<GraphNode[]>([]);
  const [allEdges, setAllEdges] = useState<GraphEdge[]>([]);
  const [communities, setCommunities] = useState<GraphCommunity[]>([]);
  const [processes, setProcesses] = useState<ProcessCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("processes");
  const [expandedCommunities, setExpandedCommunities] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        setError(null);
        const graphUrl = `${apiBaseUrl}/api/repos/${repoId}/graph`;
        const response = await fetch(graphUrl);
        if (!response.ok) throw new Error(`Failed to fetch graph: ${response.statusText}`);
        const data = await response.json();
        setAllNodes(data.nodes || []);
        setAllEdges(data.edges || []);
        setCommunities(data.communities || []);
        setProcesses(data.processes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (repoId) fetchGraphData();
  }, [repoId, apiBaseUrl]);

  // Clear selections when view mode changes
  useEffect(() => {
    setSelectedProcessId(null);
    setSelectedCommunityId(null);
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [viewMode]);

  // Counts for toggle bar
  const definitionCount = allNodes.filter(
    (n) => ["Function", "Method", "Class", "Struct", "Trait", "Interface", "Enum", "TypeAlias"].includes(n.kind)
  ).length;
  const entryPointCount = allNodes.filter((n) => n.is_entry_point).length;

  // Filter nodes/edges based on view mode + selection
  const { filteredNodes, filteredEdges } = useMemo(() => {
    if (viewMode === "processes") {
      if (!selectedProcessId) return { filteredNodes: [], filteredEdges: [] };
      const process = processes.find((p) => p.id === selectedProcessId);
      if (!process || process.step_ids.length === 0) return { filteredNodes: [], filteredEdges: [] };
      const stepSet = new Set(process.step_ids);
      return {
        filteredNodes: allNodes.filter((n) => stepSet.has(n.id)),
        filteredEdges: allEdges.filter((e) => stepSet.has(e.source) && stepSet.has(e.target)),
      };
    }

    if (viewMode === "modules") {
      if (!selectedCommunityId) return { filteredNodes: [], filteredEdges: [] };
      const comm = communities.find((c) => c.id === selectedCommunityId);
      if (!comm) return { filteredNodes: [], filteredEdges: [] };
      const memberSet = new Set(comm.symbol_ids);
      // Cap at 200 nodes for performance
      const nodes = allNodes.filter((n) => memberSet.has(n.id)).slice(0, 200);
      const nodeSet = new Set(nodes.map((n) => n.id));
      return {
        filteredNodes: nodes,
        filteredEdges: allEdges.filter((e) => nodeSet.has(e.source) && nodeSet.has(e.target)),
      };
    }

    if (viewMode === "definitions") {
      // Show all definitions (functions, methods, classes, etc.) up to 200
      const defs = allNodes
        .filter((n) => ["Function", "Method", "Class", "Struct", "Trait", "Interface", "Enum", "TypeAlias"].includes(n.kind))
        .slice(0, 200);
      const nodeSet = new Set(defs.map((n) => n.id));
      return {
        filteredNodes: defs,
        filteredEdges: allEdges.filter((e) => nodeSet.has(e.source) && nodeSet.has(e.target)),
      };
    }

    return { filteredNodes: [], filteredEdges: [] };
  }, [viewMode, selectedProcessId, selectedCommunityId, processes, communities, allNodes, allEdges]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm text-slate-400">Loading schematic view...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4">
        <div className="max-w-md rounded-lg border border-red-500/20 bg-red-500/10 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <div>
              <h3 className="font-medium text-red-300">Error Loading Graph</h3>
              <p className="mt-2 text-sm text-red-200">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasSelection =
    (viewMode === "processes" && selectedProcessId) ||
    (viewMode === "modules" && selectedCommunityId) ||
    viewMode === "definitions";

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Sidebar */}
        <SchematicSidebar
          communities={communities}
          processes={processes}
          viewMode={viewMode}
          selectedProcessId={selectedProcessId}
          selectedCommunityId={selectedCommunityId}
          onSelectProcess={setSelectedProcessId}
          onSelectCommunity={setSelectedCommunityId}
          expandedCommunities={expandedCommunities}
          onToggleCommunity={(communityId) => {
            const newExpanded = new Set(expandedCommunities);
            if (newExpanded.has(communityId)) {
              newExpanded.delete(communityId);
            } else {
              newExpanded.add(communityId);
            }
            setExpandedCommunities(newExpanded);
          }}
        />

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          {/* Toggle bar */}
          <div className="flex items-center gap-1 border-b border-slate-700/50 bg-slate-900/80 px-4 py-2 backdrop-blur-sm">
            <ToggleButton
              active={viewMode === "processes"}
              onClick={() => setViewMode("processes")}
              icon={<GitBranch className="h-3.5 w-3.5" />}
              label="Processes"
              count={processes.length}
            />
            <ToggleButton
              active={viewMode === "modules"}
              onClick={() => setViewMode("modules")}
              icon={<Layers className="h-3.5 w-3.5" />}
              label="Modules"
              count={communities.length}
            />
            <ToggleButton
              active={viewMode === "definitions"}
              onClick={() => setViewMode("definitions")}
              icon={<Code2 className="h-3.5 w-3.5" />}
              label="Definitions"
              count={definitionCount}
            />
          </div>

          {/* Canvas */}
          {hasSelection && filteredNodes.length > 0 ? (
            <SchematicCanvas
              nodes={filteredNodes}
              edges={filteredEdges}
              communities={communities}
              onNodeSelect={setSelectedNode}
              onEdgeSelect={setSelectedEdge}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <MousePointerClick className="h-12 w-12 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {viewMode === "processes"
                      ? "Select a process from the sidebar"
                      : viewMode === "modules"
                        ? "Select a module from the sidebar"
                        : "Loading definitions..."}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {allNodes.length.toLocaleString()} symbols available
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {(selectedNode || selectedEdge) && (
          <DetailPanel
            node={selectedNode}
            edge={selectedEdge}
            onClose={() => {
              setSelectedNode(null);
              setSelectedEdge(null);
            }}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
      }`}
    >
      {icon}
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
          active ? "bg-indigo-500/30 text-indigo-200" : "bg-slate-700/50 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
