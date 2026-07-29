"use client";

import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">
            Myceliums
          </span>
          <span className="text-sm text-text-secondary">
            Built with Rust 🦀
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/marcmantei/myceliums"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <span className="text-xs text-text-secondary">Apache-2.0 License</span>
        </div>
      </div>
    </footer>
  );
}
