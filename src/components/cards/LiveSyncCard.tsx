"use client";

import { useState, useEffect } from "react";

interface Node {
  x: number;
  y: number;
  label: string;
}

const NODES: Node[] = [
  { x: 120, y: 30, label: "main.ts" },
  { x: 50, y: 80, label: "auth" },
  { x: 190, y: 80, label: "api" },
  { x: 30, y: 140, label: "store" },
  { x: 170, y: 140, label: "routes" },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
];

// Which nodes get highlighted at each step (ripple from node 0)
const RIPPLE_STEPS = [
  [0],       // source change
  [1, 2],    // direct dependents
  [3, 4],    // transitive dependents
];

const STEP_MS = 800;
const PAUSE_MS = 1200;

export default function LiveSyncCard() {
  const [step, setStep] = useState(-1); // -1 = idle
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set());
  const [highlightedEdges, setHighlightedEdges] = useState<Set<number>>(new Set());

  useEffect(() => {
    let current = -1;
    const totalSteps = RIPPLE_STEPS.length;

    const interval = setInterval(() => {
      current++;

      if (current < totalSteps) {
        const nodesAtStep = RIPPLE_STEPS[current];
        setHighlightedNodes((prev) => {
          const next = new Set(prev);
          nodesAtStep.forEach((n) => next.add(n));
          return next;
        });

        // Highlight edges that connect to newly highlighted nodes
        setHighlightedEdges((prev) => {
          const next = new Set(prev);
          EDGES.forEach(([from, to], i) => {
            if (nodesAtStep.includes(to) || nodesAtStep.includes(from)) {
              next.add(i);
            }
          });
          return next;
        });

        setStep(current);
      } else if (current === totalSteps) {
        // Hold
      } else {
        // Reset
        current = -1;
        setStep(-1);
        setHighlightedNodes(new Set());
        setHighlightedEdges(new Set());
      }
    }, current === RIPPLE_STEPS.length ? PAUSE_MS : STEP_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full px-2 py-2">
      <svg viewBox="0 0 240 170" className="w-full h-full">
        {/* Edges */}
        {EDGES.map(([from, to], i) => (
          <line
            key={`e-${i}`}
            x1={NODES[from].x}
            y1={NODES[from].y}
            x2={NODES[to].x}
            y2={NODES[to].y}
            stroke={highlightedEdges.has(i) ? "var(--accent)" : "rgba(255,255,255,0.08)"}
            strokeWidth={highlightedEdges.has(i) ? 2 : 1.5}
            style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
          />
        ))}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const isSource = i === 0 && highlightedNodes.has(0);
          const isHighlighted = highlightedNodes.has(i);

          return (
            <g key={`n-${i}`}>
              {/* Pulse ring for source node */}
              {isSource && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={14}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  opacity={0.4}
                  className="animate-pulse"
                />
              )}

              <circle
                cx={node.x}
                cy={node.y}
                r={8}
                fill={isHighlighted ? "var(--accent)" : "rgba(255,255,255,0.1)"}
                stroke={isHighlighted ? "var(--accent-glow)" : "rgba(255,255,255,0.06)"}
                strokeWidth={1}
                style={{ transition: "fill 0.4s, stroke 0.4s" }}
              />

              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                fontSize={8}
                fontFamily="var(--font-mono)"
                className="fill-text-secondary"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
