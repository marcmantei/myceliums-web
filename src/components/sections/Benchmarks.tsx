"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

const LANG_COLORS: Record<string, { bg: string; text: string }> = {
  Python: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
  TypeScript: { bg: "rgba(6,182,212,0.15)", text: "#06B6D4" },
  JavaScript: { bg: "rgba(234,179,8,0.15)", text: "#EAB308" },
  Go: { bg: "rgba(20,184,166,0.15)", text: "#14B8A6" },
  Rust: { bg: "rgba(249,115,22,0.15)", text: "#F97316" },
};

interface RepoResult {
  name: string;
  language: string;
  stars: string;
  url: string;
  files: number;
  symbols: number;
  relationships: number;
  tokenReduction: number;
  callReduction: number;
  firstRun: string;
  incremental: string;
}

const REPOS: RepoResult[] = [
  { name: "django", language: "Python", stars: "82k", url: "https://github.com/django/django", files: 6492, symbols: 38210, relationships: 52417, tokenReduction: 99.8, callReduction: 94.8, firstRun: "~90m", incremental: "35.7s" },
  { name: "fastapi", language: "Python", stars: "82k", url: "https://github.com/fastapi/fastapi", files: 1118, symbols: 5330, relationships: 8089, tokenReduction: 99.7, callReduction: 92.8, firstRun: "9m", incremental: "0.9s" },
  { name: "zod", language: "TypeScript", stars: "35k", url: "https://github.com/colinhacks/zod", files: 361, symbols: 7327, relationships: 8403, tokenReduction: 99.9, callReduction: 94.7, firstRun: "11m", incremental: "0.8s" },
  { name: "express", language: "JavaScript", stars: "66k", url: "https://github.com/expressjs/express", files: 498, symbols: 2841, relationships: 3672, tokenReduction: 99.8, callReduction: 93.4, firstRun: "4.5m", incremental: "0.2s" },
  { name: "gin", language: "Go", stars: "80k", url: "https://github.com/gin-gonic/gin", files: 312, symbols: 1847, relationships: 2518, tokenReduction: 99.6, callReduction: 93.7, firstRun: "~3m", incremental: "0.1s" },
  { name: "tokio", language: "Rust", stars: "28k", url: "https://github.com/tokio-rs/tokio", files: 1024, symbols: 8493, relationships: 11247, tokenReduction: 99.7, callReduction: 94.7, firstRun: "24m", incremental: "0.3s" },
];

function RepoCard({ repo }: { repo: RepoResult }) {
  const lang = LANG_COLORS[repo.language];

  return (
    <GlassCard className="repo-card">
      <div className="p-4 lg:p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm hover:text-accent transition-colors"
            >
              {repo.name}
            </a>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: lang.bg, color: lang.text }}
              >
                {repo.language}
              </span>
              <span className="flex items-center gap-0.5 text-xs text-text-tertiary">
                <Star className="w-2.5 h-2.5" />
                {repo.stars}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div>
            <div className="text-xs font-mono font-semibold">{repo.files.toLocaleString()}</div>
            <div className="text-[11px] text-text-tertiary uppercase">Files</div>
          </div>
          <div>
            <div className="text-xs font-mono font-semibold">{repo.symbols.toLocaleString()}</div>
            <div className="text-[11px] text-text-tertiary uppercase">Symbols</div>
          </div>
          <div>
            <div className="text-xs font-mono font-semibold">{repo.relationships.toLocaleString()}</div>
            <div className="text-[11px] text-text-tertiary uppercase">Rels</div>
          </div>
        </div>

        {/* Timing */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-center">
          <div className="rounded-lg py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div className="text-xs font-mono font-semibold">{repo.firstRun}</div>
            <div className="text-[11px] text-text-tertiary uppercase">First run</div>
          </div>
          <div className="rounded-lg py-1.5" style={{ backgroundColor: "rgba(16,185,129,0.08)" }}>
            <div className="text-xs font-mono font-semibold" style={{ color: "#10B981" }}>{repo.incremental}</div>
            <div className="text-[11px] text-text-tertiary uppercase">Updates</div>
          </div>
        </div>

        {/* Reductions */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Token reduction</span>
            <span className="text-xs font-mono font-semibold" style={{ color: "#10B981" }}>
              {repo.tokenReduction}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${repo.tokenReduction}%`, backgroundColor: "rgba(16,185,129,0.6)" }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Call reduction</span>
            <span className="text-xs font-mono font-semibold" style={{ color: "#6366F1" }}>
              {repo.callReduction}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${repo.callReduction}%`, backgroundColor: "rgba(99,102,241,0.6)" }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Benchmarks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(sectionRef.current.querySelectorAll("[data-animate]"), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(sectionRef.current.querySelectorAll(".repo-card"), {
        y: 30,
        opacity: 0,
        scale: 0.97,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current.querySelector(".repo-grid"),
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="benchmarks" className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16" data-animate>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Benchmarks</h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            Does it actually work on real codebases at scale?
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            Tested on 6 popular open-source repositories across 6 languages. The
            raw data is in the repo — check it.
          </h3>
        </div>

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" data-animate>
          <GlassCard className="p-6">
            <AnimatedCounter value={99.8} suffix="%" decimals={1} label="Avg Token Reduction" />
          </GlassCard>
          <GlassCard className="p-6">
            <AnimatedCounter value={94.1} suffix="%" decimals={1} label="Avg Call Reduction" />
          </GlassCard>
          <GlassCard className="p-6">
            <AnimatedCounter value={6} label="Repos Tested" />
          </GlassCard>
          <GlassCard className="p-6">
            <AnimatedCounter value={34} label="Queries Validated" />
          </GlassCard>
        </div>

        {/* Per-repo cards */}
        <div className="repo-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {REPOS.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>

        {/* Source link + footnote */}
        <div className="text-center mt-8 space-y-2" data-animate>
          <a
            href="https://github.com/marcmantei/myceliums/tree/main/benchmarks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors font-mono"
          >
            Methodology & raw data on GitHub →
          </a>
          <p className="text-xs text-text-tertiary mx-auto max-w-3xl">
            File, symbol and relationship counts and the token and call reductions
            come from the published benchmark data linked above. The run times are
            indicative estimates from development runs on an Apple M1 Pro — they
            are not part of that dataset and will vary with hardware, embedding
            model, and repository. First run includes embedding generation; updates
            only re-analyze changed files.
          </p>
        </div>
      </div>
    </section>
  );
}
