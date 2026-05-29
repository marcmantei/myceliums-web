"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getLatestMetrics, DisplayMetrics } from "@/lib/metrics";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface Stat {
  value: string;
  label: string;
  detail: string;
}

const benchmarkStats: Stat[] = [
  {
    value: "41,952",
    label: "Symbols extracted",
    detail: "Functions, classes, interfaces, variables",
  },
  {
    value: "45,028",
    label: "Relationships mapped",
    detail: "Calls, imports, type references",
  },
  {
    value: "1.6s",
    label: "Analysis time",
    detail: "5,000+ file repository",
  },
  {
    value: "14",
    label: "Languages supported",
    detail: "TypeScript, Python, JavaScript, JSX, and more",
  },
];

export default function Proof() {
  const [metrics, setMetrics] = useState<DisplayMetrics | null>(null);

  useEffect(() => {
    getLatestMetrics()
      .then(setMetrics)
      .catch(() => {});
  }, []);

  return (
    <section id="proof" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent-glow tracking-wide uppercase">
            Benchmarked on real codebases
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          The numbers back it up
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-2xl mx-auto mb-16"
        >
          Verified benchmarks from real repository analysis. Every number is
          reproducible. Run the benchmarks yourself from the repo.
        </motion.p>

        {/* Benchmark stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {benchmarkStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
              className="p-5 bg-surface border border-border rounded-lg text-center"
            >
              <div className="text-3xl font-bold text-accent-glow mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-xs text-text-secondary">{stat.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* AI agent efficiency metrics */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-center mb-6">
            AI agent efficiency gains
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            <div className="flex-1 p-5 bg-surface border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {metrics?.time_reduction || "89%"}
              </div>
              <div className="text-sm text-text-secondary">Faster responses</div>
            </div>
            <div className="flex-1 p-5 bg-surface border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {metrics?.cost_savings || "87%"}
              </div>
              <div className="text-sm text-text-secondary">
                Fewer context bytes sent
              </div>
            </div>
            <div className="flex-1 p-5 bg-surface border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {metrics?.fewer_tool_calls || "80%"}
              </div>
              <div className="text-sm text-text-secondary">
                Fewer tool calls needed
              </div>
            </div>
          </div>
          <p className="text-center mt-4">
            <a
              href="https://github.com/marcmantei/myceliums/tree/main/benchmarks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:text-accent-glow transition-colors"
            >
              View benchmark methodology and raw results on GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
