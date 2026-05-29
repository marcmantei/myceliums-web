"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileCode, TreeDeciduous, Database, Network, Search,
  Cpu, Bot, BarChart3, Layers,
} from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

const PIPELINE = [
  { icon: FileCode, label: "Source Files", tech: "20+ languages", detail: "Your codebase" },
  { icon: TreeDeciduous, label: "tree-sitter", tech: "Parser", detail: "AST extraction" },
  { icon: Database, label: "Symbol Store", tech: "LanceDB", detail: "Vectors + metadata" },
  { icon: Network, label: "Graph Build", tech: "Relationships", detail: "Calls, imports, members" },
  { icon: BarChart3, label: "Communities", tech: "Leiden", detail: "Architecture clusters" },
  { icon: Search, label: "Search Index", tech: "BM25 + Vectors", detail: "Hybrid retrieval" },
  { icon: Cpu, label: "Process Trace", tech: "Entry→Exit", detail: "Execution flows" },
  { icon: Bot, label: "AI Agents", tech: "MCP / CLI", detail: "41 tools exposed" },
];

const CRATES = [
  { name: "myc", description: "CLI binary", level: 0 },
  { name: "myceliums-mcp", description: "MCP server", level: 1 },
  { name: "myceliums-core", description: "Parsing, analysis, search", level: 1 },
  { name: "myceliums-storage", description: "LanceDB persistence", level: 2 },
  { name: "myceliums-cypher", description: "Cypher query engine", level: 2 },
  { name: "myceliums-http", description: "Visualization server", level: 2 },
];

function PipelineStage({
  stage,
  isLast,
}: {
  stage: (typeof PIPELINE)[0];
  isLast: boolean;
}) {
  const Icon = stage.icon;

  return (
    <div className="pipeline-stage flex flex-col items-center relative">
      <div className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-accent/30 transition-colors w-full">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <span className="text-xs font-semibold text-center">{stage.label}</span>
        <span className="text-[11px] text-accent font-mono">{stage.tech}</span>
        <span className="text-[11px] text-text-tertiary text-center">{stage.detail}</span>
      </div>

      {!isLast && (
        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-accent/30">
          →
        </div>
      )}
    </div>
  );
}

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelector(".arch-header");
      if (header) {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });
      }

      const stages = sectionRef.current.querySelectorAll(".pipeline-stage");
      gsap.from(stages, {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: pipelineRef.current,
          start: "top 75%",
        },
      });

      const light = sectionRef.current.querySelector(".pipeline-light");
      if (light && pipelineRef.current) {
        gsap.fromTo(
          light,
          { left: "0%", opacity: 0 },
          {
            left: "100%",
            opacity: 1,
            duration: 3,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 1,
            scrollTrigger: {
              trigger: pipelineRef.current,
              start: "top 70%",
            },
          }
        );
      }

      const crates = sectionRef.current.querySelectorAll(".crate-card");
      gsap.from(crates, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current.querySelector(".crate-grid"),
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header: left-aligned, matching HeroFeatureSection style */}
        <div className="arch-header mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Layers className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Architecture</h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            What happens when you run <code className="text-accent font-mono text-base">myc analyze</code>?
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            From source files to AI-ready knowledge in 8 stages. All local, all Rust, all under a second for queries.
          </h3>
          <p className="text-text-secondary mt-4">
            Your code passes through a pipeline of parsing, graph construction, community detection, and indexing.
            The result is a structured knowledge graph that any AI agent can query via MCP or CLI.
          </p>
        </div>

        {/* Pipeline */}
        <div ref={pipelineRef} className="relative mb-16">
          <div className="pipeline-light absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent/20 blur-xl z-0 pointer-events-none" />

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
            {PIPELINE.map((stage, i) => (
              <PipelineStage
                key={stage.label}
                stage={stage}
                isLast={i === PIPELINE.length - 1}
              />
            ))}
          </div>

          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-y-1/2 z-0" />
        </div>

        {/* Rust Workspace */}
        <GlassCard className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg font-semibold">Rust Workspace</span>
            <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-accent/10 text-accent border border-accent/20">
              6 crates
            </span>
          </div>
          <div className="crate-grid grid grid-cols-2 md:grid-cols-3 gap-3">
            {CRATES.map((crate) => (
              <div
                key={crate.name}
                className="crate-card p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-accent/20 transition-colors"
              >
                <div className="font-mono text-sm text-accent">{crate.name}</div>
                <div className="text-xs text-text-secondary mt-1">{crate.description}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-text-tertiary">
            All local. No cloud dependencies. Zero telemetry. Written in Rust for maximum performance and safety.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
