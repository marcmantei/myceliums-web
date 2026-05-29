"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AsciinemaPlayer from "./AsciinemaPlayer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

interface Demo {
  id: string;
  title: string;
  description: string;
  src: string;
}

const demos: Demo[] = [
  {
    id: "index",
    title: "Indexing a Project",
    description: "Analyze your codebase with myc analyze",
    src: "/demos/index-workflow.cast",
  },
  {
    id: "query",
    title: "Querying the Graph",
    description: "Run Cypher queries on your knowledge graph",
    src: "/demos/query-demo.cast",
  },
];

export default function TerminalDemo() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer to start animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  const demo = demos[currentDemo];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6" ref={containerRef}>
        <motion.h2
          {...fadeUp}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          See it in action
        </motion.h2>
        <motion.p
          {...fadeUp}
          className="text-text-secondary text-center max-w-xl mx-auto mb-12"
        >
          From analysis to query in seconds.
        </motion.p>

        {started && (
          <motion.div {...fadeUp}>
            <AsciinemaPlayer
              src={demo.src}
              autoPlay={true}
              speed={1}
              loop={false}
              preload={true}
            />

            {/* Demo selector */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {demo.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {demo.description}
                </p>
              </div>
              <div className="flex gap-2">
                {demos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentDemo(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentDemo ? "bg-accent" : "bg-border hover:bg-border/80"
                    }`}
                    aria-label={`Demo ${i + 1}`}
                    aria-current={i === currentDemo ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
