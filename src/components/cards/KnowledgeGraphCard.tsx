"use client";

import { useEffect, useRef, useState } from "react";

const NODES = [
  { x: 25, y: 20, color: "#6366F1", r: 4 },
  { x: 55, y: 12, color: "#6366F1", r: 3.5 },
  { x: 85, y: 25, color: "#10B981", r: 4 },
  { x: 70, y: 50, color: "#10B981", r: 3 },
  { x: 40, y: 55, color: "#10B981", r: 3.5 },
  { x: 15, y: 50, color: "#F59E0B", r: 3 },
  { x: 45, y: 35, color: "#6366F1", r: 3 },
  { x: 75, y: 38, color: "#10B981", r: 2.5 },
];

const EDGES = [
  [0, 1], [1, 6], [6, 0], [2, 3], [3, 4], [2, 7],
  [4, 5], [6, 4], [1, 2], [7, 3],
];

export default function KnowledgeGraphCard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % 5), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 70" className="w-full h-full">
      {/* Community hulls */}
      {step >= 3 && (
        <>
          <ellipse cx="40" cy="22" rx="28" ry="16" fill="#6366F1" opacity="0.06"
            style={{ transition: "opacity 0.5s" }} />
          <ellipse cx="68" cy="42" rx="25" ry="18" fill="#10B981" opacity="0.06"
            style={{ transition: "opacity 0.5s" }} />
        </>
      )}

      {/* Edges */}
      {EDGES.map(([from, to], i) => (
        <line
          key={`e${i}`}
          x1={NODES[from].x} y1={NODES[from].y}
          x2={NODES[to].x} y2={NODES[to].y}
          stroke="white"
          strokeWidth="0.6"
          opacity={step >= 2 ? 0.15 : 0}
          style={{ transition: `opacity 0.4s ease ${i * 0.05}s` }}
        />
      ))}

      {/* Nodes */}
      {NODES.map((node, i) => (
        <circle
          key={`n${i}`}
          cx={node.x} cy={node.y}
          r={step >= 1 ? node.r : 0}
          fill={node.color}
          opacity={step >= 1 ? 0.85 : 0}
          style={{ transition: `all 0.3s ease ${i * 0.06}s` }}
        />
      ))}

      {/* Labels */}
      {step >= 4 && (
        <>
          <text x="25" y="68" fontSize="4" fill="white" opacity="0.3" textAnchor="middle" fontFamily="monospace">Auth</text>
          <text x="65" y="68" fontSize="4" fill="white" opacity="0.3" textAnchor="middle" fontFamily="monospace">API</text>
        </>
      )}
    </svg>
  );
}
