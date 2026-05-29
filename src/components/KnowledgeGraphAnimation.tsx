"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Type definitions for graph nodes and edges
interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number; // 0.8–1.2 multiplier
}

interface Edge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Animation variants
const codeVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
  pulse: {
    opacity: [1, 0.6, 1],
  },
};

const edgeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 0.4 },
  pulse: { opacity: [0.4, 0.7, 0.4] },
};

const labelVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

// Mock data for the knowledge graph animation
// These are placeholder/fake values as requested
const getMockNodes = (): Node[] => [
  { id: "parseCode", label: "parseCode", x: 80, y: 120, size: 1.0 },
  { id: "extractSymbols", label: "symbols", x: 200, y: 80, size: 1.1 },
  { id: "buildGraph", label: "graph", x: 320, y: 100, size: 0.95 },
  { id: "analyzeRelations", label: "relations", x: 250, y: 220, size: 1.05 },
  { id: "querify", label: "query", x: 150, y: 280, size: 0.9 },
];

const getMockEdges = (): Edge[] => [
  { id: "e1", x1: 80, y1: 120, x2: 200, y2: 80 },
  { id: "e2", x1: 200, y1: 80, x2: 320, y2: 100 },
  { id: "e3", x1: 320, y1: 100, x2: 250, y2: 220 },
  { id: "e4", x1: 250, y1: 220, x2: 150, y2: 280 },
  { id: "e5", x1: 200, y1: 80, x2: 250, y2: 220 },
];

export default function KnowledgeGraphAnimation() {
  const nodes = useMemo(() => getMockNodes(), []);
  const edges = useMemo(() => getMockEdges(), []);

  return (
    <motion.svg
      viewBox="0 0 400 350"
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Frame 1: Code snippet (0–1s) */}
      <motion.g
        className="code-group"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={codeVariants}
        transition={{ duration: 0.5, delay: 0 }}
      >
        <text
          x="10"
          y="25"
          fontFamily="JetBrains Mono, monospace"
          fontSize="12"
          fill="#A1A1AA"
          letterSpacing="-0.5"
        >
          const graph = parseCode(src)
        </text>
      </motion.g>

      {/* Frames 2–4: Nodes, Edges, Labels (animated appearance and pulsing) */}
      {/* Edges first (background layer) */}
      <motion.g className="edges-group" stroke="#6366F1" strokeWidth="1.5">
        {edges.map((edge, i) => (
          <motion.line
            key={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.4, pathLength: 1 }}
            transition={{
              opacity: {
                delay: 1.0 + i * 0.15,
                duration: 0.6,
              },
              pathLength: {
                delay: 1.0 + i * 0.15,
                duration: 0.6,
              },
            }}
          />
        ))}
      </motion.g>

      {/* Nodes (foreground layer) */}
      <motion.g className="nodes-group">
        {nodes.map((node, i) => (
          <motion.g key={node.id}>
            {/* Glow effect */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={10 * node.size}
              fill="none"
              stroke="#6366F1"
              strokeWidth="0.5"
              initial={{ opacity: 0, r: 2 * node.size }}
              animate={{ opacity: 0.2, r: 10 * node.size }}
              transition={{
                r: {
                  delay: 1.3 + i * 0.15,
                  duration: 0.4,
                },
                opacity: {
                  delay: 1.3 + i * 0.15,
                  duration: 0.4,
                },
              }}
            />
            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={6 * node.size}
              fill="#6366F1"
              filter="url(#glow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.3 + i * 0.15,
                duration: 0.4,
              }}
            />
          </motion.g>
        ))}
      </motion.g>

      {/* Labels */}
      <motion.g
        className="labels-group"
        fontFamily="JetBrains Mono, monospace"
        fontSize="10"
        fill="#818CF8"
      >
        {nodes.map((node, i) => (
          <motion.text
            key={`label-${node.id}`}
            x={node.x}
            y={node.y + 20}
            textAnchor="middle"
            initial={{ opacity: 0, y: node.y + 10 }}
            animate={{ opacity: 1, y: node.y + 20 }}
            transition={{
              delay: 1.8 + i * 0.1,
              duration: 0.4,
            }}
          >
            {node.label}
          </motion.text>
        ))}
      </motion.g>

      {/* Activity indicator text (appears at end of sequence) */}
      <motion.text
        x="200"
        y="330"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="12"
        fill="#818CF8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 3.0,
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2.0,
        }}
      >
        Knowledge Graph
      </motion.text>
    </motion.svg>
  );
}
