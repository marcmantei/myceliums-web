"use client";

import { Github } from "lucide-react";
import { LICENSE_LABEL, LICENSE_SPDX_ID } from "@/data/license";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Myceliums" className="w-8 h-8" />
            <span className="text-base font-semibold text-foreground">
              <span className="text-accent">my</span>celiums
            </span>
          </div>
          <span className="text-xs text-text-tertiary">
            Built with Rust
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/marcmantei/myceliums"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <span className="text-xs text-text-tertiary">{LICENSE_LABEL}</span>
        </div>
      </div>
    </footer>
  );
}
