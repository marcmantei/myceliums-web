"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideProps } from "lucide-react";
import {
  Network, Waves, CircleDot, Route, TerminalSquare,
  Plug, Search, Zap, Eye, Shield, FileQuestion,
  Brain, AlertTriangle, Download, GitCompare, RefreshCw,
  Target, Unplug, RotateCcw,
} from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import KnowledgeGraphCard from "@/components/cards/KnowledgeGraphCard";
import ImpactDetectionCard from "@/components/cards/ImpactDetectionCard";
import StructureVsStringsCard from "@/components/cards/StructureVsStringsCard";
import LiveSyncCard from "@/components/cards/LiveSyncCard";
import CommunityDetectionCard from "@/components/cards/CommunityDetectionCard";
import ProcessTracingCard from "@/components/cards/ProcessTracingCard";
import CypherQueryCard from "@/components/cards/CypherQueryCard";
import MCPIntegrationCard from "@/components/cards/MCPIntegrationCard";
import HybridSearchCard from "@/components/cards/HybridSearchCard";
import TokenOptimizedCard from "@/components/cards/TokenOptimizedCard";
import D3VisualizationCard from "@/components/cards/D3VisualizationCard";
import LocalFirstCard from "@/components/cards/LocalFirstCard";

gsap.registerPlugin(ScrollTrigger);

interface FeatureConfig {
  title: string;
  description: string;
  icon: React.FC<LucideProps>;
  animation: React.ComponentType;
  size: "large" | "medium" | "small";
  sectionId?: string;
}

const FEATURES: FeatureConfig[] = [
  {
    title: "Knowledge Graph",
    description: "Parses 23 languages into a structured graph of symbols, relationships, and call chains.",
    icon: Network,
    animation: KnowledgeGraphCard,
    size: "large",
    sectionId: "knowledge-graph",
  },
  {
    title: "Impact Detection",
    description: "Analyze the blast radius of any change before shipping. Traces through calls and imports to find every affected function and process.",
    icon: Waves,
    animation: ImpactDetectionCard,
    size: "large",
  },
  {
    title: "Structure, not guesswork",
    description: "Organized relationships between functions, types, and modules. Ready to reason about, not raw file contents.",
    icon: Network,
    animation: StructureVsStringsCard,
    size: "medium",
  },
  {
    title: "Community Detection",
    description: "Leiden algorithm groups related code into logical clusters. Modularity scoring, cohesion metrics, and inter-community coupling reveal architectural quality.",
    icon: CircleDot,
    animation: CommunityDetectionCard,
    size: "medium",
  },
  {
    title: "Process Tracing",
    description: "Maps execution flows from entry points through entire call chains automatically.",
    icon: Route,
    animation: ProcessTracingCard,
    size: "medium",
  },
  {
    title: "Cypher Queries",
    description: "Query your codebase like a database with the same language as Neo4j.",
    icon: TerminalSquare,
    animation: CypherQueryCard,
    size: "medium",
  },
  {
    title: "MCP Integration",
    description: "54 tools for AI agents, with one-command setup for 11 editors and agents. Claude Code, Cursor, Copilot, Gemini, and more via Model Context Protocol.",
    icon: Plug,
    animation: MCPIntegrationCard,
    size: "medium",
  },
  {
    title: "Hybrid Search",
    description: "BM25 keyword + semantic vector search with Reciprocal Rank Fusion for the best of both worlds.",
    icon: Search,
    animation: HybridSearchCard,
    size: "small",
  },
  {
    title: "Token-Optimized",
    description: "5-20x fewer tokens for code review. Structural summaries instead of full files.",
    icon: Zap,
    animation: TokenOptimizedCard,
    size: "small",
  },
  {
    title: "Interactive Viz",
    description: "Force-directed, hierarchical, and radial graph layouts with community drill-down, metrics overlay, and SVG export.",
    icon: Eye,
    animation: D3VisualizationCard,
    size: "small",
  },
  {
    title: "Local-First",
    description: "No cloud. No telemetry. No API calls. Your code never leaves your machine.",
    icon: Shield,
    animation: LocalFirstCard,
    size: "small",
  },
  {
    title: "Circular Dependency Detection",
    description: "Detect mutual imports and call cycles via Tarjan's SCC algorithm. No other tool does this automatically.",
    icon: RotateCcw,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div className="text-danger">{"Cycle 1 (3 symbols, 2 files):"}</div>
        <div className="text-warning">{"  auth → billing → auth"}</div>
        <div className="text-danger mt-2">{"Cycle 2 (2 symbols, 1 file):"}</div>
        <div className="text-warning">{"  parse → validate → parse"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Centrality Metrics",
    description: "Four centrality metrics — betweenness, closeness, eigenvector, degree — identify bridge symbols, bottlenecks, and critical paths.",
    icon: Target,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div>{"#  Name         Between  Close"}</div>
        <div className="text-accent">{"1  processReq   0.8421  0.7103"}</div>
        <div className="text-warning">{"2  authMiddle   0.6234  0.6891"}</div>
        <div className="text-text-tertiary">{"3  dbConnect    0.4102  0.5540"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Module Coupling",
    description: "Afferent/efferent coupling and instability metrics per module. Find fragile code and transitive dependency chains.",
    icon: Unplug,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div>{"Module        Ca  Ce  Instability"}</div>
        <div className="text-danger">{"src/api        2   8  0.8000"}</div>
        <div className="text-warning">{"src/auth       5   3  0.3750"}</div>
        <div className="text-success">{"src/core       9   1  0.1000"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Design Rationale",
    description: "Extracts WHY/TODO/HACK comments and links them to the code they explain. Know the reasoning, not just the structure.",
    icon: FileQuestion,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div className="text-warning">{"// HACK: temporary workaround for #142"}</div>
        <div className="text-accent">{"→ linked to: processPayment()"}</div>
        <div className="text-warning mt-2">{"// TODO: add retry logic here"}</div>
        <div className="text-accent">{"→ linked to: fetchUserData()"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Architectural Intelligence",
    description: "God nodes, surprising connections, and auto-generated reports surface hidden bottlenecks and coupling.",
    icon: Brain,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div className="text-danger">{"God node: AppRouter (47 connections)"}</div>
        <div className="text-warning mt-1">{"Surprising: auth → billing (0.92)"}</div>
        <div className="text-success mt-1">{"Report: 3 bottlenecks, 2 isolated"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Knowledge Gaps",
    description: "Finds untested code, isolated modules, and documentation holes automatically.",
    icon: AlertTriangle,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div className="text-danger">{"Untested: handlePayment() (8 callers)"}</div>
        <div className="text-warning mt-1">{"Isolated: legacy/ (1 external edge)"}</div>
        <div className="text-text-tertiary mt-1">{"No docs: src/core/ (23 symbols)"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Multi-Format Export",
    description: "Export to GraphML, Neo4j Cypher, SVG, JSON, or generate an Obsidian wiki from your knowledge graph.",
    icon: Download,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div>{"myc export --format graphml"}</div>
        <div>{"myc export --format cypher"}</div>
        <div>{"myc export --format svg"}</div>
        <div>{"myc wiki --output docs/"}</div>
      </div>
    ),
    size: "small",
  },
  {
    title: "Always up to date",
    description: "Git hooks auto-update on every commit. Graph diff tracks what changed. Your understanding stays current.",
    icon: RefreshCw,
    animation: LiveSyncCard,
    size: "small",
    sectionId: "problem-solution",
  },
  {
    title: "Graph Diff",
    description: "Compare graph snapshots to track how your architecture evolves over time.",
    icon: GitCompare,
    animation: () => (
      <div className="flex flex-col gap-1 p-3 text-[10px] font-mono text-text-tertiary">
        <div className="text-success">{"+12 symbols added"}</div>
        <div className="text-danger">{"-3 symbols removed"}</div>
        <div className="text-success">{"+8 relationships"}</div>
        <div className="text-warning">{"2 communities changed"}</div>
      </div>
    ),
    size: "small",
  },
];

function FeatureCard({ feature }: { feature: FeatureConfig }) {
  const Icon = feature.icon;
  const Animation = feature.animation;
  const isLarge = feature.size === "large";
  const isClickable = !!feature.sectionId;

  const handleClick = () => {
    if (!feature.sectionId) return;
    const el = document.getElementById(feature.sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <GlassCard
      className={`
        feature-card group
        ${isLarge ? "md:col-span-2 md:row-span-2" : ""}
        ${isClickable ? "cursor-pointer" : ""}
      `}
    >
      <div
        className={`flex flex-col h-full ${isLarge ? "p-6 lg:p-8" : "p-4 lg:p-5"}`}
        onClick={handleClick}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`
            flex items-center justify-center rounded-lg bg-accent/10
            group-hover:bg-accent/20 transition-colors
            ${isLarge ? "w-10 h-10" : "w-8 h-8"}
          `}>
            <Icon className={`text-accent ${isLarge ? "w-5 h-5" : "w-4 h-4"}`} />
          </div>
          <h3 className={`font-semibold ${isLarge ? "text-lg" : "text-sm"}`}>
            {feature.title}
          </h3>
          {isClickable && (
            <span className="ml-auto text-accent/0 group-hover:text-accent/60 transition-colors text-xs">↓</span>
          )}
        </div>

        {/* Description */}
        <p className={`text-text-secondary leading-relaxed mb-4 ${isLarge ? "text-sm" : "text-xs"}`}>
          {feature.description}
        </p>

        {/* Animation canvas */}
        <div className={`
          flex-1 rounded-lg overflow-hidden bg-white/[0.01] border border-white/[0.04]
          ${isLarge ? "min-h-[180px]" : "min-h-[100px]"}
        `}>
          <Animation />
        </div>
      </div>
    </GlassCard>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".feature-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: {
          amount: 0.8,
          from: "center",
        },
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="features" className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header — left-aligned, matching other sections */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Network className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">What Myceliums can do</h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            15 capabilities built into a single binary. Click any card to see it in detail.
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            From parsing and graph construction to impact detection, search, and AI agent tooling.
          </h3>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
