"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Network, Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import GlassCard from "@/components/ui/glass-card";
import TerminalFrame from "@/components/ui/terminal-frame";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  {
    id: "cli",
    label: "CLI Analysis",
    icon: Terminal,
    content: CliTab,
  },
  {
    id: "graph",
    label: "Graph Visualization",
    icon: Network,
    content: GraphTab,
  },
  {
    id: "mcp",
    label: "MCP Integration",
    icon: Bot,
    content: MCPTab,
  },
];

function CliTab() {
  return (
    <TerminalFrame title="myceliums: analysis" variant="success">
      <div className="space-y-1 text-xs sm:text-sm">
        <div className="text-success">$ myc analyze ./express-app</div>
        <div className="text-text-secondary">Parsing 342 files (TypeScript, JavaScript)...</div>
        <div className="text-text-secondary">Building knowledge graph...</div>
        <div className="text-text-secondary">Detecting communities (Leiden, resolution=1.0)...</div>
        <div className="text-text-secondary">Tracing execution flows...</div>
        <div className="text-foreground font-semibold mt-2">Symbols:       2,847</div>
        <div className="text-foreground font-semibold">Relationships: 3,201</div>
        <div className="text-foreground font-semibold">Communities:   12</div>
        <div className="text-foreground font-semibold">Processes:     28</div>
        <div className="text-success font-semibold mt-2">✓ Analyzed in 0.4s</div>
        <div className="text-text-secondary mt-3">$ myc impact --symbol handleAuth</div>
        <div className="text-warning">⚠ 7 symbols affected across 3 communities</div>
        <div className="text-text-secondary">  authMiddleware → loginRoute → sessionRefresh</div>
        <div className="text-text-secondary">  oauthCallback → tokenStore → apiGateway</div>
        <div className="text-text-secondary">  rateLimiter</div>
      </div>
    </TerminalFrame>
  );
}

function GraphTab() {
  const nodes = [
    { cx: 20, cy: 25, r: 5, color: "#6366F1", label: "auth" },
    { cx: 45, cy: 15, r: 4, color: "#6366F1", label: "session" },
    { cx: 70, cy: 20, r: 6, color: "#10B981", label: "routes" },
    { cx: 85, cy: 45, r: 4, color: "#10B981", label: "handlers" },
    { cx: 55, cy: 50, r: 5, color: "#F59E0B", label: "db" },
    { cx: 30, cy: 55, r: 4, color: "#F59E0B", label: "models" },
    { cx: 15, cy: 45, r: 3, color: "#6366F1", label: "validate" },
    { cx: 75, cy: 60, r: 3, color: "#10B981", label: "middleware" },
  ];

  const edges = [
    [0, 1], [0, 6], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7], [7, 3],
  ];

  return (
    <div className="bg-[#0a0a0c] rounded-xl border border-white/[0.06] p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs text-text-secondary font-mono">myc serve: localhost:3000</span>
      </div>
      <svg viewBox="0 0 100 75" className="w-full">
        {/* Community backgrounds */}
        <ellipse cx="28" cy="35" rx="22" ry="20" fill="#6366F1" opacity="0.04" />
        <ellipse cx="72" cy="40" rx="22" ry="25" fill="#10B981" opacity="0.04" />
        <ellipse cx="45" cy="55" rx="18" ry="14" fill="#F59E0B" opacity="0.04" />

        {/* Edges */}
        {edges.map(([from, to], i) => (
          <line
            key={i}
            x1={nodes[from].cx} y1={nodes[from].cy}
            x2={nodes[to].cx} y2={nodes[to].cy}
            stroke="white" strokeWidth="0.4" opacity="0.12"
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.color} opacity="0.7" />
            <text
              x={node.cx} y={node.cy + node.r + 5}
              fontSize="3" fill="white" opacity="0.4"
              textAnchor="middle" fontFamily="monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MCPTab() {
  return (
    <div className="space-y-4 p-4">
      {/* Simulated conversation */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-[10px] text-accent font-bold shrink-0">
            C
          </div>
          <div className="text-sm text-text-secondary">
            What functions call <span className="text-accent font-mono text-xs">handleAuth</span> and what&apos;s the blast radius?
          </div>
        </div>

        <div className="ml-9 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] font-mono text-xs">
          <div className="text-text-tertiary mb-1">→ mcp tool: symbol_context</div>
          <div className="text-text-secondary">
            <span className="text-accent">handleAuth</span> is called by 3 functions:
          </div>
          <div className="text-text-secondary pl-2 mt-1">
            • authMiddleware (src/middleware/auth.ts:12)<br/>
            • loginRoute (src/routes/login.ts:45)<br/>
            • oauthCallback (src/routes/oauth.ts:23)
          </div>
          <div className="text-text-tertiary mt-2 mb-1">→ mcp tool: detect_impact</div>
          <div className="text-warning">
            Blast radius: 7 symbols across 3 communities
          </div>
        </div>

        {/* Tool badges */}
        <div className="ml-9 flex flex-wrap gap-1.5">
          {["analyze", "context_search", "detect_impact", "get_god_nodes", "get_knowledge_gaps", "get_suggested_questions", "find_path", "get_rationale", "get_graph_diff"].map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 text-[11px] font-mono bg-white/[0.03] border border-white/[0.06] rounded text-text-tertiary"
            >
              {tool}
            </span>
          ))}
          <span className="px-2 py-0.5 text-[11px] font-mono text-accent">
            +21 more
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SeeItInAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState("cli");

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.from(sectionRef.current.querySelector(".demo-container"), {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: sectionRef }
  );

  const ActiveContent = TABS.find((t) => t.id === activeTab)?.content;

  return (
    <section ref={sectionRef} className="section-spacing pt-32 md:pt-40 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-accent">
            DEMO
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            See it in action
          </h2>
        </div>

        {/* Tabs + Content */}
        <div className="demo-container">
          {/* Tab buttons */}
          <div className="flex gap-2 mb-6 justify-center">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? "bg-accent/15 text-accent border border-accent/20"
                      : "text-text-secondary hover:text-foreground border border-white/[0.06] hover:border-white/[0.12]"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <GlassCard className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {ActiveContent && <ActiveContent />}
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
