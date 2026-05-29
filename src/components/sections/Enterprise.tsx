"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Mail, Brain } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    icon: Code2,
    title: "Code Intelligence",
    description:
      "20+ languages parsed with tree-sitter. Community detection, impact analysis, god node identification, and architectural reports generated automatically.",
    stats: "20+ languages · 41 MCP tools · Jupyter + PDF",
  },
  {
    icon: Mail,
    title: "Email & Document Understanding",
    description:
      "IMAP live sync, EML/MBOX parsing, thread reconstruction, and person deduplication. Every conversation becomes searchable context for your AI.",
    stats: "IMAP sync · Thread chains · Person graph",
  },
  {
    icon: Brain,
    title: "AI-Ready Infrastructure",
    description:
      "Local LLM enrichment via Ollama, 41 MCP tools for AI agents, knowledge graph queries via Cypher, and multi-format export to Neo4j, GraphML, SVG, or Obsidian.",
    stats: "Ollama · Cypher · GraphML · SVG · Wiki",
  },
];

export default function Enterprise() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".enterprise-card");
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
      className="section-spacing pt-32 md:pt-40 relative px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-success">
            FOR TEAMS & ENTERPRISES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mx-auto">
            Your company&apos;s knowledge,{" "}
            <span className="text-accent">connected</span>
          </h2>
          <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Myceliums builds a unified knowledge graph from everything your
            team produces: code, emails, documents, and notebooks. Your AI
            agents get structured context instead of searching through files.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <GlassCard key={pillar.title} className="enterprise-card">
                <div className="flex flex-col h-full p-5 lg:p-6">
                  {/* Icon + Title */}
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

                  {/* Stats line */}
                  <div className="mt-auto pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono text-text-tertiary">
                      {pillar.stats}
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
