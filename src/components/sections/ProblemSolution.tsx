"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TerminalFrame from "@/components/ui/terminal-frame";

gsap.registerPlugin(ScrollTrigger);

const BEFORE_LINES = [
  "$ grep -r 'handleAuth' --include='*.ts'",
  "src/auth/handler.ts:  export function handleAuth(req) {",
  "src/auth/handler.ts:    const token = validateToken(req);",
  "src/middleware/auth.ts: import { handleAuth } from '../auth';",
  "",
  "$ grep -r 'validateToken' --include='*.ts'",
  "src/auth/validator.ts:  export function validateToken(token) {",
  "src/auth/handler.ts:    const token = validateToken(req);",
  "",
  "$ grep -r 'TokenStore' --include='*.ts'",
  "src/storage/tokens.ts:  class TokenStore {",
  "src/auth/validator.ts:  import { TokenStore } from '../storage';",
  "",
  "... more greps and file reads ...",
  "// callers have to be read out of the files",
];

const AFTER_LINES = [
  '$ myc query "MATCH (s:CodeSymbol)-[:CALLS]->(t:CodeSymbol)',
  '  WHERE t.name = \'handleAuth\'',
  '  RETURN s.name, s.file_path"',
  "",
  "\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
  "\u2502 s.name              \u2502 s.file_path          \u2502",
  "\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524",
  "\u2502 authMiddleware      \u2502 src/middleware/auth  \u2502",
  "\u2502 loginRoute          \u2502 src/routes/login     \u2502",
  "\u2502 oauthCallback       \u2502 src/routes/oauth     \u2502",
  "\u2502 sessionRefresh      \u2502 src/auth/session     \u2502",
  "\u2502 apiGateway          \u2502 src/gateway/main     \u2502",
  "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
  "",
  "\u2713 1 query. Direct callers from the call graph.",
];

function ScrollTypedTerminal({
  lines,
  variant,
  title,
}: {
  lines: string[];
  variant: "error" | "success";
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const lineEls = containerRef.current.querySelectorAll(".typed-line");

      lineEls.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 5 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${(i / lines.length) * 60}% bottom`,
            end: `top+=${((i + 1) / lines.length) * 60}% bottom`,
            scrub: 0.3,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <TerminalFrame title={title} variant={variant}>
      <div ref={containerRef} className="space-y-0.5 min-h-[300px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`typed-line font-mono text-xs sm:text-sm whitespace-pre ${
              line.startsWith("$")
                ? variant === "error"
                  ? "text-danger"
                  : "text-success"
                : line.startsWith("\u2713")
                  ? "text-success font-semibold"
                  : line.startsWith("...")
                    ? "text-danger/70 italic"
                    : "text-text-secondary"
            }`}
          >
            {line || "\u00A0"}
          </div>
        ))}
      </div>
    </TerminalFrame>
  );
}

/* ─── Graph visualizations for the 3 cards ─── */

function SmallWeb() {
  // Small spiderweb: 5 nodes, tight cluster
  const center = { x: 100, y: 70 };
  const nodes = [
    center,
    { x: 60, y: 35 },
    { x: 140, y: 35 },
    { x: 55, y: 100 },
    { x: 145, y: 100 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 2], [3, 4],
  ];
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#10B981" strokeWidth="1.5" opacity={0.3} />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 0 ? 7 : 5}
          fill="#10B981" opacity={i === 0 ? 0.9 : 0.6} />
      ))}
    </svg>
  );
}

function ExpandedWeb() {
  // Expanded spiderweb: original 5 + 6 new nodes branching out, highlighted new ones
  const nodes = [
    // Original cluster
    { x: 80, y: 70, old: true },
    { x: 50, y: 40, old: true },
    { x: 110, y: 35, old: true },
    { x: 45, y: 95, old: true },
    { x: 115, y: 95, old: true },
    // New nodes (highlighted)
    { x: 20, y: 15, old: false },
    { x: 145, y: 15, old: false },
    { x: 155, y: 60, old: false },
    { x: 160, y: 110, old: false },
    { x: 15, y: 115, old: false },
    { x: 80, y: 130, old: false },
  ];
  const edges = [
    // Original edges
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [3, 4],
    // New connections
    [1, 5], [2, 6], [2, 7], [4, 8], [3, 9], [0, 10],
    // Cross-connections between new nodes
    [5, 9], [6, 7],
  ];
  return (
    <svg viewBox="0 0 180 145" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={!nodes[a].old || !nodes[b].old ? "#10B981" : "#10B981"}
          strokeWidth="1.5"
          opacity={!nodes[a].old || !nodes[b].old ? 0.5 : 0.2}
          strokeDasharray={!nodes[a].old && !nodes[b].old ? "3 3" : "none"} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          {!n.old && (
            <circle cx={n.x} cy={n.y} r="10" fill="#10B981" opacity={0.08} />
          )}
          <circle cx={n.x} cy={n.y}
            r={n.old ? 5 : 6}
            fill={n.old ? "#10B981" : "#34D399"}
            opacity={n.old ? 0.5 : 0.9}
            stroke={n.old ? "none" : "#10B981"}
            strokeWidth={n.old ? 0 : 1} />
        </g>
      ))}
    </svg>
  );
}

function ClusterNetwork() {
  // 3 interconnected spiderweb clusters
  const cluster1 = [
    { x: 35, y: 40 }, { x: 15, y: 20 }, { x: 55, y: 18 },
    { x: 10, y: 55 }, { x: 55, y: 58 }, { x: 35, y: 70 },
  ];
  const cluster2 = [
    { x: 110, y: 35 }, { x: 90, y: 18 }, { x: 130, y: 15 },
    { x: 95, y: 55 }, { x: 130, y: 50 }, { x: 110, y: 65 },
    { x: 145, y: 30 },
  ];
  const cluster3 = [
    { x: 75, y: 105 }, { x: 50, y: 90 }, { x: 100, y: 88 },
    { x: 55, y: 120 }, { x: 95, y: 122 }, { x: 75, y: 135 },
    { x: 120, y: 110 }, { x: 30, y: 108 },
  ];

  const allNodes = [...cluster1, ...cluster2, ...cluster3];
  const c1 = cluster1.length;
  const c2 = cluster2.length;

  // Intra-cluster edges
  const intraEdges: [number, number][] = [
    // Cluster 1
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [3, 5], [4, 5],
    // Cluster 2
    [c1, c1+1], [c1, c1+2], [c1, c1+3], [c1, c1+4], [c1, c1+5], [c1+1, c1+2], [c1+4, c1+6], [c1+3, c1+5],
    // Cluster 3
    [c1+c2, c1+c2+1], [c1+c2, c1+c2+2], [c1+c2, c1+c2+3], [c1+c2, c1+c2+4],
    [c1+c2, c1+c2+5], [c1+c2+1, c1+c2+3], [c1+c2+2, c1+c2+4], [c1+c2+4, c1+c2+6],
    [c1+c2+3, c1+c2+7], [c1+c2+1, c1+c2+7],
  ];

  // Inter-cluster bridge edges
  const bridgeEdges: [number, number][] = [
    [4, c1+3],       // cluster1 → cluster2
    [5, c1+c2+1],    // cluster1 → cluster3
    [c1+5, c1+c2+2], // cluster2 → cluster3
  ];

  const colors = ["#10B981", "#6366F1", "#F59E0B"];

  return (
    <svg viewBox="0 0 170 150" className="w-full h-full">
      {/* Cluster background halos */}
      <circle cx="35" cy="45" r="38" fill="#10B981" opacity={0.03} />
      <circle cx="110" cy="40" r="38" fill="#6366F1" opacity={0.03} />
      <circle cx="75" cy="108" r="40" fill="#F59E0B" opacity={0.03} />

      {/* Intra-cluster edges */}
      {intraEdges.map(([a, b], i) => {
        const clr = a < c1 ? colors[0] : a < c1 + c2 ? colors[1] : colors[2];
        return (
          <line key={`intra-${i}`}
            x1={allNodes[a].x} y1={allNodes[a].y}
            x2={allNodes[b].x} y2={allNodes[b].y}
            stroke={clr} strokeWidth="1" opacity={0.25} />
        );
      })}

      {/* Bridge edges */}
      {bridgeEdges.map(([a, b], i) => (
        <line key={`bridge-${i}`}
          x1={allNodes[a].x} y1={allNodes[a].y}
          x2={allNodes[b].x} y2={allNodes[b].y}
          stroke="white" strokeWidth="1" opacity={0.15}
          strokeDasharray="4 3" />
      ))}

      {/* Nodes */}
      {allNodes.map((n, i) => {
        const clr = i < c1 ? colors[0] : i < c1 + c2 ? colors[1] : colors[2];
        const isHub = i === 0 || i === c1 || i === c1 + c2;
        return (
          <circle key={i} cx={n.x} cy={n.y}
            r={isHub ? 6 : 4}
            fill={clr}
            opacity={isHub ? 0.9 : 0.6} />
        );
      })}
    </svg>
  );
}

/* ─── Main component ─── */

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(vsRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: vsRef.current,
          start: "top 70%",
        },
      });

      // Animate the progression cards
      const cards = sectionRef.current.querySelectorAll("[data-progress-card]");
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="problem-solution" className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header — left-aligned, matching other sections */}
        <div ref={headlineRef} className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Incremental Intelligence</h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            Why do RAG pipelines re-embed everything on every change?
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            Build once, grow forever. Only affected nodes update. Your knowledge graph is always current, never stale.
          </h3>
          <p className="text-text-secondary mt-4">
            Myceliums maintains a living graph. When a file changes, only the affected subgraph is patched.
            No full rebuilds, no stale context. AI agents and developers always work with the real state of your code.
          </p>
        </div>

        {/* ── Three-card progression with large graph visuals ── */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {/* Card 1: Small spiderweb */}
          <div data-progress-card className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col overflow-hidden">
            <p className="text-xs font-mono text-accent mb-3">{"// day.one"}</p>
            <h4 className="text-lg font-bold text-white mb-2">Initial corpus build</h4>
            <p className="text-sm text-white/50 leading-relaxed">
              Point Myceliums at any directory. AST extraction, search indexing,
              community detection. Your entire codebase becomes a traversable
              knowledge graph in one pass.
            </p>
            <div className="mt-6 flex-1 flex items-center justify-center min-h-[180px]">
              <SmallWeb />
            </div>
            <p className="text-center text-xs font-mono text-accent/60 mt-3">
              5 nodes &middot; 6 edges
            </p>
          </div>

          {/* Card 2: Expanded spiderweb */}
          <div data-progress-card className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-6 flex flex-col overflow-hidden">
            <p className="text-xs font-mono text-accent mb-3">{"// week.one"}</p>
            <h4 className="text-lg font-bold text-white mb-2">Incremental updates</h4>
            <p className="text-sm text-white/50 leading-relaxed">
              A file changes. Myceliums detects it, re-extracts only the affected
              subgraph, and patches the live graph. No full rebuild. Your
              knowledge stays connected.
            </p>
            <div className="mt-6 flex-1 flex items-center justify-center min-h-[180px]">
              <ExpandedWeb />
            </div>
            <p className="text-center text-xs font-mono text-accent/60 mt-3">
              +6 nodes patched in &middot; 0.8s
            </p>
          </div>

          {/* Card 3: Interconnected clusters */}
          <div data-progress-card className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col overflow-hidden">
            <p className="text-xs font-mono text-accent mb-3">{"// month.one"}</p>
            <h4 className="text-lg font-bold text-white mb-2">Enterprise-scale corpus</h4>
            <p className="text-sm text-white/50 leading-relaxed">
              After weeks of continuous growth, your graph spans thousands of
              symbols across dozens of modules. Query traversal is instant.
              Nothing was ever rebuilt from scratch.
            </p>
            <div className="mt-6 flex-1 flex items-center justify-center min-h-[180px]">
              <ClusterNetwork />
            </div>
            <p className="text-center text-xs font-mono text-accent/60 mt-3">
              3 communities &middot; 21 nodes &middot; enterprise corpus
            </p>
          </div>
        </div>

        {/* Watch mode badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-accent/20 bg-accent/[0.04]">
            <span className="text-sm font-mono text-accent">
              {"// myc watch . \u2014 live file watcher"}
            </span>
            <span className="text-xs font-mono text-white/30 border-l border-white/10 pl-3">
              no LLM &middot; AST only
            </span>
          </div>
        </div>

        {/* ── Comparison: Others vs Myceliums ── */}
        <div className="grid md:grid-cols-2 gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-8 mb-12">
          {/* Left: Others */}
          <div>
            <p className="text-xs font-mono text-white/30 mb-4">
              {"// others: full rebuild on change"}
            </p>
            <div className="space-y-3">
              {[
                { text: "re-embed 500k documents...", time: "4h 12m" },
                { text: "rebuild vector index...", time: "2h 8m" },
                { text: "re-cluster communities...", time: "stale context" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/[0.06] border border-red-500/20"
                >
                  <span className="text-danger text-sm">{"\u25B8"}</span>
                  <span className="text-sm text-white/60 font-mono flex-1">
                    {item.text}
                  </span>
                  <span className="text-xs text-danger font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Myceliums */}
          <div>
            <p className="text-xs font-mono text-accent mb-4">
              {"// myceliums: incremental patch"}
            </p>
            <div className="space-y-3">
              {[
                { text: "detect changed files...", result: "3 files" },
                { text: "patch affected nodes only...", result: "0.8s" },
                { text: "graph updated. 498,752 nodes intact.", result: "" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20"
                >
                  <span className="text-success text-sm">{"\u2713"}</span>
                  <span className="text-sm text-white/60 font-mono flex-1">
                    {item.text}
                  </span>
                  {item.result && (
                    <span className="text-xs text-success font-mono">{item.result}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Before / After terminals ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Before */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-danger" />
              <span className="text-sm font-medium text-danger">RAG / grep approach</span>
              <span className="text-xs text-text-tertiary ml-auto font-mono">Generic retrieval, blind to structure</span>
            </div>
            <ScrollTypedTerminal
              lines={BEFORE_LINES}
              variant="error"
              title="blind-search"
            />
          </div>

          {/* VS badge */}
          <div
            ref={vsRef}
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-2 border border-white/[0.06] items-center justify-center"
          >
            <span className="text-xs font-bold text-text-secondary">VS</span>
          </div>

          {/* After */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">Myceliums</span>
              <span className="text-xs text-text-tertiary ml-auto font-mono">Structural queries over the call graph</span>
            </div>
            <ScrollTypedTerminal
              lines={AFTER_LINES}
              variant="success"
              title="myceliums"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
