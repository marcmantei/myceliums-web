"use client";

import { useEffect, useState } from "react";

interface Hotspot {
  name: string;
  qualified_name: string;
  kind: string;
  file_path: string;
  community: string;
  score: number;
  betweenness: number;
  churn: number;
  instability: number;
  degree: number;
}

function scoreToColor(score: number, maxScore: number): string {
  const ratio = Math.min(score / maxScore, 1);
  if (ratio < 0.33) return "#10B981"; // green
  if (ratio < 0.66) return "#F59E0B"; // yellow
  return "#EF4444"; // red
}

export default function HotspotDemo() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    fetch("/demos/hotspots-express.json")
      .then((r) => r.json())
      .then(setHotspots)
      .catch(() => {});
  }, []);

  if (hotspots.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-tertiary text-sm">
        Loading hotspots...
      </div>
    );
  }

  const maxScore = hotspots[0].score;
  const top10 = hotspots.slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <div className="space-y-1.5">
        {top10.map((h, i) => {
          const width = Math.max((h.score / maxScore) * 100, 8);
          const color = scoreToColor(h.score, maxScore);
          const isHovered = hovered === i;

          return (
            <div
              key={i}
              className="flex items-center gap-3 group cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="text-[11px] font-mono text-text-tertiary w-4 text-right">
                {i + 1}
              </span>
              <span
                className={`text-xs font-mono truncate transition-colors ${
                  isHovered ? "text-white" : "text-text-secondary"
                }`}
                style={{ width: 120 }}
              >
                {h.name}
              </span>
              <div className="flex-1 h-5 rounded bg-white/[0.03] overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    width: `${width}%`,
                    backgroundColor: color,
                    opacity: isHovered ? 0.9 : 0.6,
                  }}
                />
              </div>
              <span className="text-[11px] font-mono text-text-tertiary w-12 text-right">
                {h.score.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hovered !== null && (
        <div className="px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono grid grid-cols-2 gap-x-6 gap-y-1">
          <span className="text-text-tertiary">Centrality</span>
          <span className="text-accent">
            {top10[hovered].betweenness.toFixed(3)}
          </span>
          <span className="text-text-tertiary">Git churn</span>
          <span className="text-warning">{top10[hovered].churn} commits</span>
          <span className="text-text-tertiary">Instability</span>
          <span className="text-danger">
            {top10[hovered].instability.toFixed(2)}
          </span>
          <span className="text-text-tertiary">File</span>
          <span className="text-text-secondary">
            {top10[hovered].file_path}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-[10px] font-mono text-text-tertiary">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> Low risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-warning" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-danger" /> High risk
        </span>
      </div>
    </div>
  );
}
