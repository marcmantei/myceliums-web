"use client";

import { motion } from "framer-motion";

interface AnnotationProps {
  label: string;
  x: number;
  y: number;
  /** Anchor point where the line connects to the target */
  targetX: number;
  targetY: number;
  /** Delay before appearing */
  delay?: number;
  /** Position of the label relative to the anchor: left or right */
  side?: "left" | "right";
}

/**
 * SVG annotation callout — a line from a target point to a label.
 * Used inside SVG elements to point out key parts of a visual.
 */
export default function Annotation({
  label,
  x,
  y,
  targetX,
  targetY,
  delay = 0,
  side = "right",
}: AnnotationProps) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Connecting line */}
      <motion.line
        x1={targetX}
        y1={targetY}
        x2={x}
        y2={y}
        stroke="#6366F1"
        strokeWidth="1"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ delay, duration: 0.4 }}
      />
      {/* Dot at target */}
      <motion.circle
        cx={targetX}
        cy={targetY}
        r="3"
        fill="#6366F1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay, duration: 0.3 }}
      />
      {/* Label background */}
      <rect
        x={side === "right" ? x + 4 : x - label.length * 7 - 12}
        y={y - 10}
        width={label.length * 7 + 16}
        height={20}
        rx="4"
        fill="#18181B"
        stroke="#3F3F46"
        strokeWidth="1"
      />
      {/* Label text */}
      <text
        x={side === "right" ? x + 12 : x - label.length * 7 - 4}
        y={y + 4}
        fontFamily="JetBrains Mono, monospace"
        fontSize="11"
        fill="#818CF8"
      >
        {label}
      </text>
    </motion.g>
  );
}
