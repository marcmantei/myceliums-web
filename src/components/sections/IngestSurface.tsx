"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CODE_LANGUAGES = [
  "Python", "TypeScript", "JavaScript", "Go", "Rust", "Java",
  "C/C++", "C#", "Ruby", "Swift", "Kotlin", "PHP",
  "Lua", "Zig", "Scala", "Elixir", "Objective-C", "PowerShell",
];

// Each format gets its own color for visual distinction
const CONTENT_FORMATS = [
  { name: "PDF", color: "#F59E0B", border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/[0.06]" },
  { name: "Markdown", color: "#8B5CF6", border: "border-violet-500/30", text: "text-violet-400", bg: "bg-violet-500/[0.06]" },
  { name: "MDX", color: "#A855F7", border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/[0.06]" },
  { name: "Jupyter", color: "#F97316", border: "border-orange-500/30", text: "text-orange-400", bg: "bg-orange-500/[0.06]" },
  { name: "Email", color: "#06B6D4", border: "border-cyan-500/30", text: "text-cyan-400", bg: "bg-cyan-500/[0.06]" },
  { name: "Plain Text", color: "#71717A", border: "border-white/10", text: "text-white/50", bg: "bg-white/[0.03]" },
];

const LANG_COLOR = "#10B981";

// Radar chart data with type info for color coding
const RADAR_POINTS: { label: string; value: number; type: "lang" | "format"; color: string }[] = [
  { label: "Python", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "JS/TS", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Go", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Rust", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Java", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "C/C++", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Ruby", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Swift", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Kotlin", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "PHP", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "C#", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Scala", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "Elixir", value: 1.0, type: "lang", color: LANG_COLOR },
  { label: "PDF", value: 1.0, type: "format", color: "#F59E0B" },
  { label: "MD", value: 1.0, type: "format", color: "#8B5CF6" },
  { label: "Jupyter", value: 1.0, type: "format", color: "#F97316" },
  { label: "Email", value: 1.0, type: "format", color: "#06B6D4" },
];

function RadarChart() {
  const cx = 150;
  const cy = 150;
  const maxR = 120;
  const rings = 4;
  const n = RADAR_POINTS.length;

  const getPoint = (i: number, r: number) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const dataPath = RADAR_POINTS.map((p, i) => {
    const pt = getPoint(i, maxR * p.value);
    return `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`;
  }).join(" ") + " Z";

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[400px]">
      {/* Grid rings */}
      {Array.from({ length: rings }, (_, i) => {
        const r = (maxR / rings) * (i + 1);
        const pts = Array.from({ length: n }, (_, j) => getPoint(j, r));
        const path = pts.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={i} d={path} fill="none" stroke="white" strokeWidth="0.5" opacity={0.08} />;
      })}

      {/* Axis lines — colored by type */}
      {RADAR_POINTS.map((p, i) => {
        const pt = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={p.color} strokeWidth="0.5" opacity={0.15} />;
      })}

      {/* Data fill */}
      <path d={dataPath} fill="url(#radarGrad)" stroke={LANG_COLOR} strokeWidth="1.5" opacity={0.85} />

      {/* Colored dots on data points */}
      {RADAR_POINTS.map((p, i) => {
        const pt = getPoint(i, maxR * p.value);
        return (
          <circle
            key={`dot-${i}`}
            cx={pt.x}
            cy={pt.y}
            r={p.type === "format" ? 4 : 2.5}
            fill={p.color}
            opacity={0.9}
          />
        );
      })}

      {/* Labels — colored by type */}
      {RADAR_POINTS.map((p, i) => {
        const pt = getPoint(i, maxR + 20);
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={p.color}
            opacity={0.7}
            className="text-[8px] font-mono"
          >
            {p.label}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2" fill={LANG_COLOR} opacity={0.5} />

      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={LANG_COLOR} stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function IngestSurface() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const els = sectionRef.current.querySelectorAll("[data-animate]");
      gsap.from(els, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-sm font-mono text-white/30 mb-4" data-animate>
              {"// ingest.surface"}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" data-animate>
              20+ languages and <span className="text-accent">every format you work with.</span>
            </h2>
            <p className="mt-6 text-lg text-white/50 max-w-lg leading-relaxed" data-animate>
              AST-level extraction across the full polyglot stack.
              Docs, notebooks, PDFs, and emails. One corpus, one graph.
            </p>

            {/* Language badges — emerald */}
            <div className="mt-8 flex flex-wrap gap-2" data-animate>
              {CODE_LANGUAGES.slice(0, 10).map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 text-xs font-mono rounded-md border border-emerald-500/30 text-emerald-400 bg-emerald-500/[0.06]"
                >
                  {lang}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2" data-animate>
              {CODE_LANGUAGES.slice(10).map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 text-xs font-mono rounded-md border border-emerald-500/20 text-emerald-400/70 bg-emerald-500/[0.04]"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Format badges — individual colors */}
            <div className="mt-4 flex flex-wrap gap-2" data-animate>
              {CONTENT_FORMATS.map((fmt) => (
                <span
                  key={fmt.name}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md border ${fmt.border} ${fmt.text} ${fmt.bg}`}
                >
                  {fmt.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Radar chart */}
          <div className="flex justify-center" data-animate>
            <RadarChart />
          </div>
        </div>
      </div>
    </section>
  );
}
