"use client";

import { motion } from "framer-motion";
import { Github, Eye, KeyRound, ShieldCheck, Users } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const points = [
  {
    icon: KeyRound,
    title: "Apache-2.0 License",
    description:
      "Fully open source. Fork it, modify it, contribute back to the community.",
  },
  {
    icon: ShieldCheck,
    title: "No telemetry",
    description: "Zero data collection. No analytics. No phone-home.",
  },
  {
    icon: Eye,
    title: "Auditable",
    description: "Read every line of code that touches your codebase.",
  },
  {
    icon: Users,
    title: "Community-driven",
    description: "Issues, PRs, and discussions on GitHub.",
  },
];

export default function OpenSource() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
        >
          Open source. Open graph.{" "}
          <span className="text-accent-glow">Open to contributions.</span>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary max-w-xl mx-auto mb-12"
        >
          Myceliums is Apache-2.0 licensed. Your code stays on your machine. The tool
          stays in your control.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12 text-left">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
              className="flex gap-4 p-4 bg-surface border border-border rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <point.icon className="w-5 h-5 text-accent-glow" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{point.title}</h3>
                <p className="text-sm text-text-secondary">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.a
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.35 }}
          href="https://github.com/marcmantei/myceliums"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-accent/50 rounded-lg text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" />
          View on GitHub
        </motion.a>
      </div>
    </section>
  );
}
