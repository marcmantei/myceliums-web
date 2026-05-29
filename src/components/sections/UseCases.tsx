"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldAlert, UserPlus, Building2, GitPullRequest, BookOpen, MessageSquareWarning } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

const USE_CASES = [
  {
    icon: ShieldAlert,
    title: "Pre-deploy Safety",
    description:
      "Run impact detection on every PR. Know exactly which functions, communities, and processes are affected before merging.",
    command: "myc impact --diff HEAD~1",
  },
  {
    icon: UserPlus,
    title: "Codebase Onboarding",
    description:
      "New team members understand architecture in minutes. Process tracing shows how data flows, communities show boundaries.",
    command: "myc processes ./my-project",
  },
  {
    icon: Building2,
    title: "Architecture Audits",
    description:
      "Community detection reveals actual module boundaries. Find hidden coupling, circular dependencies, and god classes.",
    command: "myc communities ./my-project",
  },
  {
    icon: GitPullRequest,
    title: "AI-Powered Code Review",
    description:
      "Token-optimized context gives AI agents structured understanding instead of raw files. 50x fewer tokens, better reviews.",
    command: "myc review --diff HEAD~1",
  },
  {
    icon: BookOpen,
    title: "Documentation Generation",
    description:
      "Generate an Obsidian vault from your knowledge graph. Every community becomes a page with symbols, relationships, and cross-references.",
    command: "myc wiki ./my-project --output docs/",
  },
  {
    icon: MessageSquareWarning,
    title: "AI Review Intelligence",
    description:
      "Auto-generated review questions highlight risky changes, god nodes, and missing tests before you merge.",
    command: "myc report ./my-project",
  },
];

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".usecase-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="use-cases" className="section-spacing pt-32 md:pt-40 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-accent">
            USE CASES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Built for real workflows
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <GlassCard key={uc.title} className="usecase-card p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">{uc.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {uc.description}
                </p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-success text-xs">$</span>
                  <code className="text-xs text-text-secondary font-mono">{uc.command}</code>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
