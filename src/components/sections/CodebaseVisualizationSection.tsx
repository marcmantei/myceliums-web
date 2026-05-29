"use client";

import { useRef, Suspense, lazy } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Layers, Target, RotateCcw, Network } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import BeforeAfterDemo from "@/components/shared/BeforeAfterDemo";
import MetricsCard from "@/components/shared/MetricsCard";

gsap.registerPlugin(ScrollTrigger);

const CodebaseVisualization = lazy(
  () => import("@/components/CodebaseVisualization")
);

const METRICS = [
  { label: "Languages", value: "20+", improvement: "from manual parsing to automatic" },
  { label: "Symbols parsed", value: "38K", improvement: "in Django alone" },
  { label: "Query time", value: "0.003s", improvement: "vs hours of manual tracing" },
];

const BEFORE_LINES = [
  '$ grep -r "className=\\"button\\"" --include="*.tsx"',
  "src/ui/Button.tsx: export const Button = ()",
  "src/Button.tsx: export function Button()",
  "src/components/Button.tsx: const Button = ()",
  "",
  "$ find . -name '*.tsx' | xargs grep -l 'Button'",
  "src/pages/Login.tsx",
  "src/pages/Signup.tsx",
  "src/pages/Dashboard.tsx",
  "src/pages/Settings.tsx",
  "",
  "// Still missing which functions use which Button?",
  "// How are they imported? What's the call flow?",
  "// Manual investigation required... Hours of work",
];

const AFTER_LINES = [
  '$ myc query "MATCH (s:Symbol)',
  "  WHERE s.name = 'Button'",
  '  RETURN s.name, s.file, count(*) as callers"',
  "",
  "┌──────────┬──────────────────┬─────────┐",
  "│ s.name   │ s.file           │ callers │",
  "├──────────┼──────────────────┼─────────┤",
  "│ Button   │ src/ui/Button    │ 47      │",
  "└──────────┴──────────────────┴─────────┘",
  "",
  "✓ 1 query. Complete graph. 0.003s",
];

const CAPABILITIES = [
  {
    icon: Layers,
    title: "Force-Directed Layout",
    description:
      "D3.js simulation with charge, link, collision, and clustering forces. Nodes naturally organize by their relationships.",
  },
  {
    icon: Network,
    title: "Community Coloring",
    description:
      "Leiden algorithm clusters rendered as colored groups. See how your code actually connects vs. what folders say.",
  },
  {
    icon: Target,
    title: "Centrality Scaling",
    description:
      "Node size reflects betweenness centrality. Larger nodes = more critical. Spot bottlenecks instantly.",
  },
  {
    icon: RotateCcw,
    title: "Cycle Highlighting",
    description:
      "Circular dependencies rendered in red with dashed edges and warning rings. Tarjan's SCC algorithm detects them.",
  },
];

export default function CodebaseVisualizationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelector(".viz-header");
      if (header) {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      }

      const demo = sectionRef.current.querySelector(".viz-demo");
      if (demo) {
        gsap.from(demo, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });
      }

      const cards = sectionRef.current.querySelectorAll(".viz-capability");
      if (cards.length > 0) {
        gsap.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="knowledge-graph"
      className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="viz-header mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Knowledge Graph
            </h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            How can you understand any codebase without manually reading every file and tracing relationships by hand?
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            Understand any codebase in seconds. 20+ languages parsed into a complete map of every symbol, relationship, and call chain.
          </h3>
          <p className="text-text-secondary mt-4">
            Every symbol, relationship, and call chain across your entire codebase — structured, queryable, and ready for AI agents.
          </p>
        </div>

        {/* Metrics */}
        <div className="mb-12">
          <MetricsCard metrics={METRICS} />
        </div>

        {/* Live visualization */}
        <div className="viz-demo">
          <GlassCard className="overflow-hidden">
            <div className="p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">
                    Live Preview
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-success/15 text-success rounded-full border border-success/20">
                    INTERACTIVE
                  </span>
                </div>
                <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
                  this is what you see when you run <code className="text-accent">myc serve</code>
                </span>
              </div>

              <Suspense
                fallback={
                  <div className="w-full h-[400px] md:h-[520px] flex items-center justify-center rounded-xl border border-white/[0.06] bg-black/20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-text-tertiary font-mono">
                        Initializing force simulation...
                      </span>
                    </div>
                  </div>
                }
              >
                <CodebaseVisualization />
              </Suspense>
            </div>
          </GlassCard>
        </div>

        {/* Capability cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <GlassCard key={cap.title} className="viz-capability">
                <div className="p-4 lg:p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <h4 className="text-sm font-semibold">{cap.title}</h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Before/After Demo */}
        <div className="mt-16 md:mt-20">
          <BeforeAfterDemo
            beforeTitle="Without Knowledge Graph"
            beforeLines={BEFORE_LINES}
            afterTitle="With Knowledge Graph"
            afterLines={AFTER_LINES}
          />
        </div>

        {/* CLI hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-tertiary font-mono">
            Run{" "}
            <code className="px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20">
              myc serve
            </code>{" "}
            in your project to see this for your own codebase
          </p>
        </div>
      </div>
    </section>
  );
}
