"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const quickStart = `# 1. Analyze your project
myc analyze ./your-project

# 2. Search for symbols
myc search "handler"

# 3. Query the graph
myc query 'MATCH (s:CodeSymbol)-[:CALLS]->(t) RETURN s.name, t.name LIMIT 10'

# 4. Connect to your AI agent (Claude Code, Cursor, etc.)
myc mcp`;

const mcpConfig = `{
  "mcpServers": {
    "myceliums": {
      "command": "myc",
      "args": ["mcp"]
    }
  }
}`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-surface-hover transition-colors text-text-secondary hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

export default function GetStarted() {
  return (
    <section id="get-started" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          From zero to knowledge graph in{" "}
          <span className="text-accent-glow">60 seconds</span>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-12"
        >
          Install, analyze, query. That&apos;s it.
        </motion.p>

        {/* Install command */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            Install
          </h3>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <code className="font-mono text-sm">
                <span className="text-success">$</span>{" "}
                <span className="text-foreground">
                  cargo install --path myc
                </span>
              </code>
              <CopyButton text="cargo install --path myc" />
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Or clone and build:{" "}
            <code className="font-mono text-accent-glow">
              git clone https://github.com/marcmantei/myceliums.git && cd
              myceliums && cargo build --release
            </code>
          </p>
        </motion.div>

        {/* Quick start */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            Quick Start
          </h3>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-xs text-text-secondary font-mono">
                terminal
              </span>
              <CopyButton text={quickStart.replace(/^# .*\n/gm, "")} />
            </div>
            <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto leading-relaxed">
              {quickStart}
            </pre>
          </div>
        </motion.div>

        {/* MCP config */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            MCP Configuration
          </h3>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-xs text-text-secondary font-mono">
                .claude/settings.json
              </span>
              <CopyButton text={mcpConfig} />
            </div>
            <pre className="p-4 text-sm font-mono text-accent-glow/80 overflow-x-auto leading-relaxed">
              {mcpConfig}
            </pre>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Works with Claude Code, Cursor, Windsurf, and any MCP-compatible
            agent.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
