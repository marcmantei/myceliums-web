"use client";

import { useMemo } from "react";

const COLORS = [
  "var(--accent)",   // Indigo
];

interface BlobConfig {
  color: string;
  size: number;
  top: string;
  left: string;
  opacity: number;
}

function seededRandom(seed: number) {
  let s = Math.abs(seed * 7 + 13) || 1;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function SectionBlobs({ seed }: { seed: number }) {
  const blobs = useMemo(() => {
    const rng = seededRandom(seed);
    const count = 1 + Math.floor(rng() * 3); // 1-3 blobs
    const result: BlobConfig[] = [];

    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(rng() * COLORS.length)];
      const size = 200 + Math.floor(rng() * 350); // 200-550px

      const top = `${5 + Math.floor(rng() * 80)}%`;

      // Position across full width, not just edges
      const r = rng();
      const left = r < 0.3
        ? `${-5 + Math.floor(rng() * 20)}%`
        : r < 0.6
          ? `${70 + Math.floor(rng() * 20)}%`
          : `${20 + Math.floor(rng() * 55)}%`;

      const opacity = 0.02 + rng() * 0.04; // 0.02-0.06

      result.push({ color, size, top, left, opacity });
    }

    return result;
  }, [seed]);

  return (
    <>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            background: blob.color,
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            opacity: blob.opacity,
            filter: "blur(120px)",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
