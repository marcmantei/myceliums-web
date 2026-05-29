"use client";

import { useEffect, useRef } from "react";

interface AsciinemaPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  speed?: number;
  preload?: boolean;
  loop?: boolean;
  theme?: "asciinema" | "asciinema" | "dracula" | "nord" | "solarized-dark" | "solarized-light";
}

export default function AsciinemaPlayer({
  src,
  title = "Terminal Demo",
  autoPlay = true,
  speed = 1,
  preload = true,
  loop = true,
  theme = "asciinema",
}: AsciinemaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the CSS from CDN
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/asciinema-player@3.7.0/dist/bundle/asciinema-player.css";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dynamically import the player script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/asciinema-player@3.7.0/dist/bundle/asciinema-player.min.js";
    script.async = true;

    script.onload = () => {
      // Clear previous content
      container.innerHTML = "";

      // Create the asciinema-player element
      const player = document.createElement("asciinema-player");
      player.setAttribute("src", src);
      player.setAttribute("data-autoplay", autoPlay ? "true" : "false");
      player.setAttribute("data-speed", speed.toString());
      player.setAttribute("data-preload", preload ? "true" : "false");
      player.setAttribute("data-loop", loop ? "true" : "false");
      player.setAttribute("data-theme", theme);

      // Apply custom styling
      player.style.width = "100%";
      player.style.height = "auto";
      player.style.minHeight = "400px";

      container.appendChild(player);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [src, autoPlay, speed, preload, loop, theme]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-surface border border-border rounded-xl overflow-hidden shadow-2xl"
      style={
        {
          "--asciinema-fg": "#FAFAFA",
          "--asciinema-bg": "#18181B",
        } as React.CSSProperties
      }
    />
  );
}
