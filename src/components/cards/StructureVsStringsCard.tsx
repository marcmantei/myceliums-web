"use client";

import { useState, useEffect } from "react";

const CODE_LINES = [
  "export function handleAuth(req) {",
  "  const token = validate(req);",
  "  if (!token) throw new Error();",
  "  return session.create(token);",
  "}",
  "import { TokenStore } from './store';",
];

interface GraphNode {
  x: number;
  y: number;
  label: string;
  color: string;
}

const NODES: GraphNode[] = [
  { x: 120, y: 30, label: "handleAuth", color: "var(--accent)" },
  { x: 50, y: 80, label: "validate", color: "var(--success)" },
  { x: 190, y: 80, label: "session", color: "var(--success)" },
  { x: 50, y: 135, label: "TokenStore", color: "var(--warning)" },
  { x: 190, y: 135, label: "create", color: "var(--accent)" },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
];

export default function StructureVsStringsCard() {
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowGraph((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden px-3 py-3">
      {/* Code phase */}
      <div
        className="absolute inset-0 px-3 py-3 flex flex-col justify-center transition-all duration-700"
        style={{
          opacity: showGraph ? 0 : 1,
          transform: showGraph ? "scale(0.95)" : "scale(1)",
          filter: showGraph ? "blur(4px)" : "blur(0px)",
        }}
      >
        {CODE_LINES.map((line, i) => (
          <div
            key={i}
            className="font-mono text-[10px] text-text-tertiary leading-relaxed whitespace-pre"
          >
            {line}
          </div>
        ))}
      </div>

      {/* Graph phase */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          opacity: showGraph ? 1 : 0,
          transform: showGraph ? "scale(1)" : "scale(0.95)",
        }}
      >
        <svg viewBox="0 0 240 170" className="w-full h-full">
          {/* Edges */}
          {EDGES.map(([from, to], i) => (
            <line
              key={`e-${i}`}
              x1={NODES[from].x}
              y1={NODES[from].y}
              x2={NODES[to].x}
              y2={NODES[to].y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1.5}
            />
          ))}

          {/* Nodes */}
          {NODES.map((node, i) => (
            <g key={`n-${i}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={8}
                fill={node.color}
                opacity={0.8}
              />
              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                className="fill-text-secondary"
                fontSize={8}
                fontFamily="var(--font-mono)"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
