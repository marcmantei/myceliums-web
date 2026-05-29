"use client";

import { useState, useEffect, useCallback } from "react";

const CYCLE_MS = 4000;
const FILL_MS = 1500;
const STEPS = 30;

export default function TokenComparisonCard() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"filling" | "hold" | "reset">("filling");

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;

      if (phase === "filling") {
        const p = Math.min(elapsed / FILL_MS, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(eased);
        if (p >= 1) {
          setPhase("hold");
          start = null;
        }
      } else if (phase === "hold") {
        if (elapsed > 1800) {
          setPhase("reset");
          start = null;
        }
      } else if (phase === "reset") {
        setProgress(0);
        setPhase("filling");
        start = null;
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const rawHeight = progress * 92; // percent
  const myceliumsHeight = progress * 14;
  const rawTokens = Math.round(progress * 48000);
  const myceliumsTokens = Math.round(progress * 3200);

  return (
    <div className="flex items-end justify-center gap-8 min-h-[180px] px-4 py-4">
      {/* Raw context bar */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
        <span className="text-[10px] font-mono text-text-tertiary">
          {rawTokens.toLocaleString()}
        </span>
        <div className="relative w-full h-[120px] rounded overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-b"
            style={{ height: `${rawHeight}%`, backgroundColor: "rgba(239,68,68,0.6)" }}
          />
        </div>
        <span className="text-[10px] font-medium text-danger">Raw context</span>
      </div>

      {/* Myceliums bar */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
        <span className="text-[10px] font-mono text-text-tertiary">
          {myceliumsTokens.toLocaleString()}
        </span>
        <div className="relative w-full h-[120px] rounded overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-b"
            style={{ height: `${myceliumsHeight}%`, backgroundColor: "rgba(16,185,129,0.6)" }}
          />
        </div>
        <span className="text-[10px] font-medium text-success">Myceliums</span>
      </div>
    </div>
  );
}
