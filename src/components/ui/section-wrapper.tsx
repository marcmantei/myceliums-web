"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Animate children in with stagger on scroll */
  stagger?: boolean;
  /** Custom GSAP animation callback */
  onEnter?: (container: HTMLElement, tl: gsap.core.Timeline) => void;
}

export default function SectionWrapper({
  children,
  className = "",
  id,
  stagger = false,
  onEnter,
}: SectionWrapperProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const el = containerRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });

      if (onEnter) {
        onEnter(el, tl);
      } else if (stagger) {
        tl.from(el.querySelectorAll("[data-animate]"), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id={id}
      className={`relative px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
