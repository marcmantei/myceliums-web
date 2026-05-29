"use client";

import { useMemo } from "react";

const COLORS = [
  "var(--accent)",   // Indigo
  "var(--success)",  // Emerald
  "var(--warning)",  // Amber
];

interface Blob {
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

export default function AmbientBlobs({ seed }: { seed: number }) {
  const blobs = useMemo(() => {
    const rng = seededRandom(seed);
    const count = 1 + Math.floor(rng() * 3); // 1-3 blobs
    const result: Blob[] = [];

    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(rng() * COLORS.length)];
      const size = 250 + Math.floor(rng() * 450); // 250-700px
      const top = `${Math.floor(rng() * 80)}%`;
      const left = rng() < 0.5
        ? `${-10 + Math.floor(rng() * 30)}%`  // left side
        : `${70 + Math.floor(rng() * 30)}%`;   // right side
      const opacity = 0.04 + rng() * 0.04; // 0.04-0.08

      result.push({ color, size, top, left, opacity });
    }

    return result;
  }, [seed]);

  return (
    <>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none -z-10"
          style={{
            background: blob.color,
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            opacity: blob.opacity,
            filter: "blur(120px)",
          }}
        />
      ))}
    </>
  );
}
