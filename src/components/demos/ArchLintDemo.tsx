"use client";

import { useEffect, useState } from "react";

interface LintData {
  total_findings: number;
  rules: Record<
    string,
    {
      severity: string;
      count: number;
      findings: Array<Record<string, unknown>>;
    }
  >;
}

const SEVERITY_COLORS = {
  error: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-500" },
  warning: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-500" },
  info: { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30", dot: "bg-sky-500" },
};

const RULE_LABELS: Record<string, { name: string; icon: string }> = {
  circular_dependency: { name: "Circular Dependencies", icon: "🔄" },
  god_node: { name: "God Nodes", icon: "⚡" },
  high_fan_out: { name: "High Fan-out", icon: "🌊" },
  unstable_dependency: { name: "Unstable Dependencies", icon: "📐" },
};

export default function ArchLintDemo() {
  const [data, setData] = useState<LintData | null>(null);

  useEffect(() => {
    fetch("/demos/lint-express.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48 text-text-tertiary text-sm">
        Loading lint results...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-white">
          {data.total_findings}
        </span>
        <span className="text-sm text-text-secondary">findings in</span>
        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-mono border border-accent/20">
          express
        </span>
      </div>

      {/* Rule cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(data.rules).map(([ruleId, rule]) => {
          const colors = SEVERITY_COLORS[rule.severity as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.info;
          const label = RULE_LABELS[ruleId] || { name: ruleId, icon: "📋" };

          return (
            <div
              key={ruleId}
              className={`rounded-xl border ${colors.border} ${colors.bg} p-3 space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{label.icon}</span>
                  <span className="text-xs font-medium text-white/80">
                    {label.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-mono ${colors.text}`}>
                    {rule.count}
                  </span>
                </div>
              </div>

              {/* Sample findings */}
              <div className="space-y-1">
                {rule.findings.slice(0, 2).map((finding, i) => (
                  <div key={i} className="text-[10px] font-mono text-text-tertiary truncate">
                    {finding.name as string || finding.members
                      ? (finding.members as string[])?.join(" → ")
                      : finding.stable_module
                        ? `${finding.stable_module} → ${finding.unstable_module}`
                        : JSON.stringify(finding).slice(0, 50)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
