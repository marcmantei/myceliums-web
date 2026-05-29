"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

interface CliLine {
  type: "input" | "output" | "stats";
  content: string;
  delay?: number;
}

interface CliOutputProps {
  lines: CliLine[];
  animate?: boolean;
}

export default function CliOutput({
  lines,
  animate = false,
}: CliOutputProps) {
  const [displayedLines, setDisplayedLines] = useState<CliLine[]>(
    animate ? [] : lines
  );

  useEffect(() => {
    if (!animate) return;

    let currentIndex = 0;
    const timers: NodeJS.Timeout[] = [];

    const showNextLine = () => {
      if (currentIndex < lines.length) {
        const delay = lines[currentIndex].delay || 100;
        const timer = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, lines[currentIndex]]);
          currentIndex++;
          showNextLine();
        }, delay);
        timers.push(timer);
      }
    };

    showNextLine();

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [animate, lines]);

  return (
    <motion.div {...fadeUp}>
      <div className="bg-surface border border-border rounded-lg p-6 font-mono text-sm overflow-hidden">
        <div className="space-y-1 text-text-secondary">
          {displayedLines.map((line, idx) => (
            <div key={idx} className="flex gap-3 leading-relaxed">
              {line.type === "input" && (
                <>
                  <span className="text-accent-glow font-semibold shrink-0">
                    $
                  </span>
                  <span className="text-foreground">{line.content}</span>
                </>
              )}
              {line.type === "output" && (
                <span className="text-text-secondary">{line.content}</span>
              )}
              {line.type === "stats" && (
                <span className="text-foreground font-medium">
                  {line.content}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
