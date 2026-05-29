"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

// ─── Types ──────────────────────────────────────────────────────────

interface ServiceNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: number;
  memberCount: number;
  importance: number;
  width?: number;
  height?: number;
}

interface ServiceEdge extends d3.SimulationLinkDatum<ServiceNode> {
  weight: number;
}

interface ArchDataset {
  label: string;
  description: string;
  groupLabels: string[];
  nodes: ServiceNode[];
  edges: ServiceEdge[];
}

// ─── Colors ─────────────────────────────────────────────────────────

const GROUP_COLORS = [
  "#6366F1", // indigo
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#8B5CF6", // violet
  "#EF4444", // red
  "#14B8A6", // teal
  "#A78BFA", // light violet
  "#F97316", // orange
];

// ─── Datasets ───────────────────────────────────────────────────────

function buildDatasetFromArchJson(
  archData: { services: Array<{ id: string; label: string; member_count: number; top_symbols: string[] }>; connections: Array<{ source: string; target: string; count: number }> },
  label: string,
  description: string,
): ArchDataset {
  const labelToGroup = new Map<string, number>();
  const nodes: ServiceNode[] = archData.services.map((s, i) => {
    labelToGroup.set(s.label, i);
    return {
      id: s.id,
      label: s.label,
      group: i % GROUP_COLORS.length,
      memberCount: s.member_count,
      importance: s.member_count / Math.max(...archData.services.map((x) => x.member_count)),
    };
  });

  const edges: ServiceEdge[] = archData.connections.map((c) => ({
    source: archData.services.find((s) => s.label === c.source)?.id || c.source,
    target: archData.services.find((s) => s.label === c.target)?.id || c.target,
    weight: c.count,
  }));

  return {
    label,
    description,
    groupLabels: archData.services.map((s) => s.label),
    nodes,
    edges,
  };
}

const REPOS = [
  { id: "express", label: "Express", desc: "Node.js framework" },
  { id: "zod", label: "Zod", desc: "TypeScript validation" },
  { id: "fastapi", label: "FastAPI", desc: "Python async API" },
];

// ─── Component ──────────────────────────────────────────────────────

export default function ArchitectureGraphDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<d3.Simulation<ServiceNode, ServiceEdge> | null>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const hoveredRef = useRef<ServiceNode | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dataRef = useRef<{ nodes: ServiceNode[]; edges: ServiceEdge[] }>({ nodes: [], edges: [] });
  const animFrameRef = useRef<number>(0);

  const [activeRepo, setActiveRepo] = useState("express");
  const [dataset, setDataset] = useState<ArchDataset | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ServiceNode | null>(null);

  // Load data
  useEffect(() => {
    fetch(`/demos/architecture-${activeRepo}.json`)
      .then((r) => r.json())
      .then((data) => {
        const repo = REPOS.find((r) => r.id === activeRepo)!;
        const ds = buildDatasetFromArchJson(data, repo.label, repo.desc);
        setDataset(ds);
      })
      .catch(() => {});
  }, [activeRepo]);

  // D3 simulation + rendering
  useEffect(() => {
    if (!dataset || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d")!;

    // Resize
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    const w = rect.width;
    const h = rect.height;

    // Deep clone nodes/edges for D3 mutation
    const nodes: ServiceNode[] = dataset.nodes.map((n) => ({ ...n }));
    const edges: ServiceEdge[] = dataset.edges.map((e) => ({ ...e }));
    dataRef.current = { nodes, edges };

    // Pre-measure box widths
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    for (const n of nodes) {
      n.width = Math.max(110, ctx.measureText(n.label).width + 36);
      n.height = 48;
    }

    // Force simulation — structured layout
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const sim = d3
      .forceSimulation<ServiceNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<ServiceNode, ServiceEdge>(edges)
          .id((d) => d.id)
          .distance(120)
          .strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force(
        "collision",
        d3
          .forceCollide<ServiceNode>()
          .radius((d) => Math.max(d.width ?? 110, d.height ?? 48) / 2 + 20)
          .iterations(3)
      )
      .force(
        "x",
        d3
          .forceX<ServiceNode>()
          .x((_, i) => {
            const col = i % cols;
            return (col + 0.5) * (w / cols);
          })
          .strength(0.08)
      )
      .force(
        "y",
        d3
          .forceY<ServiceNode>()
          .y((_, i) => {
            const row = Math.floor(i / cols);
            return (row + 0.5) * (h / Math.ceil(nodes.length / cols));
          })
          .strength(0.08)
      )
      .alphaDecay(0.012)
      .velocityDecay(0.45);

    simulationRef.current = sim;

    // Zoom
    const zoomBehavior = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
      });
    d3.select(canvas).call(zoomBehavior);
    d3.select(canvas).call(
      zoomBehavior.transform,
      d3.zoomIdentity.translate(0, 0).scale(1)
    );

    // ─── Render loop ────────────────────────────────────
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const t = transformRef.current;
      const zk = t.k;
      const nodeScale = 1 / Math.pow(zk, 0.6);
      const textScale = 1 / Math.pow(zk, 0.35);
      const hovered = hoveredRef.current;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.translate(t.x, t.y);
      ctx.scale(t.k, t.k);

      // ── Edges ──
      for (const link of edges) {
        const source = link.source as ServiceNode;
        const target = link.target as ServiceNode;
        if (source.x == null || target.x == null || source.y == null || target.y == null) continue;

        const isHighlighted =
          hovered && (hovered.id === source.id || hovered.id === target.id);
        const weight = link.weight || 1;
        const strength = Math.min(weight / 15, 1);

        // Curved edge
        const mx = (source.x + target.x) / 2;
        const dx = Math.abs(source.x - target.x);
        const dy = Math.abs(source.y - target.y);
        const curvature = Math.min(dx, dy) * 0.15;
        const my = (source.y + target.y) / 2 - curvature;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.quadraticCurveTo(mx, my, target.x, target.y);

        ctx.strokeStyle = isHighlighted
          ? `rgba(99, 102, 241, ${0.5 + strength * 0.4})`
          : `rgba(113, 113, 122, ${0.15 + strength * 0.15})`;
        ctx.lineWidth = (1.5 + strength * 2.5) * nodeScale;
        ctx.lineCap = "round";
        ctx.stroke();

        // Arrow
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrowLen = (6 + strength * 3) * nodeScale;
        const arrowX = target.x - ((target.width ?? 110) / 2 + 4) * Math.cos(angle);
        const arrowY = target.y - ((target.height ?? 48) / 2 + 4) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLen * Math.cos(angle - 0.4),
          arrowY - arrowLen * Math.sin(angle - 0.4)
        );
        ctx.lineTo(
          arrowX - arrowLen * Math.cos(angle + 0.4),
          arrowY - arrowLen * Math.sin(angle + 0.4)
        );
        ctx.closePath();
        ctx.fillStyle = isHighlighted
          ? "rgba(99, 102, 241, 0.6)"
          : `rgba(113, 113, 122, ${0.2 + strength * 0.2})`;
        ctx.fill();

        // Weight label on highlighted edges
        if (isHighlighted && zk > 0.5) {
          const lx = mx;
          const ly = my - 6 * nodeScale;
          ctx.fillStyle = "rgba(99, 102, 241, 0.9)";
          ctx.font = `${Math.round(9 * textScale)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(`${weight}`, lx, ly);
        }
      }

      // ── Nodes (service boxes) ──
      for (const node of nodes) {
        if (node.x == null || node.y == null) continue;
        const boxW = (node.width ?? 110) * nodeScale;
        const boxH = (node.height ?? 48) * nodeScale;
        const isHovered = hovered?.id === node.id;
        const color = GROUP_COLORS[node.group % GROUP_COLORS.length];

        // Glow
        if (isHovered) {
          ctx.shadowColor = color + "50";
          ctx.shadowBlur = 24 * nodeScale;
        }

        // Box
        ctx.beginPath();
        ctx.roundRect(node.x - boxW / 2, node.y - boxH / 2, boxW, boxH, 8 * nodeScale);
        ctx.fillStyle = isHovered ? color + "DD" : color + "99";
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = isHovered ? color : color + "60";
        ctx.lineWidth = isHovered ? 2 * nodeScale : 1.2 * nodeScale;
        ctx.stroke();

        // Label
        if (zk > 0.35) {
          ctx.fillStyle = "#FAFAFA";
          ctx.font = `bold ${Math.round(11 * textScale)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label, node.x, node.y - 6 * nodeScale);

          // Member count
          ctx.fillStyle = "#FAFAFA99";
          ctx.font = `${Math.round(9 * textScale)}px 'JetBrains Mono', monospace`;
          ctx.fillText(`${node.memberCount} symbols`, node.x, node.y + 10 * nodeScale);
        }
      }

      ctx.restore();

      // ── Tooltip (screen space) ──
      if (hovered && hovered.x != null && hovered.y != null) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const color = GROUP_COLORS[hovered.group % GROUP_COLORS.length];

        const connCount = edges.filter((e) => {
          const s = (e.source as ServiceNode).id;
          const t = (e.target as ServiceNode).id;
          return s === hovered.id || t === hovered.id;
        }).length;

        const lines = [
          hovered.label,
          `${hovered.memberCount} symbols`,
          `${connCount} connections`,
          `importance: ${(hovered.importance * 100).toFixed(0)}%`,
        ];

        ctx.font = "bold 12px 'JetBrains Mono', monospace";
        const titleW = ctx.measureText(lines[0]).width;
        ctx.font = "11px 'JetBrains Mono', monospace";
        const maxW = Math.max(titleW, ...lines.slice(1).map((l) => ctx.measureText(l).width));
        const tooltipW = maxW + 32;
        const tooltipH = 16 + lines.length * 18 + 8;

        let tx = mx + 16;
        let ty = my - tooltipH / 2;
        if (tx + tooltipW > w) tx = mx - tooltipW - 16;
        if (ty < 4) ty = 4;
        if (ty + tooltipH > h) ty = h - tooltipH - 4;

        // Background
        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 8);
        ctx.fillStyle = "rgba(10, 10, 12, 0.95)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Accent bar
        ctx.beginPath();
        ctx.roundRect(tx, ty, 3, tooltipH, [8, 0, 0, 8]);
        ctx.fillStyle = color;
        ctx.fill();

        // Text
        ctx.textAlign = "left";
        ctx.fillStyle = "#FAFAFA";
        ctx.font = "bold 12px 'JetBrains Mono', monospace";
        ctx.fillText(lines[0], tx + 14, ty + 18);

        ctx.fillStyle = "#A1A1AA";
        ctx.font = "11px 'JetBrains Mono', monospace";
        lines.slice(1).forEach((line, i) => {
          ctx.fillText(line, tx + 14, ty + 36 + i * 18);
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    sim.on("tick", () => {});
    animFrameRef.current = requestAnimationFrame(render);

    // ── Mouse interactions ──
    let dragNode: ServiceNode | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      const gx = t.invertX(event.clientX - rect.left);
      const gy = t.invertY(event.clientY - rect.top);
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };

      if (dragNode) return;

      let closest: ServiceNode | null = null;
      for (const n of nodes) {
        if (n.x == null || n.y == null) continue;
        const bw = (n.width ?? 110) / 2;
        const bh = (n.height ?? 48) / 2;
        if (gx >= n.x - bw && gx <= n.x + bw && gy >= n.y - bh && gy <= n.y + bh) {
          closest = n;
          break;
        }
      }
      hoveredRef.current = closest;
      setHoveredNode(closest);
      canvas.style.cursor = closest ? "pointer" : "grab";
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      const gx = t.invertX(event.clientX - rect.left);
      const gy = t.invertY(event.clientY - rect.top);

      for (const n of nodes) {
        if (n.x == null || n.y == null) continue;
        const bw = (n.width ?? 110) / 2;
        const bh = (n.height ?? 48) / 2;
        if (gx >= n.x - bw && gx <= n.x + bw && gy >= n.y - bh && gy <= n.y + bh) {
          dragNode = n;
          n.fx = n.x;
          n.fy = n.y;
          sim.alphaTarget(0.3).restart();
          canvas.setPointerCapture(event.pointerId);
          event.stopPropagation();
          return;
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragNode) return;
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      dragNode.fx = t.invertX(event.clientX - rect.left);
      dragNode.fy = t.invertY(event.clientY - rect.top);
    };

    const handlePointerUp = () => {
      if (dragNode) {
        dragNode.fx = null;
        dragNode.fy = null;
        dragNode = null;
        sim.alphaTarget(0);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      sim.stop();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dataset]);

  return (
    <div className="space-y-4">
      {/* Repo selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-tertiary font-mono mr-1">Repository:</span>
        {REPOS.map((repo) => (
          <button
            key={repo.id}
            onClick={() => setActiveRepo(repo.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeRepo === repo.id
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-text-tertiary hover:text-text-secondary border border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            {repo.label}
            <span className="text-text-tertiary ml-1 hidden sm:inline">{repo.desc}</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="rounded-xl bg-[#0a0a0c] border border-white/[0.06] overflow-hidden relative"
        style={{ height: 420 }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Instructions overlay */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-text-tertiary/50 pointer-events-none">
          drag to move nodes &middot; scroll to zoom &middot; hover for details
        </div>
      </div>

      {/* Stats */}
      {dataset && (
        <div className="flex gap-6 text-[11px] font-mono text-text-tertiary">
          <span>
            <span className="text-accent">{dataset.nodes.length}</span> services
          </span>
          <span>
            <span className="text-accent">{dataset.edges.length}</span> connections
          </span>
          <span>
            <span className="text-accent">
              {dataset.nodes.reduce((s, n) => s + n.memberCount, 0)}
            </span>{" "}
            total symbols
          </span>
        </div>
      )}
    </div>
  );
}
