"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function Navbar() {
  const [stars, setStars] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/repos/marcmantei/myceliums")
      .then((r) => r.json())
      .then((d) => {
        if (d.stargazers_count !== undefined) setStars(d.stargazers_count);
      })
      .catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Benchmarks", href: "#benchmarks" },
    { label: "Get Started", href: "#get-started" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-gradient-to-b from-black to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Myceliums" className="w-9 h-9" />
          <span className="text-xl font-bold text-foreground tracking-tight">
            <span className="text-accent">my</span>celiums
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 hover:text-white transition-all duration-200 relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* GitHub button */}
          <a
            href="https://github.com/marcmantei/myceliums"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors duration-200 border border-white/[0.06] rounded-lg px-3 py-1.5 hover:border-accent/40"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="hidden sm:inline">GitHub</span>
            {stars !== null && (
              <span className="text-xs bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">
                {stars}
              </span>
            )}
          </a>
        </div>
      </div>
    </nav>
  );
}
