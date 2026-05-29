"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeadlineProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  /** Split by "words" or "chars" */
  splitBy?: "words" | "chars";
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Use scroll trigger instead of immediate play */
  scrollTrigger?: boolean;
}

export default function AnimatedHeadline({
  children,
  as: Tag = "h2",
  className = "",
  splitBy = "words",
  delay = 0,
  scrollTrigger = true,
}: AnimatedHeadlineProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const el = containerRef.current;
      const text = el.textContent || "";

      // Split text into spans
      const units =
        splitBy === "words" ? text.split(/\s+/) : text.split("");
      el.innerHTML = units
        .map(
          (unit) =>
            `<span class="inline-block overflow-hidden"><span class="inline-block split-unit">${unit}</span></span>`
        )
        .join(splitBy === "words" ? "&nbsp;" : "");

      const spans = el.querySelectorAll(".split-unit");

      const config: gsap.TweenVars = {
        y: "110%",
        opacity: 0,
        duration: 0.5,
        stagger: splitBy === "words" ? 0.06 : 0.02,
        ease: "power3.out",
        delay,
      };

      if (scrollTrigger) {
        gsap.from(spans, {
          ...config,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      } else {
        gsap.from(spans, config);
      }
    },
    { scope: containerRef }
  );

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
      {children}
    </Tag>
  );
}
