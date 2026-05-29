"use client";

import { useEffect, useState } from "react";

interface Service {
  id: string;
  label: string;
  member_count: number;
  top_symbols: string[];
}

interface Connection {
  source: string;
  target: string;
  count: number;
}

interface ArchData {
  services: Service[];
  connections: Connection[];
}

// Layout positions for services (circular arrangement)
function getPositions(count: number, width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.35;
  const ry = height * 0.35;
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  });
}

const COLORS = [
  "#6366F1", "#EC4899", "#14B8A6", "#F59E0B",
  "#10B981", "#8B5CF6", "#06B6D4", "#EF4444",
];

export default function ArchitectureDiagramDemo() {
  const [data, setData] = useState<ArchData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/demos/architecture-express.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-80 text-text-tertiary text-sm">
        Loading architecture...
      </div>
    );
  }

  const W = 600;
  const H = 400;
  const positions = getPositions(data.services.length, W, H);
  const labelToPos = new Map(
    data.services.map((s, i) => [s.label, positions[i]])
  );

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: 420 }}>
        {/* Connection lines */}
        {data.connections.map((conn, i) => {
          const from = labelToPos.get(conn.source);
          const to = labelToPos.get(conn.target);
          if (!from || !to) return null;
          const isHighlighted =
            hovered === conn.source || hovered === conn.target;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? "#6366F1" : "#3F3F46"}
              strokeWidth={Math.min(conn.count / 3, 3)}
              opacity={isHighlighted ? 0.8 : 0.25}
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })}

        {/* Service nodes */}
        {data.services.map((service, i) => {
          const pos = positions[i];
          const radius = 18 + Math.sqrt(service.member_count) * 2;
          const isHovered = hovered === service.label;
          const color = COLORS[i % COLORS.length];

          return (
            <g
              key={service.id}
              onMouseEnter={() => setHovered(service.label)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Glow */}
              {isHovered && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius + 6}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.4"
                />
              )}
              {/* Node */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={color}
                opacity={isHovered ? 0.9 : 0.6}
                style={{ transition: "opacity 0.2s ease" }}
              />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y - radius - 8}
                textAnchor="middle"
                fill="#FAFAFA"
                fontSize="11"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {service.label}
              </text>
              {/* Count */}
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                opacity="0.8"
              >
                {service.member_count}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-xs font-mono">
          <span className="text-accent">{hovered}</span>
          <span className="text-text-tertiary ml-2">
            {data.connections
              .filter((c) => c.source === hovered || c.target === hovered)
              .length}{" "}
            connections
          </span>
        </div>
      )}
    </div>
  );
}
