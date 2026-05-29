"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";

const KIND_COLORS: Record<string, string> = {
  Function: "#6366F1",
  Variable: "#10B981",
  Constant: "#F59E0B",
  Class: "#EC4899",
  Method: "#8B5CF6",
  Interface: "#06B6D4",
  Module: "#14B8A6",
  Import: "#64748B",
};

interface GraphNode {
  id: string;
  name: string;
  kind: string;
  file_path: string;
}

interface GraphEdge {
  source: string;
  target: string;
  kind: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface SankeyNode {
  id: string;
  label: string;
  value: number;
  color: string;
  x: number;
  y: number;
  height: number;
  column: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  sourceY: number;
  targetY: number;
  thickness: number;
  color: string;
}

interface HoverInfo {
  text: string;
  detail: string;
  x: number;
  y: number;
}

function buildSankey(data: GraphData, width: number, height: number) {
  const padding = { top: 20, bottom: 20, left: 10, right: 10 };
  const nodeWidth = 14;
  const nodePadding = 4;

  const dirCounts = new Map<string, Map<string, number>>();
  for (const n of data.nodes) {
    const dir = n.file_path.split("/").slice(0, -1).join("/") || "/";
    if (!dirCounts.has(dir)) dirCounts.set(dir, new Map());
    const kinds = dirCounts.get(dir)!;
    kinds.set(n.kind, (kinds.get(n.kind) || 0) + 1);
  }

  const dirTotals = Array.from(dirCounts.entries())
    .map(([dir, kinds]) => ({
      dir,
      total: Array.from(kinds.values()).reduce((a, b) => a + b, 0),
      kinds,
    }))
    .sort((a, b) => b.total - a.total);

  const maxDirs = 10;
  const topDirs = dirTotals.slice(0, maxDirs);
  const otherDirs = dirTotals.slice(maxDirs);

  if (otherDirs.length > 0) {
    const otherKinds = new Map<string, number>();
    for (const d of otherDirs) {
      for (const [k, v] of d.kinds) {
        otherKinds.set(k, (otherKinds.get(k) || 0) + v);
      }
    }
    topDirs.push({
      dir: `+${otherDirs.length} more`,
      total: otherDirs.reduce((a, b) => a + b.total, 0),
      kinds: otherKinds,
    });
  }

  const kindTotals = new Map<string, number>();
  for (const n of data.nodes) {
    kindTotals.set(n.kind, (kindTotals.get(n.kind) || 0) + 1);
  }
  const sortedKinds = Array.from(kindTotals.entries()).sort((a, b) => b[1] - a[1]);

  const usableHeight = height - padding.top - padding.bottom;
  const totalSymbols = data.nodes.length;

  const leftNodes: SankeyNode[] = [];
  let leftY = padding.top;
  const leftScale = (usableHeight - (topDirs.length - 1) * nodePadding) / totalSymbols;
  for (const d of topDirs) {
    const h = Math.max(d.total * leftScale, 3);
    leftNodes.push({
      id: `dir:${d.dir}`,
      label: d.dir === "/" ? "(root)" : d.dir,
      value: d.total,
      color: "#3B82F6",
      x: padding.left,
      y: leftY,
      height: h,
      column: 0,
    });
    leftY += h + nodePadding;
  }

  const rightNodes: SankeyNode[] = [];
  let rightY = padding.top;
  const rightScale = (usableHeight - (sortedKinds.length - 1) * nodePadding) / totalSymbols;
  for (const [kind, count] of sortedKinds) {
    const h = Math.max(count * rightScale, 3);
    rightNodes.push({
      id: `kind:${kind}`,
      label: kind,
      value: count,
      color: KIND_COLORS[kind] || "#6366F1",
      x: width - padding.right - nodeWidth,
      y: rightY,
      height: h,
      column: 1,
    });
    rightY += h + nodePadding;
  }

  const links: SankeyLink[] = [];
  const sourceOffsets = new Map<string, number>();
  const targetOffsets = new Map<string, number>();
  for (const node of [...leftNodes, ...rightNodes]) {
    sourceOffsets.set(node.id, 0);
    targetOffsets.set(node.id, 0);
  }

  for (const d of topDirs) {
    const sourceId = `dir:${d.dir}`;
    const sourceNode = leftNodes.find((n) => n.id === sourceId)!;

    for (const [kind, count] of d.kinds) {
      const targetId = `kind:${kind}`;
      const targetNode = rightNodes.find((n) => n.id === targetId);
      if (!targetNode) continue;

      const sOff = sourceOffsets.get(sourceId) || 0;
      const tOff = targetOffsets.get(targetId) || 0;
      const thickness = Math.max((count / totalSymbols) * usableHeight, 1);

      links.push({
        source: sourceId,
        target: targetId,
        value: count,
        sourceY: sourceNode.y + sOff,
        targetY: targetNode.y + tOff,
        thickness,
        color: KIND_COLORS[kind] || "#6366F1",
      });

      sourceOffsets.set(sourceId, sOff + thickness);
      targetOffsets.set(targetId, tOff + thickness);
    }
  }

  return { nodes: [...leftNodes, ...rightNodes], links };
}

function getLinkPath(link: SankeyLink, x0: number, x1: number) {
  const sy = link.sourceY + link.thickness / 2;
  const ty = link.targetY + link.thickness / 2;
  const cx = (x0 + x1) / 2;
  return `M ${x0},${sy} C ${cx},${sy} ${cx},${ty} ${x1},${ty}`;
}

// Animated particles along Sankey flows
function SankeyParticles({ links, nodes, nodeWidth }: { links: SankeyLink[]; nodes: SankeyNode[]; nodeWidth: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ linkIdx: number; t: number; speed: number }[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Initialize particles — one per large-enough link
    const particles: { linkIdx: number; t: number; speed: number }[] = [];
    for (let i = 0; i < links.length; i++) {
      if (links[i].thickness < 2) continue;
      const count = Math.max(1, Math.floor(links[i].thickness / 8));
      for (let j = 0; j < count; j++) {
        particles.push({ linkIdx: i, t: Math.random(), speed: 0.002 + Math.random() * 0.003 });
      }
    }
    particlesRef.current = particles;
  }, [links]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const link = links[p.linkIdx];
        if (!link) continue;

        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (!sourceNode || !targetNode) continue;

        const x0 = sourceNode.x + nodeWidth;
        const x1 = targetNode.x;
        const sy = link.sourceY + link.thickness / 2;
        const ty = link.targetY + link.thickness / 2;
        const cx = (x0 + x1) / 2;

        // Cubic Bézier point at t
        const t = p.t;
        const omt = 1 - t;
        // Approximate cubic as two control points at cx
        const px = omt * omt * omt * x0 + 3 * omt * omt * t * cx + 3 * omt * t * t * cx + t * t * t * x1;
        const py = omt * omt * omt * sy + 3 * omt * omt * t * sy + 3 * omt * t * t * ty + t * t * t * ty;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = link.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [links, nodes, nodeWidth]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasRef.current?.parentElement?.clientWidth ?? 800}
      height={canvasRef.current?.parentElement?.clientHeight ?? 450}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

export default function SankeyGraph({ data, className = "" }: { data: GraphData; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [dims, setDims] = useState({ width: 800, height: 450 });

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setDims({ width, height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const nodeWidth = 14;
  const { nodes, links } = useMemo(() => buildSankey(data, dims.width, dims.height), [data, dims]);

  const handleNodeEnter = useCallback((node: SankeyNode, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHighlightId(node.id);
    const label = node.column === 0 ? `Directory: ${node.label}` : `Symbol kind: ${node.label}`;
    setHover({
      text: label,
      detail: `${node.value.toLocaleString()} symbols`,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHighlightId(null);
    setHover(null);
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <svg width={dims.width} height={dims.height} className="w-full h-full" style={{ position: "relative", zIndex: 2 }}>
        {/* Links */}
        <g>
          {links.map((link, i) => {
            const sourceNode = nodes.find((n) => n.id === link.source)!;
            const targetNode = nodes.find((n) => n.id === link.target)!;
            const d = getLinkPath(link, sourceNode.x + nodeWidth, targetNode.x);

            const isHighlighted = highlightId === null || link.source === highlightId || link.target === highlightId;
            const opacity = highlightId === null ? 0.25 : isHighlighted ? 0.5 : 0.04;

            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={link.color}
                strokeWidth={link.thickness}
                opacity={opacity}
                style={{ transition: "opacity 0.2s" }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const isHighlighted = highlightId === null || highlightId === node.id;
            const nodeOpacity = highlightId === null ? 0.8 : isHighlighted ? 1 : 0.2;
            const textOpacity = highlightId === null ? 0.7 : isHighlighted ? 0.9 : 0.2;

            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={node.height}
                  fill={node.color}
                  rx={2}
                  opacity={nodeOpacity}
                  onMouseEnter={(e) => handleNodeEnter(node, e)}
                  onMouseLeave={handleNodeLeave}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                />
                {node.height > 8 && (
                  <text
                    x={node.column === 0 ? node.x + nodeWidth + 6 : node.x - 6}
                    y={node.y + node.height / 2}
                    dy="0.35em"
                    textAnchor={node.column === 0 ? "start" : "end"}
                    fill={`rgba(255,255,255,${textOpacity})`}
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    style={{ transition: "fill 0.2s" }}
                  >
                    {node.label.length > 25 ? node.label.slice(0, 22) + "..." : node.label}
                  </text>
                )}
                {node.height > 14 && (
                  <text
                    x={node.column === 0 ? node.x + nodeWidth + 6 : node.x - 6}
                    y={node.y + node.height / 2 + 12}
                    dy="0.35em"
                    textAnchor={node.column === 0 ? "start" : "end"}
                    fill={`rgba(255,255,255,${textOpacity * 0.5})`}
                    fontSize={9}
                    fontFamily="var(--font-mono)"
                    style={{ transition: "fill 0.2s" }}
                  >
                    {node.value.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Column headers */}
        <text x={nodes[0]?.x ?? 10} y={12} fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily="var(--font-mono)">
          Directories
        </text>
        <text
          x={(nodes.find((n) => n.column === 1)?.x ?? dims.width - 20) + nodeWidth}
          y={12}
          textAnchor="end"
          fill="rgba(255,255,255,0.4)"
          fontSize={10}
          fontFamily="var(--font-mono)"
        >
          Symbol Types
        </text>
      </svg>

      {/* Animated particles */}
      <SankeyParticles links={links} nodes={nodes} nodeWidth={nodeWidth} />

      {/* Tooltip */}
      {hover && (
        <div
          className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg text-xs"
          style={{
            left: Math.min(hover.x + 12, dims.width - 200),
            top: hover.y - 10,
            backgroundColor: "rgba(9,9,11,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="font-semibold text-foreground">{hover.text}</div>
          <div className="text-text-secondary mt-0.5">{hover.detail}</div>
        </div>
      )}
    </div>
  );
}
