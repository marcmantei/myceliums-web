"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const beforeCode = `$ agent: "What will break if I refactor PaymentService?"

→ grep -r "PaymentService" ./src
→ grep -r "payment" ./src
→ cat src/payments/service.ts
→ grep -r "import.*payment" ./src
→ ... 47 tool calls later
→ "I think these 3 files are affected"  (missed 11 more)`;

const afterCode = `$ myc impact PaymentService

Impact analysis for PaymentService:

  Direct callers:     4 functions
  Transitive impact: 14 functions across 8 files
  Affected processes: checkout, refund, subscription-renewal
  Communities hit:    payments, billing, notifications

  Full blast radius mapped in 0.3s`;

export default function Problem() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          {...fadeUp}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          Your codebase is opaque to AI agents.
          <br />
          <span className="text-accent-glow">Until now.</span>
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-2xl mx-auto mb-16"
        >
          Today&apos;s AI coding agents have no map of your code. They grep
          through files, guess at structure, and miss critical dependencies.
          They can&apos;t tell you what breaks when you change a function
          because they don&apos;t understand how your code connects.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wider">
              Before: Blind file search
            </div>
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-text-secondary font-mono">
                  agent
                </span>
              </div>
              <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto leading-relaxed">
                {beforeCode}
              </pre>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.25 }}>
            <div className="text-sm font-medium text-success mb-3 uppercase tracking-wider">
              After: Code intelligence
            </div>
            <div className="bg-surface border border-accent/30 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-text-secondary font-mono">
                  myc
                </span>
              </div>
              <pre className="p-4 text-sm font-mono text-success/90 overflow-x-auto leading-relaxed">
                {afterCode}
              </pre>
            </div>
          </motion.div>
        </div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-8 text-text-secondary font-medium"
        >
          Know the blast radius of every change. Graph intelligence, not grep.
        </motion.p>
      </div>
    </section>
  );
}
