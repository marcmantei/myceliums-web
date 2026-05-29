"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/section-wrapper";
import TerminalFrame from "@/components/ui/terminal-frame";

interface QueryDemo {
  id: string;
  label: string;
  command: string;
  description: string;
  results: {
    sourceKind: string;
    sourceName: string;
    sourceFile: string;
    mentionedSymbol: string;
    mentionedKind: string;
    mentionedFile: string;
    context: string;
    line: number;
  }[];
}

const DEMOS: QueryDemo[] = [
  {
    id: "email-code",
    label: "Email \u2192 Code",
    command: '$ myc knowledge "hash_password"',
    description: "Find every email and document that discusses a code function.",
    results: [
      {
        sourceKind: "Email",
        sourceName: "Security audit findings",
        sourceFile: "emails/security-audit.eml",
        mentionedSymbol: "hash_password",
        mentionedKind: "Function",
        mentionedFile: "auth.py:14",
        context: "The hash_password function in auth.py uses SHA256 with a static salt. This should be migrated to bcrypt or argon2...",
        line: 5,
      },
      {
        sourceKind: "Email",
        sourceName: "Auth refactoring plan for Q3",
        sourceFile: "emails/auth-refactoring.eml",
        mentionedSymbol: "hash_password",
        mentionedKind: "Function",
        mentionedFile: "auth.py:14",
        context: "Refactor hash_password to use argon2 instead of SHA256...",
        line: 6,
      },
      {
        sourceKind: "Document",
        sourceName: "API Security Guide",
        sourceFile: "docs/security-guide.md",
        mentionedSymbol: "hash_password",
        mentionedKind: "Function",
        mentionedFile: "auth.py:14",
        context: "The hash_password function in auth.py is responsible for all password hashing...",
        line: 5,
      },
    ],
  },
  {
    id: "doc-code",
    label: "Docs \u2192 Code",
    command: '$ myc knowledge "create_user"',
    description: "Trace which documentation references a specific database function.",
    results: [
      {
        sourceKind: "Document",
        sourceName: "API Overview",
        sourceFile: "docs/api-overview.md",
        mentionedSymbol: "create_user",
        mentionedKind: "Function",
        mentionedFile: "database.py:21",
        context: "create_user, get_user, update_user for user records...",
        line: 28,
      },
      {
        sourceKind: "Email",
        sourceName: "Auth refactoring plan",
        sourceFile: "emails/auth-refactoring.eml",
        mentionedSymbol: "create_user",
        mentionedKind: "Function",
        mentionedFile: "database.py:21",
        context: "The create_user function in database.py will need a migration to store the new hash format...",
        line: 16,
      },
      {
        sourceKind: "Document",
        sourceName: "API Security Guide",
        sourceFile: "docs/security-guide.md",
        mentionedSymbol: "create_user",
        mentionedKind: "Function",
        mentionedFile: "database.py:21",
        context: "Stores the user via create_user...",
        line: 37,
      },
    ],
  },
  {
    id: "cross",
    label: "Cross-Domain",
    command: '$ myc knowledge "verify_jwt_token"',
    description: "One query, every mention across code, emails, and docs.",
    results: [
      {
        sourceKind: "Email",
        sourceName: "Security audit findings",
        sourceFile: "emails/security-audit.eml",
        mentionedSymbol: "verify_jwt_token",
        mentionedKind: "Function",
        mentionedFile: "auth.py:76",
        context: "The require_auth middleware correctly validates tokens via verify_jwt_token, but does not check expiration...",
        line: 14,
      },
      {
        sourceKind: "Document",
        sourceName: "API Security Guide",
        sourceFile: "docs/security-guide.md",
        mentionedSymbol: "verify_jwt_token",
        mentionedKind: "Function",
        mentionedFile: "auth.py:76",
        context: "Token verification happens in verify_jwt_token, which checks both signature validity and expiration...",
        line: 16,
      },
      {
        sourceKind: "Email",
        sourceName: "Auth refactoring plan",
        sourceFile: "emails/auth-refactoring.eml",
        mentionedSymbol: "verify_jwt_token",
        mentionedKind: "Function",
        mentionedFile: "auth.py:76",
        context: "The require_admin decorator chains through require_auth and verify_jwt_token...",
        line: 20,
      },
    ],
  },
];

function KindBadge({ kind }: { kind: string }) {
  const colors: Record<string, string> = {
    Email: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Document: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    Function: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  };
  return (
    <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${colors[kind] || "text-white/50 bg-white/5 border-white/10"}`}>
      {kind}
    </span>
  );
}

export default function KnowledgeQuery() {
  const [activeDemo, setActiveDemo] = useState(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === activeDemo) || DEMOS[0];

  return (
    <SectionWrapper id="knowledge-query" className="py-24 sm:py-32" stagger>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12" data-animate>
          <p className="text-sm font-mono text-white/30 mb-4">
            {"// knowledge.query"}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ask anything.{" "}
            <span className="text-accent">Get answers with proof.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Query across code, emails, docs, and notebooks. Every answer shows
            exactly where it came from &mdash; with file paths, line numbers, and context.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" data-animate>
          {DEMOS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDemo(d.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeDemo === d.id
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <p className="text-center text-white/50 mb-6 text-sm" data-animate>
          {demo.description}
        </p>

        {/* Results */}
        <div data-animate>
          <TerminalFrame title="myceliums" variant="success">
            <div className="space-y-1 text-sm">
              <div className="text-success font-semibold">{demo.command}</div>
              <div className="text-white/40 text-xs mt-2 mb-3">
                Found {demo.results.length} mention(s) across {new Set(demo.results.map((r) => r.sourceFile)).size} source(s):
              </div>

              {demo.results.map((r, i) => (
                <div key={i} className="pl-2 py-2 border-l-2 border-white/[0.06] mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/40 text-xs font-mono">{i + 1}.</span>
                    <KindBadge kind={r.sourceKind} />
                    <span className="text-white font-medium text-sm">
                      &ldquo;{r.sourceName}&rdquo;
                    </span>
                    <span className="text-white/30 text-xs font-mono ml-auto hidden sm:inline">
                      {r.sourceFile}
                    </span>
                  </div>
                  <div className="pl-5 text-xs">
                    <div className="text-accent/80 font-mono">
                      &rarr; mentions: {r.mentionedSymbol} ({r.mentionedKind}) at {r.mentionedFile}
                    </div>
                    <div className="text-white/50 mt-1 italic">
                      &ldquo;{r.context}&rdquo;
                    </div>
                    <div className="text-white/30 mt-0.5 font-mono">
                      Source: {r.sourceFile}, line {r.line}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TerminalFrame>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Every result includes the ground-truth reference. No hallucinations. No guessing.
        </p>
      </div>
    </SectionWrapper>
  );
}
