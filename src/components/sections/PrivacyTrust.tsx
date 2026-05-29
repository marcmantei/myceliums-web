"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Eye, Lock, Server, Star } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    icon: Lock,
    title: "Local-First Architecture",
    details: ["All processing on your machine", "LanceDB embedded storage", "No network calls during analysis"],
  },
  {
    icon: Eye,
    title: "Open Source & Auditable",
    details: ["AGPL-3.0 licensed", "Full source on GitHub", "Community-driven development"],
  },
  {
    icon: Server,
    title: "Zero Telemetry",
    details: ["No usage tracking", "No analytics", "No phone-home behavior"],
  },
  {
    icon: Shield,
    title: "No Vendor Lock-In",
    details: ["Standard formats", "Exportable graph data", "Works offline forever"],
  },
];

export default function PrivacyTrust() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/marcmantei/myceliums")
      .then((r) => r.json())
      .then((d) => {
        if (d.stargazers_count !== undefined) setStars(d.stargazers_count);
      })
      .catch(() => {});
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".pillar-card");
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
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
    <section ref={sectionRef} className="section-spacing pt-32 md:pt-40 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-success">
            100% LOCAL · ZERO TELEMETRY · AGPL-3.0 LICENSE
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Privacy by architecture, not by promise
          </h2>
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <GlassCard key={pillar.title} className="pillar-card p-5">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-semibold mb-3">{pillar.title}</h3>
                <ul className="space-y-1.5">
                  {pillar.details.map((detail) => (
                    <li key={detail} className="text-xs text-text-secondary flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-success/40 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            );
          })}
        </div>

        {/* LLM Provider Data Flow */}
        <div className="mb-12">
          <h3 className="text-center text-lg font-semibold mb-8 text-white/80">
            You choose where your data goes
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Local */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 text-center">
              <div className="text-2xl mb-3">🏠</div>
              <h4 className="font-semibold text-emerald-400 mb-2">Local AI</h4>
              <p className="text-xs text-white/50 mb-3">Ollama, HuggingFace, local models</p>
              <div className="space-y-1.5 text-xs font-mono text-white/40">
                <div>Your code &rarr; Your machine</div>
                <div>&rarr; Your local LLM</div>
                <div className="text-emerald-400 font-semibold">&rarr; Answers stay internal</div>
              </div>
              <span className="inline-block mt-3 px-2 py-1 text-[11px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Nothing leaves your network
              </span>
            </div>

            {/* Cloud */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 text-center">
              <div className="text-2xl mb-3">☁️</div>
              <h4 className="font-semibold text-amber-400 mb-2">Cloud AI</h4>
              <p className="text-xs text-white/50 mb-3">Claude, ChatGPT, Gemini APIs</p>
              <div className="space-y-1.5 text-xs font-mono text-white/40">
                <div>Your code &rarr; Your machine</div>
                <div>&rarr; API call (encrypted)</div>
                <div className="text-amber-400 font-semibold">&rarr; Query data leaves network</div>
              </div>
              <span className="inline-block mt-3 px-2 py-1 text-[11px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                You control what gets sent
              </span>
            </div>

            {/* No LLM */}
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-5 text-center">
              <div className="text-2xl mb-3">🔒</div>
              <h4 className="font-semibold text-sky-400 mb-2">No AI needed</h4>
              <p className="text-xs text-white/50 mb-3">Pure structural matching</p>
              <div className="space-y-1.5 text-xs font-mono text-white/40">
                <div>Your code &rarr; Your machine</div>
                <div>&rarr; Regex + graph traversal</div>
                <div className="text-sky-400 font-semibold">&rarr; Zero external calls</div>
              </div>
              <span className="inline-block mt-3 px-2 py-1 text-[11px] font-mono rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Works fully offline
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="px-3 py-1.5 text-xs font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg text-text-secondary">
            AGPL-3.0 License
          </span>
          {stars !== null && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg text-text-secondary">
              <Star className="w-3 h-3 text-warning" />
              {stars} stars
            </span>
          )}
          <a
            href="https://github.com/marcmantei/myceliums"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-mono text-accent border border-accent/20 rounded-lg hover:border-accent/40 transition-colors"
          >
            Audit the code yourself →
          </a>
        </div>
      </div>
    </section>
  );
}
