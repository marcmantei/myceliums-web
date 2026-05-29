"use client";

import { useEffect, useState } from "react";

interface Snapshot {
  id: string;
  date: string;
  commit: string;
  symbols: number;
  edges: number;
  communities: number;
  drift_score: number;
  diff: {
    added_symbols: number;
    removed_symbols: number;
    added_edges: number;
    removed_edges: number;
    community_changes?: Array<{
      label: string;
      change: string;
      old?: number;
      new?: number;
    }>;
  } | null;
}

function RadialGauge({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score > 80 ? "#10B981" : score > 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272A"
          strokeWidth="6"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-text-tertiary font-mono">
          / 100
        </span>
      </div>
    </div>
  );
}

export default function DriftDetectionDemo() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selected, setSelected] = useState(4); // Latest by default

  useEffect(() => {
    fetch("/demos/drift-express.json")
      .then((r) => r.json())
      .then((data: Snapshot[]) => setSnapshots(data))
      .catch(() => {});
  }, []);

  if (snapshots.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-text-tertiary text-sm">
        Loading drift data...
      </div>
    );
  }

  const current = snapshots[selected];

  return (
    <div className="space-y-6">
      {/* Main display: gauge + stats */}
      <div className="flex items-center gap-8 flex-wrap justify-center">
        <div className="text-center">
          <RadialGauge score={current.drift_score} size={140} />
          <p className="text-xs text-text-tertiary mt-2 font-mono">
            Drift Score
          </p>
        </div>

        {current.diff && (
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-lg font-bold text-emerald-400">
                +{current.diff.added_symbols}
              </span>
              <p className="text-[10px] text-text-tertiary">symbols added</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-lg font-bold text-red-400">
                -{current.diff.removed_symbols}
              </span>
              <p className="text-[10px] text-text-tertiary">symbols removed</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-lg font-bold text-emerald-400">
                +{current.diff.added_edges}
              </span>
              <p className="text-[10px] text-text-tertiary">edges added</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-lg font-bold text-red-400">
                -{current.diff.removed_edges}
              </span>
              <p className="text-[10px] text-text-tertiary">edges removed</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Line */}
        <div className="absolute top-3 left-6 right-6 h-px bg-white/10" />

        <div className="flex justify-between px-2">
          {snapshots.map((snap, i) => {
            const isSelected = i === selected;
            const color =
              snap.drift_score > 80
                ? "bg-emerald-500"
                : snap.drift_score > 50
                  ? "bg-amber-500"
                  : "bg-red-500";

            return (
              <button
                key={snap.id}
                onClick={() => setSelected(i)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? `${color} border-white/40 scale-110`
                      : "bg-surface-2 border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="text-[8px] font-bold text-white">
                    {snap.drift_score}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono ${
                    isSelected ? "text-white" : "text-text-tertiary"
                  }`}
                >
                  {snap.date.slice(5)}
                </span>
                <span className="text-[8px] font-mono text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                  {snap.commit}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
