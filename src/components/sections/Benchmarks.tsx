"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

// No figures in this section, on purpose. The token and call reductions and the
// per-repository counts that stood here came from benchmarks/run.sh in
// marcmantei/myceliums. A recalculation (Oct 2026) found the arithmetic correct,
// but 21 of the 34 values (django, express, gin, tokio) could not be reproduced
// with that script, and a spot check showed the ratio measures how much text a
// command prints, not whether it answers the question. So: no number until it
// is measured with an agent.

export default function Benchmarks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(sectionRef.current.querySelectorAll("[data-animate]"), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="benchmarks" className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12" data-animate>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Benchmarks</h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            How much does it save an AI agent?
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            One query instead of a grep-and-read loop.
          </h3>
        </div>

        {/* What we can say without a number */}
        <div className="max-w-4xl" data-animate>
          <GlassCard className="p-6 lg:p-8">
            <p className="text-text-secondary leading-relaxed">
              For structural questions such as &ldquo;who calls this?&rdquo; or
              &ldquo;what does this call?&rdquo;, Myceliums returns symbol names
              and their relationships from a single query instead of raw file
              contents. How much that saves an AI agent depends on the question
              and the codebase. We have not measured it with an agent yet, so we
              do not put a number on it.
            </p>
          </GlassCard>
        </div>

        {/* Withdrawn figures */}
        <p className="text-xs text-text-tertiary mt-8 max-w-3xl" data-animate>
          Earlier versions of this page showed token and tool-call reduction
          percentages and per-repository counts. We have withdrawn them: most of
          the underlying values could not be reproduced with the benchmark
          script, and that script only compares output size. No agent is
          involved, and nothing checks whether an output answers the question.
        </p>
      </div>
    </section>
  );
}
