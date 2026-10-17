"use client";

import { useEffect, useState } from "react";

// What get_review_context returns, section by section. Deliberately no sizes or
// bars: the size ratio between a summary and the full files depends on the diff
// and has not been measured with an agent.
const SECTIONS = [
  { label: "Changed", detail: "symbols" },
  { label: "Callers", detail: "signatures" },
  { label: "Callees", detail: "signatures" },
  { label: "Communities", detail: "touched" },
];

export default function TokenOptimizedCard() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const run = () => {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 200);
    };
    run();
    const interval = setInterval(run, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 font-mono text-[9px] sm:text-[10px] h-full flex flex-col justify-center gap-2">
      <div className="text-accent">get_review_context(diff)</div>

      <div className="space-y-1">
        {SECTIONS.map((s, i) => (
          <div
            key={s.label}
            className="flex items-center justify-between px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06]"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateX(0)" : "translateX(-6px)",
              transition: `all 0.4s ease ${0.2 + i * 0.25}s`,
            }}
          >
            <span className="text-success">{s.label}</span>
            <span className="text-text-tertiary">{s.detail}</span>
          </div>
        ))}
      </div>

      {/* Badge */}
      <div
        className="text-center"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "scale(1)" : "scale(0.8)",
          transition: "all 0.3s ease 1.5s",
        }}
      >
        <span className="inline-block px-2 py-0.5 bg-success/10 text-success rounded text-[10px] font-semibold">
          summary, not source
        </span>
      </div>
    </div>
  );
}
