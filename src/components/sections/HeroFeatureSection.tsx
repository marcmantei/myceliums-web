"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HeroFeature, IconName } from "@/data/features";
import { ICON_MAP } from "@/data/features";
import BeforeAfterDemo from "@/components/shared/BeforeAfterDemo";
import MetricsCard from "@/components/shared/MetricsCard";
import SectionBlobs from "@/components/ui/section-blobs";

import KnowledgeGraphCard from "@/components/cards/KnowledgeGraphCard";
import ImpactDetectionCard from "@/components/cards/ImpactDetectionCard";
import CommunityDetectionCard from "@/components/cards/CommunityDetectionCard";
import ProcessTracingCard from "@/components/cards/ProcessTracingCard";
import HybridSearchCard from "@/components/cards/HybridSearchCard";
import MCPIntegrationCard from "@/components/cards/MCPIntegrationCard";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_MAP: Record<string, React.ComponentType> = {
  "knowledge-graph": KnowledgeGraphCard,
  "impact-detection": ImpactDetectionCard,
  "community-detection": CommunityDetectionCard,
  "process-tracing": ProcessTracingCard,
  "hybrid-search": HybridSearchCard,
  "mcp-integration": MCPIntegrationCard,
};

interface HeroFeatureSectionProps {
  feature: HeroFeature;
  index: number;
  children?: React.ReactNode;
}

export default function HeroFeatureSection({
  feature,
  index,
  children,
}: HeroFeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const Icon = ICON_MAP[feature.iconName as IconName];
  const AnimationCard = ANIMATION_MAP[feature.id];
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelector(".hero-header");
      if (header) {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });
      }

      const animation = sectionRef.current.querySelector(".hero-animation");
      if (animation) {
        gsap.from(animation, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
        });
      }

      const metrics = sectionRef.current.querySelectorAll(".metric-card");
      if (metrics.length > 0) {
        gsap.from(metrics, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
        });
      }

      const demo = sectionRef.current.querySelector(".demo-section");
      if (demo) {
        gsap.from(demo, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  // Generate a unique seed from the feature id
  const blobSeed = feature.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 7;

  return (
    <section
      ref={sectionRef}
      id={`hero-feature-${feature.id}`}
      className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8"
    >
      <SectionBlobs seed={blobSeed} />
      <div className="max-w-7xl mx-auto">
        {/* Header + Animation Side by Side */}
        <div className="hero-header mb-12 md:mb-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text side */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{feature.title}</h2>
            </div>

            <p className="text-lg text-text-secondary mb-4 italic">
              {feature.painPoint}
            </p>
            <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
              {feature.tagline}
            </h3>
            <p className="text-text-secondary mt-4">{feature.shortDescription}</p>
          </div>

          {/* Animation side */}
          {AnimationCard && (
            <div className="hero-animation">
              <div className="rounded-2xl border border-white/[0.06] bg-black/10 backdrop-blur-sm p-6 aspect-square max-w-[320px] mx-auto lg:mx-0 lg:ml-auto flex items-center justify-center">
                <AnimationCard />
              </div>
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="metric-card">
          <MetricsCard metrics={feature.metrics} />
        </div>

        {/* Optional embedded content (e.g. graph visualization) */}
        {children && <div className="mt-12">{children}</div>}

        {/* Before/After Demo */}
        <div className="demo-section mt-16 md:mt-20">
          <BeforeAfterDemo
            beforeTitle={feature.beforeDemo.title}
            beforeLines={feature.beforeDemo.lines}
            afterTitle={feature.afterDemo.title}
            afterLines={feature.afterDemo.lines}
          />
        </div>
      </div>

    </section>
  );
}
