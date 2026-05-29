"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import SectionWrapper from "@/components/ui/section-wrapper";
import GlassCard from "@/components/ui/glass-card";
import {
  Eye,
  Shield,
  GitBranch,
  Network,
  Activity,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Lazy-load heavy demo components
const ArchitectureGraphDemo = dynamic(
  () => import("@/components/demos/ArchitectureGraphDemo"),
  { ssr: false }
);
const HotspotDemo = dynamic(
  () => import("@/components/demos/HotspotDemo"),
  { ssr: false }
);
const ArchLintDemo = dynamic(
  () => import("@/components/demos/ArchLintDemo"),
  { ssr: false }
);
const DriftDetectionDemo = dynamic(
  () => import("@/components/demos/DriftDetectionDemo"),
  { ssr: false }
);
const CodeownersCard = dynamic(
  () => import("@/components/cards/CodeownersCard"),
  { ssr: false }
);
const ApiContractCard = dynamic(
  () => import("@/components/cards/ApiContractCard"),
  { ssr: false }
);
const AdrCard = dynamic(() => import("@/components/cards/AdrCard"), {
  ssr: false,
});

const TABS = [
  { id: "guard", label: "Guard", icon: Shield },
  { id: "visualize", label: "Visualize", icon: Eye },
  { id: "track", label: "Track", icon: GitBranch },
] as const;

type TabId = (typeof TABS)[number]["id"];

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-48 text-text-tertiary text-sm">
      <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mr-2" />
      Loading...
    </div>
  );
}

export default function ArchitectureIntelligence() {
  const [activeTab, setActiveTab] = useState<TabId>("guard");

  return (
    <SectionWrapper
      id="architecture-intelligence"
      stagger
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12" data-animate>
          <p className="text-sm font-mono text-white/30 mb-4 tracking-wider">
            // architecture intelligence
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Your architecture,{" "}
            <span className="text-accent">always visible</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mt-4">
            Once the knowledge graph is built, Myceliums becomes your
            architecture guardian — visualizing services, detecting drift,
            and flagging quality issues automatically.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center gap-2 mb-8" data-animate>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-text-tertiary hover:text-text-secondary border border-transparent hover:border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div data-animate>
          {/* ─── Visualize ──────────────────────────────────── */}
          {activeTab === "visualize" && (
            <div className="space-y-6">
              {/* Mermaid Architecture Diagram — full width, repo selector */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Network className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Interactive Architecture
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      Drag nodes, zoom, hover for details — pick a repo to explore
                    </p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
                    NEW
                  </span>
                </div>
                <Suspense fallback={<LoadingSpinner />}>
                  <ArchitectureGraphDemo />
                </Suspense>
              </GlassCard>

              {/* Secondary cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <CodeownersCard />
                </Suspense>
                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c] p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🏷</span>
                    <span className="text-xs font-mono text-text-secondary">Service Mapping</span>
                  </div>
                  <p className="text-[11px] text-text-tertiary leading-relaxed">
                    Name your communities as services for meaningful architecture labels.
                    Maps are persisted and used across all architecture tools.
                  </p>
                  <div className="mt-3 font-mono text-[11px] text-text-tertiary bg-black/30 rounded-lg p-3">
                    <span className="text-accent">map_service</span>{" "}
                    <span className="text-white/40">community=&quot;auth&quot; name=&quot;Auth Service&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Guard ──────────────────────────────────────── */}
          {activeTab === "guard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Architecture Lint */}
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Architecture Lint
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        4 rules: cycles, god nodes, fan-out, instability
                      </p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
                      NEW
                    </span>
                  </div>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ArchLintDemo />
                  </Suspense>
                </GlassCard>

                {/* Quality Hotspots */}
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Quality Hotspots
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        Centrality x churn x instability = refactor priority
                      </p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
                      NEW
                    </span>
                  </div>
                  <Suspense fallback={<LoadingSpinner />}>
                    <HotspotDemo />
                  </Suspense>
                </GlassCard>
              </div>

              {/* API Contracts */}
              <Suspense fallback={<LoadingSpinner />}>
                <ApiContractCard />
              </Suspense>
            </div>
          )}

          {/* ─── Track ──────────────────────────────────────── */}
          {activeTab === "track" && (
            <div className="space-y-6">
              {/* Drift Detection */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Architecture Drift Detection
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      Compare snapshots to track how your architecture evolves
                    </p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
                    NEW
                  </span>
                </div>
                <Suspense fallback={<LoadingSpinner />}>
                  <DriftDetectionDemo />
                </Suspense>
              </GlassCard>

              {/* ADR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Architecture Decision Records
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        Track the &quot;why&quot; behind your architecture
                      </p>
                    </div>
                  </div>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdrCard />
                  </Suspense>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Snapshot Versioning
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Every analysis creates a timestamped snapshot of your
                    knowledge graph. Compare any two snapshots to see exactly
                    what changed — new symbols, removed edges, community
                    restructuring — with a single MCP tool call.
                  </p>
                  <div className="mt-4 font-mono text-[11px] text-text-tertiary bg-black/30 rounded-lg p-3">
                    <span className="text-accent">snapshot_diff</span>
                    <span className="text-white/40">
                      {" "}
                      repo_id=&quot;express&quot;
                    </span>
                    <br />
                    <span className="text-emerald-400">
                      +42 symbols, -3 symbols, +28 edges
                    </span>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </div>

        {/* Tagline */}
        <p className="text-center text-sm text-text-tertiary mt-10 font-mono" data-animate>
          All features available as MCP tools — works with Claude Code, Cursor,
          Windsurf, and any MCP client.
        </p>
      </div>
    </SectionWrapper>
  );
}
