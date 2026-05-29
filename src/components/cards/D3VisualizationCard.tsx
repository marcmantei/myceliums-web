"use client";

import { useEffect, useRef } from "react";

interface SimNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  tx: number;
  ty: number;
}

export default function D3VisualizationCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes: SimNode[] = [];
    const edges: [number, number][] = [];

    // Create 8 nodes
    for (let i = 0; i < 8; i++) {
      nodes.push({
        x: 50 + (Math.random() - 0.5) * 60,
        y: 40 + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        color: ["#6366F1", "#10B981", "#F59E0B"][i % 3],
        tx: 30 + (i % 4) * 20 + (Math.random() - 0.5) * 10,
        ty: 25 + Math.floor(i / 4) * 30 + (Math.random() - 0.5) * 10,
      });
    }

    // Create edges
    for (let i = 0; i < 7; i++) {
      edges.push([i, (i + 1) % 8]);
    }
    edges.push([0, 4], [2, 6]);

    let animFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, 120, 80);

      // Simple force simulation
      for (const node of nodes) {
        node.vx += (node.tx - node.x) * 0.02;
        node.vy += (node.ty - node.y) * 0.02;
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;

        // Gentle bounce
        node.ty += Math.sin(Date.now() * 0.001 + nodes.indexOf(node)) * 0.08;
      }

      // Draw edges
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 0.5;
      for (const [a, b] of edges) {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={120} height={80} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[8px] font-mono text-accent bg-accent/10 rounded">
        myc serve
      </div>
    </div>
  );
}
