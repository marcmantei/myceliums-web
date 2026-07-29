"use client";

import { useRef, useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TerminalFrame from "@/components/ui/terminal-frame";

gsap.registerPlugin(ScrollTrigger);

const KnowledgeGraph3D = lazy(() => import("@/components/three/KnowledgeGraph3D"));

// Detect if we should show 3D (desktop with decent hardware)
function useCanShow3D() {
  const [can, setCan] = useState(false);
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    const hasGPU = (navigator.hardwareConcurrency || 2) >= 4;
    setCan(isDesktop && hasGPU);
  }, []);
  return can;
}

const CLI_LINES = [
  { type: "input" as const, text: "$ myc analyze ." },
  { type: "output" as const, text: "Parsing 5,247 files across 23 languages..." },
  { type: "output" as const, text: "Building knowledge graph..." },
  { type: "stats" as const, text: "Symbols:       41,952" },
  { type: "stats" as const, text: "Relationships: 45,028" },
  { type: "stats" as const, text: "Communities:   86" },
  { type: "stats" as const, text: "Processes:     214" },
  { type: "success" as const, text: "✓ Analyzed in 1.6s" },
];

function CliDemo() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    CLI_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 400 + i * 300));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <TerminalFrame title="myceliums" variant="success">
      <div className="space-y-1 min-h-[200px]">
        {CLI_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "input"
                ? "text-success"
                : line.type === "stats"
                  ? "text-foreground font-semibold"
                  : line.type === "success"
                    ? "text-success font-semibold"
                    : "text-text-secondary"
            }`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines < CLI_LINES.length && (
          <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
        )}
      </div>
    </TerminalFrame>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const canShow3D = useCanShow3D();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hero-word");
        tl.from(words, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
        });
      }

      tl.from(
        subRef.current,
        { y: 30, opacity: 0, duration: 0.6 },
        "-=0.3"
      );

      tl.from(
        ctaRef.current,
        { y: 20, opacity: 0, duration: 0.5 },
        "-=0.2"
      );

      tl.from(
        terminalRef.current,
        { y: 40, opacity: 0, duration: 0.7 },
        "-=0.3"
      );
    },
    { scope: sectionRef }
  );

  const ROTATING_WORDS = [
    "codebase",
    "architecture",
    "dependencies",
    "documentation",
    "emails",
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 hero-bg-image" />
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Mesh gradient blobs */}
      <div className="mesh-blob mesh-blob-accent absolute -top-40 -left-40" />
      <div className="mesh-blob mesh-blob-success absolute -bottom-20 -right-40" />

      {/* 3D graph background (desktop only) */}
      {canShow3D && (
        <div className="absolute inset-0 opacity-60">
          <Suspense fallback={null}>
            <KnowledgeGraph3D />
          </Suspense>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text with blurred backdrop */}
          <div className="relative">
            {/* Semi-transparent blurred backdrop */}
            <div className="absolute -inset-12 bg-black/25 backdrop-blur-2xl rounded-[2.5rem] -z-10 mask-fade" />
            <style jsx>{`
              .mask-fade {
                mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
                -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
              }
            `}</style>

            <span className="inline-block px-3 py-1 text-xs font-mono text-black font-semibold rounded-full mb-6 bg-accent">
              KNOWLEDGE LAYER FOR AI
            </span>
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="hero-word inline-block mr-[0.3em]">Your</span>
              <span className="hero-word inline-block mr-[0.3em]">AI</span>
              <span className="hero-word inline-block mr-[0.3em] text-accent">finally</span>
              <br />
              <span className="hero-word inline-block mr-[0.3em]">understands</span>
              <span className="hero-word inline-block mr-[0.3em]">your</span>
              <br />
              <span className="hero-word inline-block relative">
                <span
                  className="inline-block transition-all duration-400 text-accent"
                  style={{
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? "translateY(-20px)" : "translateY(0)",
                    filter: isAnimating ? "blur(4px)" : "blur(0)",
                  }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </span>
            </h1>

            <p
              ref={subRef}
              className="mt-6 text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed"
            >
              Myceliums parses your entire codebase, extracts every symbol
              and relationship, and embeds it into a semantic knowledge graph.
              Your AI agent gets the full picture: every dependency, every
              call chain, every connection. It never misses context again.
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#get-started"
                className="px-6 py-3 bg-accent hover:bg-accent-glow text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/40"
              >
                Get Started
              </a>
              <a
                href="https://github.com/marcmantei/myceliums"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl font-medium transition-all duration-200"
              >
                View on GitHub
              </a>
            </div>

            {/* Stats strip */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary font-mono">
              <span><strong className="text-white">54</strong> MCP Tools</span>
              <span className="text-white/20">&middot;</span>
              <span><strong className="text-white">23</strong> Languages</span>
              <span className="text-white/20">&middot;</span>
              <span><strong className="text-white">3</strong> Search Modes</span>
              <span className="text-white/20">&middot;</span>
              <span><strong className="text-white">0</strong> Cloud Dependencies</span>
            </div>

          </div>

          {/* Right: Terminal demo */}
          <div ref={terminalRef} className="lg:mt-0 mt-8">
            <CliDemo />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-text-secondary tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
