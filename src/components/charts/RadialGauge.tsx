"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RadialGaugeProps {
  value: number;
  label: string;
  suffix?: string;
  color?: string;
  size?: number;
}

export default function RadialGauge({
  value,
  label,
  suffix = "%",
  color = "#6366F1",
  size = 120,
}: RadialGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - value / 100);

  useGSAP(() => {
    if (!circleRef.current || !textRef.current || !svgRef.current) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 85%",
      },
      onUpdate() {
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = String(
            circumference * (1 - obj.val / 100)
          );
        }
        if (textRef.current) {
          textRef.current.textContent = `${obj.val.toFixed(1)}${suffix}`;
        }
      },
    });
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          ref={circleRef}
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          opacity="0.8"
        />
      </svg>
      {/* Value text overlay */}
      <div className="absolute flex flex-col items-center" style={{ marginTop: `${size * 0.3}px` }}>
        <svg width="60" height="24" viewBox="0 0 60 24">
          <text
            ref={textRef}
            x="30" y="18"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="600"
            fontFamily="var(--font-mono)"
          >
            0{suffix}
          </text>
        </svg>
      </div>
      <span className="text-xs text-text-secondary text-center mt-1">{label}</span>
    </div>
  );
}
