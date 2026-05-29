"use client";

import { useEffect, useState } from "react";

const AFFECTED_NODES = [
  { x: 30, y: 20, delay: 0.3 },
  { x: 70, y: 15, delay: 0.5 },
  { x: 80, y: 45, delay: 0.7 },
  { x: 25, y: 55, delay: 0.9 },
  { x: 60, y: 60, delay: 1.1 },
];

export default function ImpactDetectionCard() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setActive(true);
      setCount(0);
      let c = 0;
      const counter = setInterval(() => {
        c++;
        setCount(c);
        if (c >= AFFECTED_NODES.length) clearInterval(counter);
      }, 200);

      setTimeout(() => {
        setActive(false);
        setCount(0);
        clearInterval(counter);
      }, 3500);
    };

    cycle();
    const interval = setInterval(cycle, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 70" className="w-full h-full">
        {/* Ripple rings */}
        {[1, 2, 3].map((ring) => (
          <circle
            key={ring}
            cx="50" cy="35"
            r={active ? ring * 18 : 0}
            fill="none"
            stroke="#EF4444"
            strokeWidth="0.5"
            opacity={active ? 0.3 - ring * 0.08 : 0}
            style={{ transition: `all ${0.5 + ring * 0.2}s ease-out` }}
          />
        ))}

        {/* Center node (changed symbol) */}
        <circle cx="50" cy="35" r="4" fill="#EF4444" opacity="0.9">
          {active && (
            <animate attributeName="r" values="4;5;4" dur="0.8s" repeatCount="indefinite" />
          )}
        </circle>

        {/* Affected nodes */}
        {AFFECTED_NODES.map((node, i) => (
          <circle
            key={i}
            cx={node.x} cy={node.y}
            r="3"
            fill={active && count > i ? "#F59E0B" : "#3F3F46"}
            opacity={active && count > i ? 0.9 : 0.3}
            style={{ transition: `all 0.3s ease ${node.delay}s` }}
          />
        ))}
      </svg>

      {/* Counter */}
      {count > 0 && (
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-warning">
          {count} affected
        </div>
      )}
    </div>
  );
}
