"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Network, Bot } from "lucide-react";
import CliOutput from "./CliOutput";
import GraphPreview from "./GraphPreview";
import MCPDemo from "./MCPDemo";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface Tab {
  id: string;
  icon: typeof Terminal;
  label: string;
  shortLabel: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: "cli",
    icon: Terminal,
    label: "CLI Analysis",
    shortLabel: "CLI",
    description: "Run myc analyze to parse your codebase into a knowledge graph",
  },
  {
    id: "graph",
    icon: Network,
    label: "Graph Visualization",
    shortLabel: "Graph",
    description: "Communities, relationships, and symbols, all auto-detected",
  },
  {
    id: "mcp",
    icon: Bot,
    label: "MCP Integration",
    shortLabel: "MCP",
    description: "AI agents query your knowledge graph natively via MCP tools",
  },
];

const cliLines = [
  { type: "input" as const, content: "myc analyze ./my-project", delay: 0 },
  { type: "output" as const, content: "Parsing source files...", delay: 400 },
  { type: "output" as const, content: "  src/auth/authenticate.ts", delay: 150 },
  { type: "output" as const, content: "  src/api/router.ts", delay: 100 },
  { type: "output" as const, content: "  src/api/handler.ts", delay: 100 },
  { type: "output" as const, content: "  src/storage/database.ts", delay: 100 },
  { type: "output" as const, content: "  src/storage/schema.ts", delay: 100 },
  { type: "output" as const, content: "", delay: 200 },
  { type: "output" as const, content: "Building knowledge graph...", delay: 300 },
  { type: "output" as const, content: "Running community detection (Leiden)...", delay: 400 },
  { type: "output" as const, content: "Tracing execution processes...", delay: 300 },
  { type: "output" as const, content: "", delay: 200 },
  { type: "stats" as const, content: "  Symbols:        12", delay: 150 },
  { type: "stats" as const, content: "  Relationships:  14", delay: 100 },
  { type: "stats" as const, content: "  Communities:     3", delay: 100 },
  { type: "stats" as const, content: "  Processes:       5", delay: 100 },
  { type: "output" as const, content: "", delay: 150 },
  { type: "stats" as const, content: "Done in 1.8s", delay: 200 },
  { type: "output" as const, content: "", delay: 100 },
  { type: "input" as const, content: "myc query 'MATCH (s:CodeSymbol)-[:CALLS]->(t) RETURN s.name, t.name LIMIT 5'", delay: 600 },
  { type: "output" as const, content: "", delay: 300 },
  { type: "stats" as const, content: "  authenticate  ->  verifyToken", delay: 150 },
  { type: "stats" as const, content: "  createRouter  ->  handleRequest", delay: 100 },
  { type: "stats" as const, content: "  createRouter  ->  middleware", delay: 100 },
  { type: "stats" as const, content: "  middleware     ->  authenticate", delay: 100 },
  { type: "stats" as const, content: "  handleRequest ->  Database", delay: 100 },
  { type: "output" as const, content: "", delay: 100 },
  { type: "output" as const, content: "5 rows returned", delay: 150 },
];

export default function SeeItInAction() {
  const [activeTab, setActiveTab] = useState("cli");

  return (
    <section id="see-it-in-action" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          See it in action
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-12"
        >
          From install to insight: three ways to interact with your code knowledge graph.
        </motion.p>

        {/* Step indicators */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center gap-2 md:gap-3 mb-10"
        >
          {tabs.map((tab, i) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-accent/10 border-accent/40 text-foreground"
                    : "bg-surface border-border text-text-secondary hover:border-accent/20 hover:text-foreground"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isActive
                      ? "bg-accent text-white"
                      : "bg-surface-hover text-text-secondary group-hover:bg-accent/20"
                  }`}
                >
                  {i + 1}
                </div>
                <tab.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent-glow" : ""}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-text-secondary text-center mb-8"
        >
          {tabs.find((t) => t.id === activeTab)?.description}
        </motion.p>

        {/* Tab content */}
        <motion.div
          key={`content-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "cli" && (
            <div className="max-w-3xl mx-auto">
              <CliOutput lines={cliLines} animate={true} />
              {/* Inline annotations below the terminal */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-mono text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>tree-sitter parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span>Leiden community detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span>Cypher query engine</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "graph" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-surface border border-border rounded-lg p-4 md:p-6">
                {/* Mock title bar for the graph viewer */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-mono text-text-secondary ml-2">
                    myc serve: localhost:9742
                  </span>
                </div>
                <GraphPreview />
              </div>
              {/* Annotation legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-mono text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>Auth community</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span>API community</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span>Storage community</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mcp" && (
            <div className="max-w-3xl mx-auto">
              <MCPDemo />
              {/* Available tools callout */}
              <div className="mt-6 bg-surface border border-border rounded-lg p-4">
                <p className="text-xs font-mono text-text-secondary mb-3">Available MCP tools:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "context_search",
                    "semantic_search",
                    "symbol_context",
                    "detect_impact",
                    "cypher_query",
                    "get_processes",
                    "hybrid_search",
                    "rename_symbol",
                  ].map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-1 bg-accent/5 border border-accent/20 rounded text-xs font-mono text-accent-glow"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
