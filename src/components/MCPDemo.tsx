"use client";

import { motion } from "framer-motion";
import { Bot, ArrowRight, Database } from "lucide-react";

/**
 * Shows a simulated MCP integration session — an AI agent querying
 * myceliums tools, with annotated callouts on key parts.
 */
export default function MCPDemo() {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <div className="relative">
      {/* Flow diagram: Agent -> MCP -> Knowledge Graph */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg"
        >
          <Bot className="w-4 h-4 text-accent-glow" />
          <span className="text-xs font-mono text-text-secondary">Claude Code</span>
        </motion.div>
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <ArrowRight className="w-4 h-4 text-accent/50" />
        </motion.div>
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg"
        >
          <span className="text-xs font-mono text-accent-glow font-semibold">MCP</span>
        </motion.div>
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <ArrowRight className="w-4 h-4 text-accent/50" />
        </motion.div>
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg"
        >
          <Database className="w-4 h-4 text-accent-glow" />
          <span className="text-xs font-mono text-text-secondary">Knowledge Graph</span>
        </motion.div>
      </div>

      {/* Simulated Claude Code session */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-surface border border-border rounded-lg overflow-hidden"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface-hover/50">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="text-xs font-mono text-text-secondary ml-2">
            Claude Code: my-project
          </span>
        </div>

        {/* Session content */}
        <div className="p-4 font-mono text-xs space-y-3 leading-relaxed">
          {/* User prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <span className="text-accent-glow font-semibold">You:</span>{" "}
            <span className="text-foreground">What will break if I rename handleRequest?</span>
          </motion.div>

          {/* Tool call */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="relative"
          >
            <div className="pl-4 border-l-2 border-accent/30">
              <div className="text-text-secondary">
                <span className="text-accent/70">Tool:</span> myceliums.detect_impact
              </div>
              <div className="mt-1 bg-background/50 rounded px-3 py-2 text-text-secondary">
                <div>symbol: <span className="text-foreground">&quot;handleRequest&quot;</span></div>
              </div>
            </div>
            {/* Annotation callout */}
            <div className="absolute -right-2 top-0 translate-x-full hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 border-t border-dashed border-accent/40" />
                <span className="text-[10px] font-mono text-accent-glow bg-surface border border-accent/30 px-2 py-0.5 rounded whitespace-nowrap">
                  MCP tool call
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tool response */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            <div className="pl-4 border-l-2 border-success/30">
              <div className="text-text-secondary">
                <span className="text-success/70">Result:</span> Impact analysis
              </div>
              <div className="mt-1 bg-background/50 rounded px-3 py-2 text-text-secondary space-y-0.5">
                <div>Direct callers: <span className="text-foreground">createRouter, middleware</span></div>
                <div>Affected processes: <span className="text-foreground">3</span></div>
                <div>Affected communities: <span className="text-foreground">API, Auth</span></div>
                <div>Blast radius: <span className="text-[#F59E0B] font-semibold">7 symbols</span></div>
              </div>
            </div>
            {/* Annotation callout */}
            <div className="absolute -right-2 bottom-4 translate-x-full hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 border-t border-dashed border-success/40" />
                <span className="text-[10px] font-mono text-success bg-surface border border-success/30 px-2 py-0.5 rounded whitespace-nowrap">
                  Structured response
                </span>
              </div>
            </div>
          </motion.div>

          {/* Agent summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.4 }}
          >
            <span className="text-accent-glow font-semibold">Claude:</span>{" "}
            <span className="text-text-secondary">
              Renaming <span className="text-foreground">handleRequest</span> will impact{" "}
              <span className="text-foreground">7 symbols</span> across 2 communities.
              The main callers are <span className="text-foreground">createRouter</span> and{" "}
              <span className="text-foreground">middleware</span>. I recommend renaming in
              all 3 affected processes to avoid breaking the API flow.
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
