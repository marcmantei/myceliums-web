"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Workflow } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

const AGENTS = [
  { name: "Refactor Agent", task: "Restructuring auth module", tools: "symbol_context, detect_impact", status: "active" },
  { name: "Test Agent", task: "Generating tests for payments", tools: "get_processes, context_search", status: "active" },
  { name: "Review Agent", task: "Reviewing PR #247", tools: "detect_impact, cypher_query", status: "active" },
  { name: "Docs Agent", task: "Updating API documentation", tools: "search_documents, hybrid_search", status: "queued" },
];

function OrchestratorAnimation() {
  return (
    <div className="p-4 space-y-2">
      {/* Central knowledge graph node */}
      <div className="flex items-center justify-center mb-3">
        <div className="px-3 py-1.5 rounded-lg bg-accent/20 border border-accent/30 text-xs font-mono text-accent">
          Knowledge Graph
        </div>
      </div>

      {/* Agent connections */}
      {AGENTS.map((agent, i) => (
        <div
          key={agent.name}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-mono transition-all ${
            agent.status === "active"
              ? "border-emerald-500/20 bg-emerald-500/[0.04]"
              : "border-white/[0.06] bg-white/[0.02] opacity-50"
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
          <span className="text-white/70 w-24 truncate">{agent.name}</span>
          <span className="text-accent/50 ml-auto hidden sm:inline">{agent.tools.split(",")[0]}</span>
        </div>
      ))}
    </div>
  );
}

export default function OrchestratorHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelector(".orch-header");
      if (header) {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        });
      }

      const cards = sectionRef.current.querySelectorAll(".orch-card");
      if (cards.length) {
        gsap.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="orchestrator"
      className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header + Animation */}
        <div className="orch-header mb-12 md:mb-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Workflow className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Built for Agent Orchestration</h2>
            </div>

            <p className="text-lg text-text-secondary mb-4 italic">
              What happens when you deploy not one agent, but ten, all working on the same codebase at once?
            </p>
            <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
              Every agent gets the same structured context. No conflicts, no blind spots, no duplicated work.
            </h3>
            <p className="text-text-secondary mt-4">
              When an orchestrator dispatches multiple agents to a codebase, each one needs to understand the full architecture
              before making changes. Without a knowledge graph, every agent starts from scratch with grep and file reads.
              With Myceliums, they all share the same semantic understanding from the start: the complete call graph,
              community boundaries, and dependency map. The orchestrator assigns, the agents execute with precision.
            </p>
          </div>

          {/* Animation */}
          <div className="hero-animation">
            <div className="rounded-2xl border border-white/[0.06] bg-black/10 backdrop-blur-sm p-2 max-w-[360px] mx-auto lg:mx-0 lg:ml-auto">
              <OrchestratorAnimation />
            </div>
          </div>
        </div>

        {/* Value props */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          <GlassCard className="orch-card p-5 lg:p-6">
            <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">Shared context</p>
            <p className="text-2xl md:text-3xl font-bold text-accent">1 graph</p>
            <p className="text-sm text-text-secondary mt-2">All agents query the same knowledge graph. No redundant indexing.</p>
          </GlassCard>
          <GlassCard className="orch-card p-5 lg:p-6">
            <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">Conflict prevention</p>
            <p className="text-2xl md:text-3xl font-bold text-accent">0 overlaps</p>
            <p className="text-sm text-text-secondary mt-2">Impact detection shows each agent exactly what other agents might affect.</p>
          </GlassCard>
          <GlassCard className="orch-card p-5 lg:p-6">
            <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">Parallel execution</p>
            <p className="text-2xl md:text-3xl font-bold text-accent">N agents</p>
            <p className="text-sm text-text-secondary mt-2">Refactor, test, review, and document simultaneously on independent community boundaries.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
