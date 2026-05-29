"use client";

import { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

export interface GraphNodeDatum extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  size: number;
  color: string;
  kind: "cluster" | "symbol";
  symbolCount: number;
}

export interface GraphEdgeDatum extends d3.SimulationLinkDatum<GraphNodeDatum> {
  weight: number;
}

interface ForceGraphProps {
  nodes: GraphNodeDatum[];
  edges: GraphEdgeDatum[];
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string | null;
  highlightScores?: Map<string, number>;
}

export default function ForceGraph({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
  highlightScores,
}: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNodeDatum, GraphEdgeDatum> | null>(null);

  const renderGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    // Create container group for zoom/pan
    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoom as any);

    // Center initial view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(width / 2, height / 2));

    // Clone data for simulation
    const simNodes: GraphNodeDatum[] = nodes.map((n) => ({ ...n }));
    const simEdges: GraphEdgeDatum[] = edges
      .filter((e) => {
        const sourceId = typeof e.source === "string" ? e.source : (e.source as GraphNodeDatum).id;
        const targetId = typeof e.target === "string" ? e.target : (e.target as GraphNodeDatum).id;
        return simNodes.some((n) => n.id === sourceId) && simNodes.some((n) => n.id === targetId);
      })
      .map((e) => ({ ...e }));

    // Force simulation
    const simulation = d3
      .forceSimulation<GraphNodeDatum>(simNodes)
      .force(
        "link",
        d3
          .forceLink<GraphNodeDatum, GraphEdgeDatum>(simEdges)
          .id((d) => d.id)
          .distance((d) => 100 / (d.weight + 0.1))
          .strength((d) => d.weight * 0.3)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide<GraphNodeDatum>().radius((d) => d.size + 5)
      )
      .force("x", d3.forceX<GraphNodeDatum>((d) => d.x ?? 0).strength(0.1))
      .force("y", d3.forceY<GraphNodeDatum>((d) => d.y ?? 0).strength(0.1));

    simulationRef.current = simulation;

    // Edges
    const link = g
      .append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(simEdges)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", (d) => Math.min(0.8, d.weight))
      .attr("stroke-width", (d) => Math.max(0.5, d.weight * 2));

    // Nodes
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, GraphNodeDatum>("g")
      .data(simNodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, GraphNodeDatum>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Determine if search highlighting is active
    const hasHighlights = highlightScores && highlightScores.size > 0;

    // Get highlight score for a node (direct match or cluster match)
    const getHighlightScore = (d: GraphNodeDatum): number => {
      if (!hasHighlights || !highlightScores) return 1;
      const direct = highlightScores.get(d.id);
      if (direct !== undefined) return direct;
      return 0;
    };

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", (d) => {
        if (!hasHighlights) return 0.8;
        const score = getHighlightScore(d);
        return score > 0 ? 0.9 : 0.1;
      })
      .attr("stroke", (d) => {
        if (d.id === selectedNodeId) return "#fff";
        if (hasHighlights && getHighlightScore(d) > 0) return "#fbbf24";
        return d.color;
      })
      .attr("stroke-width", (d) => {
        if (d.id === selectedNodeId) return 3;
        if (hasHighlights && getHighlightScore(d) > 0) return 2.5;
        return 1.5;
      })
      .attr("stroke-opacity", (d) => {
        if (!hasHighlights) return 0.6;
        return getHighlightScore(d) > 0 ? 1 : 0.2;
      });

    // Glow effect for highlighted or cluster nodes
    node
      .filter((d) => {
        if (hasHighlights) return getHighlightScore(d) > 0;
        return d.kind === "cluster";
      })
      .select("circle")
      .attr("filter", "url(#glow)");

    // Labels
    node
      .append("text")
      .text((d) => {
        const maxLen = d.kind === "cluster" ? 20 : 15;
        return d.label.length > maxLen
          ? d.label.slice(0, maxLen) + "…"
          : d.label;
      })
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.size + 14)
      .attr("fill", (d) => {
        if (!hasHighlights) return "#94a3b8";
        return getHighlightScore(d) > 0 ? "#e2e8f0" : "#334155";
      })
      .attr("font-size", (d) => (d.kind === "cluster" ? 11 : 10))
      .attr("font-family", "monospace")
      .attr("pointer-events", "none");

    // Count badge for clusters
    node
      .filter((d) => d.kind === "cluster")
      .append("text")
      .text((d) => `${d.symbolCount}`)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#fff")
      .attr("font-size", 10)
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none");

    // Click handler
    node.on("click", (_event, d) => {
      onNodeClick?.(d.id);
    });

    // Tooltip
    node
      .append("title")
      .text(
        (d) =>
          `${d.label}${d.kind === "cluster" ? ` (${d.symbolCount} symbols)` : ""}`
      );

    // SVG filter for glow
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNodeDatum).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNodeDatum).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNodeDatum).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNodeDatum).y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, onNodeClick, selectedNodeId, highlightScores]);

  useEffect(() => {
    const cleanup = renderGraph();
    return () => cleanup?.();
  }, [renderGraph]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (simulationRef.current) {
        simulationRef.current.alpha(0.3).restart();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="h-full w-full bg-slate-950"
      style={{ minHeight: "400px" }}
    />
  );
}
