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

// Kept deliberately short. A table where one column is a solid row of
// checkmarks tells the reader nothing except that its author wrote it — so this
// lists the handful of things that genuinely differ, including the rows where
// Myceliums is the one losing.
const FEATURES: Feature[] = [
  // Where Myceliums is genuinely different
  { name: "Cypher query engine (read-only)", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Process / execution-flow tracing", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "partial" },
  { name: "Impact detection before a change", myceliums: "yes", gitlabKg: "partial", graphify: "no", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "partial", coderabbit: "no", understandAnything: "partial" },
  { name: "Symbol rename preview", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Architecture drift detection", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "BM25 + semantic + hybrid search", myceliums: "yes", gitlabKg: "no", graphify: "no", codeReviewGraph: "partial", tokenSavior: "partial", greptile: "no", coderabbit: "no", understandAnything: "partial" },

  // Table stakes in this category — most tools have these
  { name: "MCP server", myceliums: "yes", gitlabKg: "yes", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "partial", coderabbit: "no", understandAnything: "no" },
  { name: "Local-first (no cloud)", myceliums: "yes", gitlabKg: "yes", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "yes" },
  { name: "Indexes without an LLM", myceliums: "yes", gitlabKg: "yes", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Community / god-node detection", myceliums: "yes", gitlabKg: "no", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "yes" },

  // Where Myceliums loses
  { name: "Ingests docs, configs, SQL schemas", myceliums: "partial", gitlabKg: "no", graphify: "yes", codeReviewGraph: "no", tokenSavior: "no", greptile: "no", coderabbit: "no", understandAnything: "partial" },
  { name: "Automated PR review in CI", myceliums: "no", gitlabKg: "partial", graphify: "partial", codeReviewGraph: "yes", tokenSavior: "no", greptile: "yes", coderabbit: "yes", understandAnything: "no" },
  { name: "Persistent cross-session memory", myceliums: "no", gitlabKg: "no", graphify: "no", codeReviewGraph: "no", tokenSavior: "yes", greptile: "no", coderabbit: "no", understandAnything: "no" },
  { name: "Proven at scale / large user base", myceliums: "no", gitlabKg: "yes", graphify: "yes", codeReviewGraph: "yes", tokenSavior: "partial", greptile: "yes", coderabbit: "yes", understandAnything: "yes" },
  { name: "Commercial support / SLA", myceliums: "no", gitlabKg: "yes", graphify: "partial", codeReviewGraph: "no", tokenSavior: "no", greptile: "yes", coderabbit: "yes", understandAnything: "no" },
];

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
            Code knowledge graphs got crowded fast, and several of the
            alternatives below are far more established than this one. Here is
            where Myceliums actually differs — and where you should pick
            something else.
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
                <td className="p-3 sm:p-4 text-center text-white/60">$30/seat*</td>
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

        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5" data-animate>
          <p className="text-sm text-white/60 leading-relaxed">
            <span className="text-white/80 font-medium">Pick something else if:</span>{" "}
            you want the most-adopted option with the largest community — Graphify
            and Understand-Anything are both far ahead there. If you need code
            review posted into your PRs with a support contract behind it,
            Greptile or CodeRabbit are products; this is a tool. And if your pain
            is scattered documentation rather than code structure, Graphify
            handles non-code sources better today.
          </p>
        </div>

        <p className="text-xs text-white/30 mt-4 text-center max-w-3xl mx-auto">
          Compiled from public documentation and repositories, July 2026.
          Competitors ship quickly and this will go stale — if a row is wrong,
          please{" "}
          <a
            href="https://github.com/marcmantei/myceliums/issues/new"
            className="underline hover:text-white/50"
          >
            open an issue
          </a>{" "}
          and it gets corrected. * GitLab KG requires a GitLab instance (free
          tier available). Graphify&apos;s enterprise tier is early access with no
          public pricing. Greptile is $30/seat plus $1 per review beyond 50.
        </p>
      </div>
    </SectionWrapper>
  );
}
