"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    { label: "How It Works", href: "#how-it-works" },
    { label: "Get Started", href: "#get-started" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-foreground tracking-tight">
          Myceliums
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/marcmantei/myceliums"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 hover:border-accent/50"
        >
          <Star className="w-4 h-4" />
          <span>GitHub</span>
          {stars !== null && (
            <span className="text-xs bg-surface px-1.5 py-0.5 rounded">
              {stars}
            </span>
          )}
        </a>
      </div>
    </motion.nav>
  );
}
