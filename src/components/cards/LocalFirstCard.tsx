"use client";

import { useEffect, useState } from "react";

export default function LocalFirstCard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % 4), 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 70" className="w-full h-full">
      {/* Shield path */}
      <path
        d="M50 10 L70 20 L70 40 Q70 55 50 62 Q30 55 30 40 L30 20 Z"
        fill="none"
        stroke="#10B981"
        strokeWidth="1"
        opacity={step >= 1 ? 0.6 : 0}
        strokeDasharray="160"
        strokeDashoffset={step >= 1 ? 0 : 160}
        style={{ transition: "stroke-dashoffset 1s ease, opacity 0.3s" }}
      />

      {/* Lock icon */}
      <rect
        x="44" y="30" width="12" height="10" rx="2"
        fill={step >= 0 ? "#10B981" : "#3F3F46"}
        opacity={step >= 0 ? 0.7 : 0.3}
        style={{ transition: "all 0.5s" }}
      />
      <path
        d="M47 30 L47 26 Q47 22 50 22 Q53 22 53 26 L53 30"
        fill="none"
        stroke={step >= 0 ? "#10B981" : "#3F3F46"}
        strokeWidth="1.5"
        opacity={step >= 0 ? 0.7 : 0.3}
        style={{ transition: "all 0.5s" }}
      />

      {/* No Cloud */}
      <text
        x="50" y="12"
        fontSize="4" fill="white"
        opacity={step >= 2 ? 0.4 : 0}
        textAnchor="middle"
        fontFamily="monospace"
        style={{ transition: "opacity 0.5s" }}
      >
        No Cloud
      </text>

      {/* No Telemetry */}
      <text
        x="50" y="68"
        fontSize="4" fill="white"
        opacity={step >= 3 ? 0.4 : 0}
        textAnchor="middle"
        fontFamily="monospace"
        style={{ transition: "opacity 0.5s" }}
      >
        No Telemetry
      </text>
    </svg>
  );
}
