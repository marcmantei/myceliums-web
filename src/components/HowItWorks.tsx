"use client";

import { motion } from "framer-motion";
import { Scan, GitBranch, Terminal } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const steps = [
  {
    icon: Scan,
    title: "Analyze",
    command: "myc analyze ./your-project",
    description:
      "Myceliums uses tree-sitter to parse your TypeScript and Python code into a structured symbol graph. Functions, classes, interfaces, imports: every relationship captured.",
    output: `Symbols:       142
Files:          23
Relationships: 387
Communities:     8
Processes:      12`,
  },
  {
    icon: GitBranch,
    title: "Graph Built Automatically",
    command: null,
    description:
      "Behind the scenes, Myceliums runs community detection (Leiden algorithm) to find clusters of related code, and process tracing to map execution flows from entry points through the call chain.",
    output: `Your Code  →  tree-sitter  →  LanceDB
  .ts / .py     parsing        storage
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
              Community              Process
              Detection              Tracing`,
  },
  {
    icon: Terminal,
    title: "Query via CLI or MCP",
    command: 'myc query \'MATCH (s:CodeSymbol) WHERE s.kind = "function" RETURN s.name LIMIT 5\'',
    description:
      "Use the CLI directly, write Cypher queries, or let AI agents query through MCP. Claude Code, Cursor, and Windsurf all work out of the box.",
    output: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          Three commands. Full understanding.
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-16"
        >
          From raw source files to a queryable knowledge graph in seconds.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-accent-glow" />
                </div>
                <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                  Step {i + 1}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                {step.description}
              </p>

              {(step.command || step.output) && (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                  {step.command && (
                    <div className="px-4 py-2 border-b border-border">
                      <code className="text-xs font-mono text-accent-glow">
                        $ {step.command}
                      </code>
                    </div>
                  )}
                  {step.output && (
                    <pre className="px-4 py-3 text-xs font-mono text-text-secondary overflow-x-auto leading-relaxed">
                      {step.output}
                    </pre>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
