"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPACT_FEATURES, ICON_MAP } from "@/data/features";
import type { IconName } from "@/data/features";
import GlassCard from "@/components/ui/glass-card";

gsap.registerPlugin(ScrollTrigger);

export default function CompactFeaturesList() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".compact-feature-card");
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: {
          amount: 0.6,
          from: "center",
        },
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">And more capabilities</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Plus 9 additional features that complete the knowledge graph experience.
          </p>
        </div>

        {/* Grid of Compact Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {COMPACT_FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.iconName as IconName];
            return (
              <GlassCard
                key={feature.title}
                className="compact-feature-card group"
              >
                <div className="p-5 lg:p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
