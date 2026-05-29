"use client";

import { motion } from "framer-motion";
import Annotation from "./Annotation";

/**
 * Community colors — each community cluster gets its own accent.
 */
const communityColors = [
  { fill: "#6366F1", glow: "#818CF8", label: "Auth" },
  { fill: "#22C55E", glow: "#4ADE80", label: "API" },
  { fill: "#F59E0B", glow: "#FBBF24", label: "Storage" },
];

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  community: number;
  kind: string;
}

interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

const nodes: GraphNode[] = [
  // Auth community (left cluster)
  { id: "auth", label: "authenticate", x: 100, y: 100, community: 0, kind: "function" },
  { id: "verify", label: "verifyToken", x: 60, y: 170, community: 0, kind: "function" },
  { id: "user", label: "User", x: 140, y: 180, community: 0, kind: "class" },
  { id: "session", label: "Session", x: 90, y: 240, community: 0, kind: "interface" },

  // API community (center cluster)
  { id: "router", label: "createRouter", x: 300, y: 90, community: 1, kind: "function" },
  { id: "handler", label: "handleRequest", x: 340, y: 160, community: 1, kind: "function" },
  { id: "middleware", label: "middleware", x: 260, y: 160, community: 1, kind: "function" },
  { id: "response", label: "Response", x: 300, y: 230, community: 1, kind: "interface" },

  // Storage community (right cluster)
  { id: "db", label: "Database", x: 490, y: 120, community: 2, kind: "class" },
  { id: "query", label: "runQuery", x: 530, y: 190, community: 2, kind: "function" },
  { id: "migrate", label: "migrate", x: 450, y: 200, community: 2, kind: "function" },
  { id: "schema", label: "Schema", x: 490, y: 260, community: 2, kind: "interface" },
];

const edges: GraphEdge[] = [
  { from: "auth", to: "verify", relation: "calls" },
  { from: "auth", to: "user", relation: "uses" },
  { from: "verify", to: "session", relation: "returns" },
  { from: "user", to: "session", relation: "has" },

  { from: "router", to: "handler", relation: "calls" },
  { from: "router", to: "middleware", relation: "calls" },
  { from: "handler", to: "response", relation: "returns" },
  { from: "middleware", to: "handler", relation: "chains" },

  { from: "db", to: "query", relation: "calls" },
  { from: "db", to: "migrate", relation: "calls" },
  { from: "query", to: "schema", relation: "uses" },
  { from: "migrate", to: "schema", relation: "uses" },

  // Cross-community edges
  { from: "middleware", to: "auth", relation: "calls" },
  { from: "handler", to: "db", relation: "calls" },
];

function getNode(id: string): GraphNode {
  return nodes.find((n) => n.id === id)!;
}

/**
 * Annotated graph preview showing communities, nodes, edges, and callout labels.
 * Pure SVG — no external images needed.
 */
export default function GraphPreview() {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 620 340"
        className="w-full"
        role="img"
        aria-label="Knowledge graph visualization showing three detected communities: Auth, API, and Storage, with nodes connected by relationship edges"
      >
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Community background blurs */}
          <filter id="community-blur">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        {/* Community background regions */}
        {communityColors.map((community, i) => {
          const communityNodes = nodes.filter((n) => n.community === i);
          const cx =
            communityNodes.reduce((sum, n) => sum + n.x, 0) / communityNodes.length;
          const cy =
            communityNodes.reduce((sum, n) => sum + n.y, 0) / communityNodes.length;
          return (
            <motion.ellipse
              key={`bg-${i}`}
              cx={cx}
              cy={cy}
              rx={90}
              ry={80}
              fill={community.fill}
              opacity={0}
              filter="url(#community-blur)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              transition={{ delay: 0.5 + i * 0.3, duration: 0.8 }}
            />
          );
        })}

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);
          const isCross = from.community !== to.community;
          return (
            <motion.line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isCross ? "#6366F1" : communityColors[from.community].fill}
              strokeWidth={isCross ? 1.5 : 1}
              strokeDasharray={isCross ? "6 4" : "none"}
              initial={{ opacity: 0 }}
              animate={{ opacity: isCross ? 0.3 : 0.25 }}
              transition={{ delay: 1.0 + i * 0.06, duration: 0.4 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const color = communityColors[node.community];
          const kindRadius =
            node.kind === "class" ? 8 : node.kind === "interface" ? 7 : 6;
          return (
            <motion.g key={node.id}>
              {/* Outer glow */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={kindRadius + 4}
                fill="none"
                stroke={color.glow}
                strokeWidth="0.5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
              />
              {/* Node circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={kindRadius}
                fill={color.fill}
                filter="url(#node-glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
              />
              {/* Node shape indicator: square outline for classes, diamond for interfaces */}
              {node.kind === "class" && (
                <motion.rect
                  x={node.x - kindRadius}
                  y={node.y - kindRadius}
                  width={kindRadius * 2}
                  height={kindRadius * 2}
                  rx={2}
                  fill="none"
                  stroke={color.glow}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                />
              )}
              {/* Label */}
              <motion.text
                x={node.x}
                y={node.y + kindRadius + 14}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                fill={color.glow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.2 + i * 0.04, duration: 0.4 }}
              >
                {node.label}
              </motion.text>
            </motion.g>
          );
        })}

        {/* Community labels */}
        {communityColors.map((community, i) => {
          const communityNodes = nodes.filter((n) => n.community === i);
          const cx =
            communityNodes.reduce((sum, n) => sum + n.x, 0) / communityNodes.length;
          const minY = Math.min(...communityNodes.map((n) => n.y));
          return (
            <motion.text
              key={`label-${i}`}
              x={cx}
              y={minY - 30}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              fontWeight="600"
              fill={community.glow}
              initial={{ opacity: 0, y: minY - 20 }}
              animate={{ opacity: 0.7, y: minY - 30 }}
              transition={{ delay: 1.8 + i * 0.2, duration: 0.4 }}
            >
              {community.label} Community
            </motion.text>
          );
        })}

        {/* Annotations */}
        <Annotation
          label="Cross-community call"
          targetX={180}
          targetY={130}
          x={160}
          y={30}
          side="right"
          delay={2.5}
        />
        <Annotation
          label="Leiden-detected cluster"
          targetX={490}
          targetY={190}
          x={490}
          y={310}
          side="left"
          delay={2.8}
        />

        {/* Legend */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.5 }}
        >
          <rect x="10" y="296" width="140" height="38" rx="6" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
          <circle cx="26" cy="308" r="4" fill="#6366F1" />
          <text x="36" y="312" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#A1A1AA">function</text>
          <rect x="82" y="304" width="8" height="8" rx="1" fill="none" stroke="#6366F1" strokeWidth="1" />
          <circle cx="86" cy="308" r="3" fill="#6366F1" />
          <text x="96" y="312" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#A1A1AA">class</text>
          <line x1="20" y1="324" x2="40" y2="324" stroke="#6366F1" strokeWidth="1" strokeDasharray="4 3" />
          <text x="46" y="328" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#A1A1AA">cross-community</text>
        </motion.g>
      </svg>
    </div>
  );
}
