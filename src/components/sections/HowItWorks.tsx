"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scan, GitBranch, Terminal } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

// Mini-animation: files flying into a funnel
function AnalyzeAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 500);
    const interval = setInterval(() => {
      setActive(false);
      setTimeout(() => setActive(true), 200);
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const filePositions = [
    { x: 20, y: 10 }, { x: 60, y: 5 }, { x: 100, y: 15 },
    { x: 15, y: 40 }, { x: 55, y: 35 }, { x: 95, y: 45 },
    { x: 35, y: 65 }, { x: 75, y: 70 },
  ];

  return (
    <svg ref={svgRef} viewBox="0 0 120 80" className="w-full h-24">
      {/* Funnel */}
      <path
        d="M45 75 L60 55 L75 75"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Files */}
      {filePositions.map((pos, i) => (
        <rect
          key={i}
          x={active ? 55 : pos.x}
          y={active ? 60 : pos.y}
          width="8"
          height="10"
          rx="1"
          fill="var(--accent)"
          opacity={active ? 0 : 0.6}
          style={{
            transition: `all ${0.8 + i * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      ))}
      {/* Output dot */}
      <circle
        cx="60"
        cy="75"
        r={active ? 3 : 0}
        fill="var(--success)"
        style={{ transition: "r 0.3s ease 1.5s" }}
      />
    </svg>
  );
}

// Mini-animation: nodes and edges appearing
function GraphBuildAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { cx: 30, cy: 25, color: "var(--accent)" },
    { cx: 70, cy: 15, color: "var(--accent)" },
    { cx: 90, cy: 45, color: "var(--success)" },
    { cx: 50, cy: 55, color: "var(--success)" },
    { cx: 20, cy: 60, color: "#F59E0B" },
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], [3, 4],
  ];

  return (
    <svg viewBox="0 0 120 80" className="w-full h-24">
      {/* Edges */}
      {edges.map(([from, to], i) => (
        <line
          key={`e${i}`}
          x1={nodes[from].cx}
          y1={nodes[from].cy}
          x2={nodes[to].cx}
          y2={nodes[to].cy}
          stroke="white"
          strokeWidth="0.8"
          opacity={step > 1 ? 0.15 : 0}
          style={{ transition: "opacity 0.5s ease" }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <circle
          key={`n${i}`}
          cx={node.cx}
          cy={node.cy}
          r={step > 0 ? 4 : 0}
          fill={node.color}
          opacity={step > 0 ? 0.8 : 0}
          style={{ transition: `all 0.4s ease ${i * 0.1}s` }}
        />
      ))}
      {/* Community hulls */}
      {step > 2 && (
        <>
          <ellipse cx="50" cy="20" rx="30" ry="15" fill="var(--accent)" opacity="0.05" />
          <ellipse cx="70" cy="50" rx="30" ry="18" fill="var(--success)" opacity="0.05" />
        </>
      )}
    </svg>
  );
}

// Mini-animation: query typing
function QueryAnimation() {
  const [chars, setChars] = useState(0);
  const query = 'MATCH (s)-[:CALLS]->(t) RETURN s';

  useEffect(() => {
    const interval = setInterval(() => {
      setChars((c) => {
        if (c >= query.length) {
          setTimeout(() => setChars(0), 2000);
          return c;
        }
        return c + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] sm:text-xs px-3 py-2 bg-black/30 rounded-lg min-h-[96px]">
      <div className="text-success">
        $ myc query &quot;{query.slice(0, chars)}
        <span className="animate-pulse">|</span>&quot;
      </div>
      {chars >= query.length && (
        <div className="mt-2 text-text-secondary">
          <div>┌──────────┬──────────┐</div>
          <div>│ s.name   │ t.name   │</div>
          <div>├──────────┼──────────┤</div>
          <div>│ <span className="text-accent">login</span>    │ <span className="text-success">auth</span>     │</div>
          <div>│ <span className="text-accent">refresh</span>  │ <span className="text-success">validate</span> │</div>
          <div>└──────────┴──────────┘</div>
        </div>
      )}
    </div>
  );
}

const STEPS = [
  {
    number: "01",
    title: "Analyze",
    description:
      "Point Myceliums at your repo. Tree-sitter parses 20+ languages, extracts every symbol, relationship, and call chain.",
    icon: Scan,
    animation: AnalyzeAnimation,
    code: "$ myc analyze ./my-project",
  },
  {
    number: "02",
    title: "Build Graph",
    description:
      "Symbols become nodes, calls become edges. The Leiden algorithm detects communities, revealing architectural boundaries your IDE can't see.",
    icon: GitBranch,
    animation: GraphBuildAnimation,
    code: "41,952 symbols → 45,028 relationships → 86 communities",
  },
  {
    number: "03",
    title: "Query & Act",
    description:
      "Query with Cypher, search with BM25 + vectors, detect impact before shipping. Or let AI agents use it via MCP.",
    icon: Terminal,
    animation: QueryAnimation,
    code: null,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".step-card");
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
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
    <section ref={sectionRef} id="how-it-works" className="section-spacing pt-32 md:pt-40 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-accent">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Three steps to full understanding
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const Animation = step.animation;
            return (
              <GlassCard key={step.number} className="step-card p-6 lg:p-8">
                {/* Step number watermark */}
                <span className="absolute top-4 right-4 text-6xl font-bold text-white/[0.03] font-mono select-none">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Animation */}
                <div className="rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                  {step.code ? (
                    <div>
                      <Animation />
                      <div className="px-3 py-2 border-t border-white/[0.04]">
                        <code className="text-[10px] text-text-tertiary">{step.code}</code>
                      </div>
                    </div>
                  ) : (
                    <Animation />
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
