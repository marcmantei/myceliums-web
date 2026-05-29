"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: number;
  /** Text shown after the number (e.g., "s", "%", "+") */
  suffix?: string;
  /** Text shown before the number */
  prefix?: string;
  /** Duration in seconds */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Label below the number */
  label?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
  label,
  className = "",
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const obj = useRef({ val: 0 });

  useGSAP(() => {
    if (!counterRef.current) return;

    gsap.to(obj.current, {
      val: value,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: counterRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate() {
        if (counterRef.current) {
          const formatted =
            decimals > 0
              ? obj.current.val.toFixed(decimals)
              : Math.round(obj.current.val).toLocaleString();
          counterRef.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
    });
  });

  return (
    <div className={`text-center ${className}`}>
      <span
        ref={counterRef}
        className="block text-4xl md:text-5xl font-semibold font-mono text-foreground tracking-tight"
      >
        {prefix}0{suffix}
      </span>
      {label && (
        <span className="block mt-2 text-sm text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
