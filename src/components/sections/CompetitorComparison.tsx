"use client";

import { Check, X, Minus } from "lucide-react";
import SectionWrapper from "@/components/ui/section-wrapper";

interface Feature {
  name: string;
  myceliums: "yes" | "no" | "partial";
  gitlabKg: "yes" | "no" | "partial";
  graphify: "yes" | "no" | "partial";
  codeReviewGraph: "yes" | "no" | "partial";
  tokenSavior: "yes" | "no" | "partial";
  greptile: "yes" | "no" | "partial";
  coderabbit: "yes" | "no" | "partial";
  understandAnything: "yes" | "no" | "partial";
}

const FEATURES: Feature[] = [
  { name: "MCP Tools", myceliums: "yes", gitlabKg: "yes", graphify: "partial", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "partial", coderabbit: "no", understandAnything: "no" },
  { name: "Impact Detection", myceliums: "yes", gitlabKg: "partial", graphify: "no", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "partial", coderabbit: "no", understandAnything: "partial" },
  { name: "Cypher Query Engine", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Knowledge Gap Detection", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Dead Code Detection", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Process Tracing", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "partial" },
  { name: "BM25 + Semantic + Hybrid Search", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "partial", tokenSavior: "partial", greptile: "no", coderabbit: "no", understandAnything: "partial" },
  { name: "Community Detection", myceliums: "yes", gitlabKg: "no", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "God Node Detection", myceliums: "yes", gitlabKg: "no", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Symbol Rename Preview", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Token-Optimized Reviews", myceliums: "yes", gitlabKg: "partial", graphify: "no", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "yes", coderabbit: "yes", understandAnything: "no" },
  { name: "Dependency Analysis", myceliums: "yes", gitlabKg: "yes", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "Call Graph", myceliums: "yes", gitlabKg: "yes", graphify: "partial", codeReviewGraph: "partial", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "Repo Map / API Map", myceliums: "yes", gitlabKg: "yes", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "partial" },
  { name: "Graph Explorer / Visualization", myceliums: "yes", gitlabKg: "yes", graphify: "partial", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "Email / Document Ingestion", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "partial" },
  { name: "Cross-Repo Comparison", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Graph Diff / Change Detection", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Ontology / Schema System", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Circular Dependency Detection", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Centrality Metrics (4 types)", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Module Coupling Analysis", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "SDLC Integration (Issues, MRs, CI)", myceliums: "partial", gitlabKg: "partial", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Cross-Project Search", myceliums: "partial", gitlabKg: "partial", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Persistent Memory", myceliums: "no", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Local-First (no cloud)", myceliums: "yes", gitlabKg: "yes", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "No LLM Required", myceliums: "yes", gitlabKg: "yes", graphify: "no", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Open Source (AGPL-3.0)", myceliums: "yes", gitlabKg: "no", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "Plugin-Based (Multiple Platforms)", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "yes" },
];

const TOOL_COUNTS = [
  { name: "Myceliums", count: 41, color: "bg-accent" },
  { name: "GitLab KG", count: 10, color: "bg-white/20" },
  { name: "Token Savior", count: 90, color: "bg-white/20" },
  { name: "code-review-graph", count: 28, color: "bg-white/20" },
  { name: "Graphify", count: 4, color: "bg-white/20" },
  { name: "Greptile", count: 10, color: "bg-white/20" },
  { name: "CodeRabbit", count: 0, color: "bg-white/20" },
  { name: "Understand-Anything", count: 8, color: "bg-white/20" },
];

const MAX_TOOLS = 90;

function StatusIcon({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes") return <Check className="w-4 h-4 text-emerald-400" />;
  if (status === "partial") return <Minus className="w-4 h-4 text-amber-400" />;
  return <X className="w-4 h-4 text-white/20" />;
}

export default function CompetitorComparison() {
  return (
    <SectionWrapper id="comparison" className="py-24 sm:py-32" stagger>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16" data-animate>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How Myceliums compares
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto text-balance">
            Feature-for-feature comparison against every code knowledge graph tool. No marketing fluff.
          </p>
        </div>

        {/* Comparison table */}
        <div
          className="overflow-x-auto rounded-2xl border border-white/[0.06] backdrop-blur-xl bg-white/[0.02]"
          data-animate
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-3 sm:p-4 text-white/40 font-medium min-w-[160px]">Feature</th>
                <th className="p-3 sm:p-4 text-center text-white font-semibold bg-accent/10 border-x border-white/[0.06] min-w-[90px]">
                  Myceliums
                </th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[110px]">
                  <span className="hidden sm:inline">Understand-Anything</span>
                  <span className="sm:hidden">UA</span>
                </th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[90px]">
                  <span className="hidden sm:inline">GitLab KG</span>
                  <span className="sm:hidden">GLab</span>
                </th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[90px]">
                  <span className="hidden sm:inline">code-review-graph</span>
                  <span className="sm:hidden">CRG</span>
                </th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[90px]">
                  <span className="hidden sm:inline">Token Savior</span>
                  <span className="sm:hidden">TS</span>
                </th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[90px]">Graphify</th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[80px]">Greptile</th>
                <th className="p-3 sm:p-4 text-center text-white/60 font-medium min-w-[80px]">CodeRabbit</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={`border-b border-white/[0.04] ${
                    i % 2 === 0 ? "" : "bg-white/[0.01]"
                  }`}
                >
                  <td className="p-3 sm:p-4 text-white/70">{feature.name}</td>
                  <td className="p-3 sm:p-4 text-center bg-accent/5 border-x border-white/[0.06]">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.myceliums} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.understandAnything} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.gitlabKg} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.codeReviewGraph} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.tokenSavior} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.graphify} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.greptile} />
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.coderabbit} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/[0.06]">
                <td className="p-3 sm:p-4 text-white/40 font-medium">Price</td>
                <td className="p-3 sm:p-4 text-center bg-accent/5 border-x border-white/[0.06] text-emerald-400 font-semibold">
                  Free
                </td>
                <td className="p-3 sm:p-4 text-center text-emerald-400 font-semibold">Free</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Free*</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Free</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Free</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Free*</td>
                <td className="p-3 sm:p-4 text-center text-white/60">$30/seat</td>
                <td className="p-3 sm:p-4 text-center text-white/60">$24/user</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 text-white/40 font-medium">Implementation</td>
                <td className="p-3 sm:p-4 text-center bg-accent/5 border-x border-white/[0.06] text-white font-medium">
                  Rust CLI
                </td>
                <td className="p-3 sm:p-4 text-center text-white/60">TypeScript</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Rust</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Python</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Python</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Python</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Cloud</td>
                <td className="p-3 sm:p-4 text-center text-white/60">Cloud</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs text-white/30 mt-4 text-center">
          * GitLab KG requires GitLab instance (free tier available). Graphify enterprise pricing not public. Understand-Anything requires a host IDE with LLM (MIT license). Data as of May 2026.
        </p>
      </div>
    </SectionWrapper>
  );
}
