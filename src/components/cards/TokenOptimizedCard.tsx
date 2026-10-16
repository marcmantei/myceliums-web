"use client";

import { useEffect, useState } from "react";

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
    <div className="p-3 font-mono text-[9px] sm:text-[10px] h-full flex flex-col justify-center gap-3">
      {/* Before */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-danger">Full files</span>
          <span className="text-text-tertiary">whole source</span>
        </div>
        <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className="h-full bg-danger/60 rounded-full"
            style={{
              width: animate ? "100%" : "0%",
              transition: "width 1s ease-out",
            }}
          />
        </div>
      </div>

      {/* After */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-success">Structural summary</span>
          <span className="text-text-tertiary">signatures only</span>
        </div>
        <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className="h-full bg-success/60 rounded-full"
            style={{
              width: animate ? "2%" : "0%",
              transition: "width 1.5s ease-out 0.5s",
            }}
          />
        </div>
      </div>

      {/* Badge */}
      <div
        className="text-center"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "scale(1)" : "scale(0.8)",
          transition: "all 0.3s ease 2s",
        }}
      >
        <span className="inline-block px-2 py-0.5 bg-success/10 text-success rounded text-[10px] font-semibold">
          summary, not source
        </span>
      </div>
    </div>
  );
}
