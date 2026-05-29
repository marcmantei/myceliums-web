"use client";

import SectionWrapper from "@/components/ui/section-wrapper";
import {
  Network,
  FileCode,
  Activity,
  AlertTriangle,
  Clock,
  GitBranch,
  Users,
  Tag,
  FileText,
  Plug,
} from "lucide-react";

const FEATURES = [
  {
    icon: Network,
    name: "Architecture Diagrams",
    desc: "Service-level views from communities",
    color: "#6366F1",
  },
  {
    icon: FileCode,
    name: "Mermaid Export",
    desc: "Flowchart, class, and graph diagrams",
    color: "#8B5CF6",
  },
  {
    icon: Activity,
    name: "Quality Hotspots",
    desc: "Centrality x churn x instability",
    color: "#EF4444",
  },
  {
    icon: AlertTriangle,
    name: "Architecture Lint",
    desc: "Cycles, god nodes, fan-out checks",
    color: "#F59E0B",
  },
  {
    icon: Clock,
    name: "Drift Detection",
    desc: "Track architectural changes over time",
    color: "#06B6D4",
  },
  {
    icon: GitBranch,
    name: "Snapshot Versioning",
    desc: "Timestamped graph history + diff",
    color: "#14B8A6",
  },
  {
    icon: Users,
    name: "CODEOWNERS",
    desc: "Auto-resolve file ownership",
    color: "#EC4899",
  },
  {
    icon: Tag,
    name: "Service Mapping",
    desc: "Name your communities as services",
    color: "#10B981",
  },
  {
    icon: FileText,
    name: "Decision Records",
    desc: "ADRs linked to code symbols",
    color: "#A78BFA",
  },
  {
    icon: Plug,
    name: "API Contracts",
    desc: "OpenAPI + Proto handler matching",
    color: "#38BDF8",
  },
];

export default function ArchGuardianStrip() {
  return (
    <SectionWrapper stagger className="py-16">
      <div className="mx-auto max-w-7xl">
        <p
          className="text-center text-xs font-mono text-text-tertiary mb-8 tracking-wider"
          data-animate
        >
          10 architecture intelligence capabilities — all available as MCP tools
        </p>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
          data-animate
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.name}
                className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.12] transition-all duration-200"
              >
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider bg-accent/15 text-accent border border-accent/30">
                  NEW
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <h4 className="text-[11px] font-semibold text-white/80 mb-0.5">
                  {f.name}
                </h4>
                <p className="text-[10px] text-text-tertiary leading-tight">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
