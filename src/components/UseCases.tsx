"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  UserPlus,
  Building2,
  GitPullRequest,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
  example: string;
}

const useCases: UseCase[] = [
  {
    icon: ShieldAlert,
    title: "CI Impact Checks",
    description:
      "Run impact detection in your CI pipeline. Every pull request shows exactly which processes and communities are affected by the change.",
    example: "myc impact --changed src/payments/service.ts",
  },
  {
    icon: UserPlus,
    title: "Codebase Onboarding",
    description:
      "New team members (or new AI agents) get a complete map of your architecture in seconds. No more weeks of guessing at structure.",
    example: "myc analyze ./project && myc query 'MATCH (s) RETURN s.community, count(*)'",
  },
  {
    icon: Building2,
    title: "Architecture Audits",
    description:
      "Discover hidden dependencies, circular references, and tightly coupled modules. Community detection reveals your real architecture.",
    example: "myc visualize --communities",
  },
  {
    icon: GitPullRequest,
    title: "AI-Assisted Code Reviews",
    description:
      "AI agents review code with full context: not just the diff, but the call chain, affected processes, and downstream impact.",
    example: "myc context PaymentService --depth 3",
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          Built for real workflows
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-16"
        >
          From pre-merge checks to onboarding new engineers, code intelligence
          fits into how teams actually work.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="group p-6 bg-surface border border-border rounded-lg hover:border-accent/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <useCase.icon className="w-5 h-5 text-accent-glow" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{useCase.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
              <div className="bg-background/50 border border-border rounded-md px-4 py-2.5">
                <code className="text-xs font-mono text-accent-glow/80">
                  $ {useCase.example}
                </code>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
