"use client";

import SectionWrapper from "@/components/ui/section-wrapper";
import { useViewMode } from "@/components/providers/ViewModeProvider";

export default function KnowledgeExplorer() {
  const { isDeveloper } = useViewMode();

  return (
    <SectionWrapper id="knowledge-explorer" className="py-24 sm:py-32" stagger>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12" data-animate>
          <p className="text-sm font-mono text-white/30 mb-4">
            {"// knowledge.explorer"}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your knowledge base.{" "}
            <span className="text-accent">In your browser.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Ask questions about your codebase, emails, and documents.
            Get answers with proof &mdash; right in your browser. No cloud required.
          </p>
        </div>

        {/* Preview mockup */}
        <div
          className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] overflow-hidden"
          data-animate
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs font-mono text-white/30 ml-2">
              localhost:8888/knowledge
            </span>
            <div className="ml-auto flex gap-2">
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/[0.06] text-white/40">
                Graph
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-accent/20 text-accent border border-accent/30">
                Knowledge
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-6 py-4 border-b border-white/[0.04]">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-white/30">🔍</span>
                <span className="text-white/80 text-sm">hash_password</span>
                <span className="ml-auto text-xs text-white/20 font-mono hidden sm:inline">
                  Enter to search
                </span>
              </div>
              <button className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium">
                Search
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="px-6 py-4 space-y-3">
            <p className="text-xs text-white/40 font-mono mb-3">
              Found 3 mentions across 3 sources
            </p>

            {/* Result 1: Email */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  Email
                </span>
                <span className="text-sm text-white font-medium">
                  Security audit findings
                </span>
                <span className="text-xs text-white/30 font-mono ml-auto hidden sm:inline">
                  emails/security-audit.eml
                </span>
              </div>
              <div className="pl-3 border-l-2 border-accent/30">
                <div className="text-xs text-accent/70 font-mono mb-1">
                  &rarr; mentions: hash_password (Function) at auth.py:14
                </div>
                <p className="text-xs text-white/50 italic">
                  &ldquo;The hash_password function in auth.py uses SHA256 with a static salt.
                  This should be migrated to bcrypt or argon2...&rdquo;
                </p>
                <span className="text-[11px] text-white/25 font-mono mt-1 inline-block">
                  Source: line 5
                </span>
              </div>
            </div>

            {/* Result 2: Document */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-sky-400/10 text-sky-400 border border-sky-400/20">
                  Document
                </span>
                <span className="text-sm text-white font-medium">
                  API Security Guide
                </span>
                <span className="text-xs text-white/30 font-mono ml-auto hidden sm:inline">
                  docs/security-guide.md
                </span>
              </div>
              <div className="pl-3 border-l-2 border-accent/30">
                <div className="text-xs text-accent/70 font-mono mb-1">
                  &rarr; mentions: hash_password (Function) at auth.py:14
                </div>
                <p className="text-xs text-white/50 italic">
                  &ldquo;The hash_password function in auth.py is responsible for all password hashing...&rdquo;
                </p>
                <span className="text-[11px] text-white/25 font-mono mt-1 inline-block">
                  Source: line 5
                </span>
              </div>
            </div>

            {/* Result 3: Email */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  Email
                </span>
                <span className="text-sm text-white font-medium">
                  Auth refactoring plan for Q3
                </span>
                <span className="text-xs text-white/30 font-mono ml-auto hidden sm:inline">
                  emails/auth-refactoring.eml
                </span>
              </div>
              <div className="pl-3 border-l-2 border-accent/30">
                <div className="text-xs text-accent/70 font-mono mb-1">
                  &rarr; mentions: hash_password (Function) at auth.py:14
                </div>
                <p className="text-xs text-white/50 italic">
                  &ldquo;Refactor hash_password to use argon2 instead of SHA256...&rdquo;
                </p>
                <span className="text-[11px] text-white/25 font-mono mt-1 inline-block">
                  Source: line 6
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center" data-animate>
          {isDeveloper ? (
            <p className="text-sm text-white/40 font-mono">
              Try it: <code className="text-accent">myc serve</code> &rarr; open{" "}
              <code className="text-accent">localhost:8888</code> &rarr; click Knowledge tab
            </p>
          ) : (
            <p className="text-sm text-white/40">
              Runs in your browser. Your data never leaves your machine.
            </p>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
