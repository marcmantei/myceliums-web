"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { HERO_FEATURES } from "@/data/features";
import HeroFeatureSection from "@/components/sections/HeroFeatureSection";
import GlassCard from "@/components/ui/glass-card";
import { Box, BarChart3 } from "lucide-react";

const RepoGraph3D = lazy(() => import("@/components/three/RepoGraph3D"));
const SankeyGraph = lazy(() => import("@/components/charts/SankeyGraph"));

const GRAPH_REPOS = [
  { id: "zod", label: "colinhacks/zod", url: "https://github.com/colinhacks/zod", file: "/graphs/zod.json" },
  { id: "express", label: "expressjs/express", url: "https://github.com/expressjs/express", file: "/graphs/express.json" },
  { id: "fastapi", label: "fastapi/fastapi", url: "https://github.com/fastapi/fastapi", file: "/graphs/fastapi.json" },
];

interface GraphData {
  nodes: { id: string; name: string; kind: string; file_path: string; qualified_name: string }[];
  edges: { source: string; target: string; kind: string }[];
}

function KnowledgeGraphVisualization() {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [activeRepo, setActiveRepo] = useState("zod");
  const [graphCache, setGraphCache] = useState<Record<string, GraphData>>({});

  const currentGraphRepo = GRAPH_REPOS.find((r) => r.id === activeRepo) || GRAPH_REPOS[0];

  useEffect(() => {
    if (viewMode === "2d" && !graphCache[activeRepo]) {
      fetch(currentGraphRepo.file)
        .then((r) => r.json())
        .then((d) => setGraphCache((prev) => ({ ...prev, [activeRepo]: { nodes: d.nodes, edges: d.edges } })))
        .catch(() => {});
    }
  }, [viewMode, activeRepo, currentGraphRepo.file, graphCache]);

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-5 lg:p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold">
            Knowledge Graph:{" "}
            <a href={currentGraphRepo.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-glow transition-colors">
              {currentGraphRepo.label}
            </a>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
              {viewMode === "3d" ? "drag to rotate · scroll to zoom" : "hover for details"}
            </span>
            <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
              <button
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono transition-colors ${
                  viewMode === "3d" ? "bg-accent/20 text-accent" : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <Box className="w-3 h-3" />
                3D
              </button>
              <button
                onClick={() => setViewMode("2d")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono transition-colors ${
                  viewMode === "2d" ? "bg-accent/20 text-accent" : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                2D
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {GRAPH_REPOS.map((repo) => (
            <button
              key={repo.id}
              onClick={() => setActiveRepo(repo.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                activeRepo === repo.id
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-text-tertiary hover:text-text-secondary border border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {repo.id}
            </button>
          ))}
        </div>

        <p className="text-sm text-text-secondary mb-3">
          {viewMode === "3d"
            ? `Every symbol in ${currentGraphRepo.label} rendered as an interactive 3D graph. Each dot is a code symbol. Curved lines show relationships. Clusters form around directories.`
            : `How symbols flow from directories to types in ${currentGraphRepo.label}. Left side shows where code lives, right side shows what kind of symbols Myceliums extracted.`}
        </p>
      </div>
      <div className="h-[400px] md:h-[500px]">
        {viewMode === "3d" ? (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-text-tertiary font-mono">Loading 3D graph...</span>
              </div>
            }
          >
            <RepoGraph3D key={activeRepo} src={currentGraphRepo.file} />
          </Suspense>
        ) : graphCache[activeRepo] ? (
          <Suspense fallback={null}>
            <SankeyGraph key={activeRepo} data={graphCache[activeRepo]} />
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-text-tertiary font-mono">Loading diagram...</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default function HeroFeaturesWrapper() {
  const features = HERO_FEATURES.filter((f) => f.id !== "mcp-integration" && f.id !== "knowledge-graph");
  return (
    <>
      {features.map((feature, index) => (
        <HeroFeatureSection key={feature.id} feature={feature} index={index}>
        </HeroFeatureSection>
      ))}
    </>
  );
}
