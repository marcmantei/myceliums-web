"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Network, RefreshCw } from "lucide-react";
import type { LucideProps } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import TokenComparisonCard from "@/components/cards/TokenComparisonCard";
import StructureVsStringsCard from "@/components/cards/StructureVsStringsCard";
import LiveSyncCard from "@/components/cards/LiveSyncCard";

gsap.registerPlugin(ScrollTrigger);

interface Pillar {
  title: string;
  description: string;
  icon: React.FC<LucideProps>;
  animation: React.ComponentType;
}

const PILLARS: Pillar[] = [
  {
    title: "Instant codebase map",
    description:
      "Every symbol, relationship, and call chain, parsed across 20+ languages in seconds. No manual setup required.",
    icon: Zap,
    animation: TokenComparisonCard,
  },
  {
    title: "Structure, not guesswork",
    description:
      "Instead of searching through files, get organized relationships between functions, types, and modules, ready to reason about.",
    icon: Network,
    animation: StructureVsStringsCard,
  },
  {
    title: "Always up to date",
    description:
      "Git hooks auto-update on every commit. Graph diff tracks what changed. Your understanding stays current as the code evolves.",
    icon: RefreshCw,
    animation: LiveSyncCard,
  },
];

function PillarCard({ pillar }: { pillar: Pillar }) {
  const Icon = pillar.icon;
  const Animation = pillar.animation;

  return (
    <GlassCard className="trust-card">
      <div className="flex flex-col h-full p-5 lg:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10">
            <Icon className="w-4 h-4 text-accent" />
          </div>
          <h3 className="font-semibold text-base">{pillar.title}</h3>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {pillar.description}
        </p>

        {/* Animation */}
        <div className="flex-1 rounded-lg overflow-hidden bg-white/[0.01] border border-white/[0.04] min-h-[160px]">
          <Animation />
        </div>
      </div>
    </GlassCard>
  );
}

export default function AgentTrust() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".trust-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="agent-trust"
      className="section-spacing relative px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-accent">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mx-auto">
            One command.{" "}
            <span className="text-text-secondary">Complete codebase understanding.</span>
          </h2>
          <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Run <code className="text-accent font-mono">myc analyze</code> and
            get a structured map of your entire project, ready for you to
            explore or for your AI agent to use as context.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
