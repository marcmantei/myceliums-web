"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BarChartItem {
  label: string;
  before: number;
  after: number;
  unit?: string;
}

interface BarChartProps {
  items: BarChartItem[];
}

export default function BarChart({ items }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const beforeBars = containerRef.current.querySelectorAll(".bar-before");
      const afterBars = containerRef.current.querySelectorAll(".bar-after");

      gsap.from(beforeBars, {
        width: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      gsap.from(afterBars, {
        width: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="space-y-8">
      {items.map((item, i) => {
        const max = Math.max(item.before, item.after);
        const beforePct = (item.before / max) * 100;
        const afterPct = (item.after / max) * 100;

        return (
          <div key={i}>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-sm font-medium">{item.label}</span>
            </div>

            {/* Before bar */}
            <div className="mb-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-danger w-16 shrink-0">Without</span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded-lg overflow-hidden">
                  <div
                    className="bar-before h-full bg-danger/30 rounded-lg flex items-center justify-end pr-2"
                    style={{ width: `${beforePct}%` }}
                  >
                    <span className="text-[10px] font-mono text-danger">
                      {item.before.toLocaleString()}{item.unit || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* After bar */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-success w-16 shrink-0">With</span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded-lg overflow-hidden">
                  <div
                    className="bar-after h-full bg-success/30 rounded-lg flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(afterPct, 3)}%` }}
                  >
                    <span className="text-[10px] font-mono text-success">
                      {item.after.toLocaleString()}{item.unit || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
