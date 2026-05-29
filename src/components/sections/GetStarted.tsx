"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Copy, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-text-secondary hover:text-foreground bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-success" />
          <span className="text-success">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

const INSTALL_CMD = "cargo install myc";

const SETUP_OUTPUT = `$ myc setup
Detecting installed editors...
  ✓ Claude Code    configured (MCP + hooks)
  ✓ Cursor         configured (MCP)
  ✓ VS Code        configured (MCP)
  ✓ Windsurf       configured (MCP)
  ✓ Zed            configured (context server)
  - JetBrains      not found
  - Aider          not found

5 editors configured. Run myc doctor to verify.`;

const ANALYZE_OUTPUT = `$ myc analyze .
Parsing 5,247 files across 20+ languages...
Building knowledge graph...
  Symbols:       41,952
  Relationships: 45,028
  Communities:   86
  Processes:     214
✓ Analyzed in 1.6s

$ myc search "handleAuth"
  1. handleAuth (Function) — auth.ts:14 [0.98]
  2. authMiddleware (Function) — middleware.ts:31 [0.87]`;

const EDITORS = [
  { name: "Claude Code", detail: "MCP + hooks (auto-index on commit)" },
  { name: "Cursor", detail: "MCP server" },
  { name: "VS Code", detail: "MCP via Copilot" },
  { name: "Windsurf", detail: "MCP server" },
  { name: "Zed", detail: "Context server" },
  { name: "JetBrains", detail: "MCP via plugin" },
  { name: "Copilot CLI", detail: "MCP server" },
  { name: "Gemini CLI", detail: "MCP server" },
  { name: "Codex CLI", detail: "MCP server" },
  { name: "Aider", detail: "MCP server" },
  { name: "Kiro", detail: "MCP server" },
  { name: "Continue", detail: "MCP server" },
];

export default function GetStarted() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.from(sectionRef.current.querySelectorAll("[data-animate]"), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="get-started" className="py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16" data-animate>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Get started now</h2>
          </div>

          <p className="text-lg text-text-secondary mb-4 italic">
            Ready to give your AI agents real understanding of your codebase?
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-accent leading-snug">
            Two commands. Myceliums installs, auto-detects your editors, and configures everything.
          </h3>
        </div>

        {/* 2-card overview */}
        <div className="grid sm:grid-cols-2 gap-6" data-animate>
          <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-6 text-center">
            <span className="inline-flex w-10 h-10 rounded-full bg-accent/15 text-accent text-lg items-center justify-center font-mono mb-4">1</span>
            <h3 className="text-lg font-bold text-white mb-2">Install</h3>
            <p className="text-sm text-white/50 mb-4">
              One command. Works on Mac, Linux, and Windows. Also available via Homebrew and Docker.
            </p>
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-sm text-success">
              <span>$ {INSTALL_CMD}</span>
              <CopyButton text={INSTALL_CMD} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-6 text-center">
            <span className="inline-flex w-10 h-10 rounded-full bg-accent/15 text-accent text-lg items-center justify-center font-mono mb-4">2</span>
            <h3 className="text-lg font-bold text-white mb-2">Setup</h3>
            <p className="text-sm text-white/50 mb-4">
              Auto-detects all installed editors and configures MCP integration for each one.
            </p>
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-sm text-success">
              <span>$ myc setup</span>
              <CopyButton text="myc setup" />
            </div>
          </div>
        </div>

        {/* Detailed terminal outputs */}
        <div className="mt-12" data-animate>
          <p className="text-sm font-mono text-text-tertiary uppercase tracking-wider mb-6">
            What happens under the hood
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Setup output */}
            <div className="rounded-2xl border border-white/[0.06] bg-black/10 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
                <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs flex items-center justify-center font-mono">1</span>
                <span className="text-sm font-medium">myc setup</span>
                <span className="text-xs text-text-tertiary ml-auto">auto-detect + configure</span>
              </div>
              <div className="p-5 font-mono text-xs space-y-0.5">
                {SETUP_OUTPUT.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("$")
                        ? "text-success text-sm"
                        : line.includes("✓")
                          ? "text-emerald-400"
                          : line.includes("-")
                            ? "text-text-tertiary"
                            : "text-text-secondary"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Analyze output */}
            <div className="rounded-2xl border border-white/[0.06] bg-black/10 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
                <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center font-mono">2</span>
                <span className="text-sm font-medium">myc analyze .</span>
                <span className="text-xs text-text-tertiary ml-auto">build knowledge graph</span>
              </div>
              <div className="p-5 font-mono text-xs space-y-0.5">
                {ANALYZE_OUTPUT.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("$")
                        ? "text-success text-sm"
                        : line.includes("✓")
                          ? "text-emerald-400"
                          : line.startsWith("  ")
                            ? "text-white/70"
                            : "text-text-secondary"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supported editors */}
        <div className="mt-12" data-animate>
          <p className="text-sm font-mono text-text-tertiary uppercase tracking-wider mb-4">
            Supported editors and AI agents
          </p>
          <div className="flex flex-wrap gap-2">
            {EDITORS.map((editor) => (
              <span
                key={editor.name}
                className="group relative px-3 py-1.5 text-xs font-mono text-white/60 rounded-md bg-white/[0.04] border border-white/[0.06] hover:border-accent/30 hover:text-white/80 transition-colors cursor-default"
                title={editor.detail}
              >
                {editor.name}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-text-tertiary">
            <code className="text-accent/60">myc setup</code> auto-detects which editors are installed and configures each one.
            Claude Code gets extra hooks for auto-indexing on every commit.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-wrap items-center gap-4" data-animate>
          <a
            href="https://github.com/marcmantei/myceliums#installation"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-accent hover:bg-accent-glow text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/40"
          >
            Install Myceliums
          </a>
          <a
            href="https://github.com/marcmantei/myceliums"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl font-medium transition-all duration-200"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
