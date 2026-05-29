"use client";

import { useMemo } from "react";

const COLORS = [
  "var(--accent)",   // Indigo
  "var(--success)",  // Emerald
  "var(--warning)",  // Amber
];

interface BlobConfig {
  color: string;
  size: number;
  top: string;
  left: string;
  opacity: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function PageBlobs({ count = 12 }: { count?: number }) {
  const blobs = useMemo(() => {
    const rng = seededRandom(42);
    const result: BlobConfig[] = [];

    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(rng() * COLORS.length)];
      const size = 300 + Math.floor(rng() * 500);

      // Spread vertically
      const slot = (i / count) * 100;
      const jitter = (rng() - 0.5) * 8;
      const top = `${Math.max(0, Math.min(98, slot + jitter))}%`;

      // Alternate sides
      const side = rng();
      const left = side < 0.4
        ? `${-10 + Math.floor(rng() * 15)}%`
        : side < 0.8
          ? `${80 + Math.floor(rng() * 20)}%`
          : `${35 + Math.floor(rng() * 30)}%`;

      const opacity = 0.03 + rng() * 0.05;

      result.push({ color, size, top, left, opacity });
    }

    return result;
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            background: blob.color,
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            opacity: blob.opacity,
            filter: "blur(140px)",
          }}
        />
      ))}
    </div>
  );
}
