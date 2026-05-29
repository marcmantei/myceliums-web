"use client";

import { useEffect, useState } from "react";

const AGENTS = [
  { label: "Claude", x: 10, y: 18 },
  { label: "Cursor", x: 10, y: 35 },
  { label: "Windsurf", x: 10, y: 52 },
];

export default function MCPIntegrationCard() {
  const [activeBeam, setActiveBeam] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBeam((b) => (b + 1) % AGENTS.length);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 70" className="w-full h-full">
      {/* Agent nodes */}
      {AGENTS.map((agent, i) => (
        <g key={i}>
          <rect
            x={agent.x} y={agent.y - 5}
            width="20" height="10"
            rx="2"
            fill={i === activeBeam ? "#6366F1" : "#27272A"}
            stroke={i === activeBeam ? "#818CF8" : "#3F3F46"}
            strokeWidth="0.5"
            style={{ transition: "all 0.3s" }}
          />
          <text
            x={agent.x + 10} y={agent.y + 1}
            fontSize="3.5" fill="white"
            opacity={i === activeBeam ? 0.9 : 0.4}
            textAnchor="middle"
            fontFamily="monospace"
          >
            {agent.label}
          </text>

          {/* Beam */}
          <line
            x1={agent.x + 20} y1={agent.y}
            x2={50} y2={35}
            stroke="#818CF8"
            strokeWidth={i === activeBeam ? "1" : "0.3"}
            opacity={i === activeBeam ? 0.6 : 0.1}
            strokeDasharray={i === activeBeam ? "none" : "2 2"}
            style={{ transition: "all 0.3s" }}
          />
        </g>
      ))}

      {/* MCP Hub */}
      <circle
        cx="50" cy="35" r="6"
        fill={pulse ? "#6366F1" : "#18181B"}
        stroke="#818CF8"
        strokeWidth="0.8"
        style={{ transition: "fill 0.3s" }}
      />
      <text x="50" y="37" fontSize="3.5" fill="white" opacity="0.8" textAnchor="middle" fontFamily="monospace">
        MCP
      </text>

      {/* Beam to myceliums */}
      <line x1="56" y1="35" x2="75" y2="35" stroke="#10B981" strokeWidth="0.8" opacity="0.4" />

      {/* Myceliums node */}
      <rect x="75" y="28" width="22" height="14" rx="3" fill="#111113" stroke="#10B981" strokeWidth="0.5" />
      <text x="86" y="37" fontSize="3" fill="#10B981" opacity="0.8" textAnchor="middle" fontFamily="monospace">
        myceliums
      </text>
    </svg>
  );
}
