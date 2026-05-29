"use client";

import { useEffect, useRef, useCallback } from "react";

interface Dot {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
}

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];
const CENTERS = [
  { x: 25, y: 25 },
  { x: 70, y: 20 },
  { x: 50, y: 55 },
];

export default function CommunityDetectionCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const init = useCallback(() => {
    const dots: Dot[] = [];
    for (let i = 0; i < 24; i++) {
      const group = i % 3;
      dots.push({
        x: Math.random() * 100,
        y: Math.random() * 70,
        tx: CENTERS[group].x + (Math.random() - 0.5) * 20,
        ty: CENTERS[group].y + (Math.random() - 0.5) * 16,
        color: COLORS[group],
      });
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    init();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const animate = () => {
      frame++;
      const phase = Math.floor(frame / 120) % 2; // toggle every 2 seconds at 60fps
      phaseRef.current = phase;

      ctx.clearRect(0, 0, 200, 140);

      for (const dot of dotsRef.current) {
        if (phase === 1) {
          // Cluster
          dot.x += (dot.tx - dot.x) * 0.05;
          dot.y += (dot.ty - dot.y) * 0.05;
        } else {
          // Scatter
          const sx = 50 + (Math.random() - 0.5) * 80;
          const sy = 35 + (Math.random() - 0.5) * 50;
          dot.x += (sx - dot.x) * 0.01;
          dot.y += (sy - dot.y) * 0.01;
        }

        ctx.beginPath();
        ctx.arc(dot.x * 2, dot.y * 2, 4, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }

      // Draw convex hull hints when clustered
      if (phase === 1 && frame % 120 > 60) {
        ctx.globalAlpha = 0.06;
        for (let g = 0; g < 3; g++) {
          const groupDots = dotsRef.current.filter((_, i) => i % 3 === g);
          ctx.beginPath();
          ctx.arc(
            CENTERS[g].x * 2,
            CENTERS[g].y * 2,
            28,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = COLORS[g];
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={140}
      className="w-full h-full"
    />
  );
}
