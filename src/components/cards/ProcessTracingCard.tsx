"use client";

import { useEffect, useState } from "react";

const TREE_NODES = [
  { x: 50, y: 8, label: "main" },
  { x: 25, y: 28, label: "auth" },
  { x: 75, y: 28, label: "api" },
  { x: 12, y: 50, label: "validate" },
  { x: 38, y: 50, label: "session" },
  { x: 62, y: 50, label: "handler" },
  { x: 88, y: 50, label: "db" },
];

const TREE_EDGES = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
];

// Traversal order (depth-first)
const TRAVERSAL = [0, 1, 3, 4, 2, 5, 6];

export default function ProcessTracingCard() {
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [currentEdge, setCurrentEdge] = useState(-1);

  useEffect(() => {
    let step = 0;
    const run = () => {
      step = 0;
      setVisited(new Set());
      setCurrentEdge(-1);

      const interval = setInterval(() => {
        if (step >= TRAVERSAL.length) {
          clearInterval(interval);
          setTimeout(run, 2000);
          return;
        }
        const nodeIdx = TRAVERSAL[step];
        setVisited((prev) => new Set([...prev, nodeIdx]));

        // Find edge to this node
        const edgeIdx = TREE_EDGES.findIndex(([, to]) => to === nodeIdx);
        if (edgeIdx >= 0) setCurrentEdge(edgeIdx);

        step++;
      }, 400);
    };

    run();
  }, []);

  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      {/* Edges */}
      {TREE_EDGES.map(([from, to], i) => (
        <line
          key={`e${i}`}
          x1={TREE_NODES[from].x} y1={TREE_NODES[from].y}
          x2={TREE_NODES[to].x} y2={TREE_NODES[to].y}
          stroke={visited.has(to) ? "#818CF8" : "#3F3F46"}
          strokeWidth={i === currentEdge ? "1.5" : "0.8"}
          opacity={visited.has(to) ? 0.6 : 0.2}
          style={{ transition: "all 0.3s ease" }}
        />
      ))}

      {/* Nodes */}
      {TREE_NODES.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x} cy={node.y}
            r={visited.has(i) ? 4 : 3}
            fill={visited.has(i) ? "#6366F1" : "#27272A"}
            stroke={visited.has(i) ? "#818CF8" : "#3F3F46"}
            strokeWidth="0.5"
            style={{ transition: "all 0.3s ease" }}
          />
          <text
            x={node.x} y={node.y + 10}
            fontSize="3.5" fill="white"
            opacity={visited.has(i) ? 0.5 : 0.2}
            textAnchor="middle"
            fontFamily="monospace"
            style={{ transition: "opacity 0.3s ease" }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
