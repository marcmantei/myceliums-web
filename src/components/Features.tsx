"use client";

import { motion } from "framer-motion";
import {
  Network,
  CircleDot,
  Route,
  TerminalSquare,
  Waves,
  Plug,
  Search,
  Shield,
  Eye,
  Zap,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Waves,
    title: "Impact Detection",
    description:
      "Change a function and see the blast radius: every caller, every dependent process, every affected community. Know what breaks before you ship.",
  },
  {
    icon: Network,
    title: "Knowledge Graph",
    description:
      "Every symbol, relationship, and call chain across your entire codebase, structured, queryable, and ready for AI agents. Supports 14 languages.",
  },
  {
    icon: CircleDot,
    title: "Community Detection",
    description:
      "Leiden algorithm automatically groups related code into logical modules, even across file boundaries. Understand your architecture at a glance.",
  },
  {
    icon: Route,
    title: "Process Tracing",
    description:
      "Automatically traces execution flows from entry points through the entire call chain. Map how data moves through your system.",
  },
  {
    icon: Eye,
    title: "Interactive Visualization",
    description:
      "Explore your code graph with interactive D3.js visualizations. See clusters, dependencies, and architecture patterns visually.",
  },
  {
    icon: TerminalSquare,
    title: "Cypher Queries",
    description:
      "Query your code graph with Cypher, the same language used by Neo4j. MATCH, WHERE, RETURN, ORDER BY, LIMIT.",
  },
  {
    icon: Plug,
    title: "MCP Integration",
    description:
      "Expose your entire knowledge graph to AI agents. Claude Code, Cursor, and Windsurf query it natively via MCP.",
  },
  {
    icon: Search,
    title: "BM25 + Semantic Search",
    description:
      "Fast full-text search across all symbols with BM25 scoring. Semantic search with vector embeddings for natural-language queries.",
  },
  {
    icon: Zap,
    title: "Token-Optimized Reviews",
    description:
      "AI agents get precisely the context they need, no more reading entire files. Benchmarked at up to 99% fewer tool calls on real codebases.",
  },
  {
    icon: Shield,
    title: "Local-First",
    description:
      "Your code never leaves your machine. No API keys, no cloud, no telemetry. Everything runs locally with LanceDB embedded storage.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          Code intelligence, not just code search
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-16"
        >
          A graph of every relationship in your codebase: impact zones, call chains, and architecture patterns. Not a file index.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="group p-5 bg-surface border border-border rounded-lg hover:border-accent/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-5 h-5 text-accent-glow" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
