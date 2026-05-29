"use client";

import { motion } from "framer-motion";
import {
  FileCode,
  TreePine,
  Boxes,
  Cog,
  Share2,
  Database,
  Plug,
  Bot,
  ChevronRight,
  ChevronDown,
  Shield,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface PipelineStage {
  icon: LucideIcon;
  label: string;
  tech: string;
  detail: string;
}

const stages: PipelineStage[] = [
  {
    icon: FileCode,
    label: "Source Files",
    tech: "14 Languages",
    detail: "Your codebase",
  },
  {
    icon: TreePine,
    label: "tree-sitter",
    tech: "Incremental Parser",
    detail: "Parse to AST",
  },
  {
    icon: Boxes,
    label: "AST",
    tech: "Syntax Tree",
    detail: "Symbols & structure",
  },
  {
    icon: Cog,
    label: "Rust Pipeline",
    tech: "Analysis Engine",
    detail: "Leiden + tracing",
  },
  {
    icon: Share2,
    label: "Knowledge Graph",
    tech: "LanceDB",
    detail: "Nodes & edges",
  },
  {
    icon: Database,
    label: "Cypher Engine",
    tech: "Query Language",
    detail: "MATCH / RETURN",
  },
  {
    icon: Plug,
    label: "MCP Server",
    tech: "JSON-RPC",
    detail: "Stdio transport",
  },
  {
    icon: Bot,
    label: "AI Agents",
    tech: "Claude / Cursor",
    detail: "Native queries",
  },
];

const languages = [
  { name: "TypeScript", supported: true },
  { name: "Python", supported: true },
  { name: "JavaScript", supported: true },
  { name: "Go", supported: true },
  { name: "Rust", supported: true },
  { name: "Java", supported: true },
  { name: "C#", supported: true },
  { name: "C/C++", supported: true },
  { name: "Ruby", supported: true },
  { name: "Kotlin", supported: true },
  { name: "Swift", supported: true },
  { name: "PHP", supported: true },
];

function Arrow({ horizontal }: { horizontal: boolean }) {
  if (horizontal) {
    return (
      <div className="hidden md:flex items-center justify-center shrink-0">
        <ChevronRight className="w-4 h-4 text-accent/50" />
      </div>
    );
  }
  return (
    <div className="flex md:hidden items-center justify-center py-1">
      <ChevronDown className="w-4 h-4 text-accent/50" />
    </div>
  );
}

function StageCard({ stage, index }: { stage: PipelineStage; index: number }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.4, delay: 0.08 * index }}
      className="group relative flex flex-row md:flex-col items-center gap-3 md:gap-2 p-4 md:p-3 bg-surface border border-border rounded-lg hover:border-accent/40 transition-all duration-300 min-w-0"
    >
      <div className="w-10 h-10 shrink-0 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
        <stage.icon className="w-5 h-5 text-accent-glow" />
      </div>
      <div className="text-left md:text-center min-w-0">
        <p className="text-sm font-semibold leading-tight">{stage.label}</p>
        <p className="text-[11px] font-mono text-accent-glow/70 leading-tight mt-0.5">
          {stage.tech}
        </p>
        <p className="text-xs text-text-secondary leading-tight mt-0.5">
          {stage.detail}
        </p>
      </div>
    </motion.div>
  );
}

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Pipeline Diagram */}
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          How the pipeline works
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-4"
        >
          From raw source to AI-queryable graph, every step runs locally in
          Rust.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center gap-2 mb-14"
        >
          <Shield className="w-4 h-4 text-success" />
          <span className="text-xs font-mono text-success">
            All local. No cloud. No telemetry.
          </span>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-center justify-center gap-1 mb-24">
          {stages.map((stage, i) => (
            <div key={stage.label} className="contents">
              <div className="flex-1 min-w-0 max-w-[140px]">
                <StageCard stage={stage} index={i} />
              </div>
              {i < stages.length - 1 && <Arrow horizontal />}
            </div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex md:hidden flex-col items-stretch gap-0 mb-24">
          {stages.map((stage, i) => (
            <div key={stage.label}>
              <StageCard stage={stage} index={i} />
              {i < stages.length - 1 && <Arrow horizontal={false} />}
            </div>
          ))}
        </div>

        {/* Crate Diagram */}
        <motion.h3
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold tracking-tight text-center mb-4"
        >
          Five crates. One workspace. Clean boundaries.
        </motion.h3>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-12"
        >
          Rust workspace architecture with clear separation of concerns.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3 max-w-4xl mx-auto mb-16"
        >
          {/* myc CLI - top level */}
          <div className="bg-surface border border-accent/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <code className="text-accent-glow font-mono font-semibold">
                  myc
                </code>
                <span className="text-sm text-text-secondary ml-3">
                  CLI binary, all user-facing commands
                </span>
              </div>
              <span className="text-xs font-mono text-text-secondary">
                clap
              </span>
            </div>
          </div>

          <div className="flex justify-center text-border text-xl">
            &#x25BC;
          </div>

          {/* core + mcp side by side */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-surface border border-border rounded-lg p-4">
              <code className="text-accent-glow font-mono font-semibold">
                myceliums-core
              </code>
              <p className="text-sm text-text-secondary mt-1">
                Parsing, analysis, community detection, search
              </p>
              <p className="text-xs font-mono text-text-secondary mt-2">
                tree-sitter, graphrs, fastembed
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <code className="text-accent-glow font-mono font-semibold">
                myceliums-mcp
              </code>
              <p className="text-sm text-text-secondary mt-1">
                MCP server exposing 8 tools to AI agents
              </p>
              <p className="text-xs font-mono text-text-secondary mt-2">
                rmcp
              </p>
            </div>
          </div>

          <div className="flex justify-center text-border text-xl">
            &#x25BC;
          </div>

          {/* storage - full width */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <code className="text-accent-glow font-mono font-semibold">
                  myceliums-storage
                </code>
                <span className="text-sm text-text-secondary ml-3">
                  LanceDB persistence, Arrow schemas, CRUD
                </span>
              </div>
              <span className="text-xs font-mono text-text-secondary">
                lancedb, arrow
              </span>
            </div>
          </div>

          <div className="flex justify-center text-border text-xl">
            &#x25BC;
          </div>

          {/* cypher - bottom */}
          <div className="bg-surface border border-border rounded-lg p-4 max-w-sm mx-auto">
            <div className="text-center">
              <code className="text-accent-glow font-mono font-semibold">
                myceliums-cypher
              </code>
              <p className="text-sm text-text-secondary mt-1">
                Cypher query lexer, parser, and executor
              </p>
              <p className="text-xs font-mono text-text-secondary mt-2">
                logos
              </p>
            </div>
          </div>
        </motion.div>

        {/* Language support */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.35 }}>
          <h3 className="text-lg font-semibold text-center mb-6">
            14 Languages Supported
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className={`px-4 py-2 rounded-lg border text-sm font-mono ${
                  lang.supported
                    ? "border-success/30 bg-success/5 text-success"
                    : "border-border bg-surface text-text-secondary"
                }`}
              >
                {lang.name}{" "}
                {lang.supported ? (
                  <span className="ml-1">&#10003;</span>
                ) : (
                  <span className="ml-1 text-xs">planned</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
