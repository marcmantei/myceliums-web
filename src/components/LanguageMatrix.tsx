"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

type SupportLevel = "full" | "partial" | "none";

interface LanguageSupport {
  name: string;
  extensions: string;
  status: "Full" | "Good" | "Planned";
  statusColor: string;
  symbols: SupportLevel;
  imports: SupportLevel;
  calls: SupportLevel;
  types: SupportLevel;
  comments: SupportLevel;
}

const languages: LanguageSupport[] = [
  {
    name: "TypeScript",
    extensions: ".ts",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "TSX",
    extensions: ".tsx",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "Python",
    extensions: ".py",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "JavaScript",
    extensions: ".js",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "none",
    comments: "full",
  },
  {
    name: "Rust",
    extensions: ".rs",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "Go",
    extensions: ".go",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "Java",
    extensions: ".java",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "C#",
    extensions: ".cs",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "C",
    extensions: ".c/.h",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "C++",
    extensions: ".cpp/.hpp",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "Ruby",
    extensions: ".rb",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "none",
    comments: "full",
  },
  {
    name: "Kotlin",
    extensions: ".kt/.kts",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "Swift",
    extensions: ".swift",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "full",
    comments: "full",
  },
  {
    name: "PHP",
    extensions: ".php",
    status: "Full",
    statusColor: "#10B981",
    symbols: "full",
    imports: "full",
    calls: "full",
    types: "partial",
    comments: "full",
  },
];

function SupportBadge({ level }: { level: SupportLevel }) {
  if (level === "full") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
        &#10003;
      </span>
    );
  }
  if (level === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold">
        ~
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700/40 text-zinc-500 text-xs font-bold">
      &mdash;
    </span>
  );
}

function StatusPill({
  status,
  color,
}: {
  status: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {status}
    </span>
  );
}

const featureColumns = [
  { key: "symbols" as const, label: "Symbols", tooltip: "Functions, classes, variables" },
  { key: "imports" as const, label: "Imports", tooltip: "Import/require tracking" },
  { key: "calls" as const, label: "Calls", tooltip: "Function call graph" },
  { key: "types" as const, label: "Types", tooltip: "Type annotations & interfaces" },
  { key: "comments" as const, label: "Docs", tooltip: "Docstrings & comments" },
];

export default function LanguageMatrix() {
  return (
    <section id="languages" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >

          14 languages. One knowledge graph.
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-xl mx-auto mb-12"
        >
          Full tree-sitter parsing for every major language: symbols, imports, call graphs, types, and documentation.
        </motion.p>

        {/* Desktop table */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden md:block overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="text-left py-3 px-4 font-medium">Language</th>
                <th className="text-left py-3 px-3 font-medium">Status</th>
                {featureColumns.map((col) => (
                  <th
                    key={col.key}
                    className="text-center py-3 px-3 font-medium"
                    title={col.tooltip}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {languages.map((lang, i) => (
                <motion.tr
                  key={lang.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.03 * i }}
                  className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs text-text-secondary font-mono">
                      {lang.extensions}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusPill status={lang.status} color={lang.statusColor} />
                  </td>
                  {featureColumns.map((col) => (
                    <td key={col.key} className="py-3 px-3 text-center">
                      <SupportBadge level={lang[col.key]} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              {...fadeUp}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="p-4 bg-surface border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-xs text-text-secondary font-mono ml-2">
                    {lang.extensions}
                  </span>
                </div>
                <StatusPill status={lang.status} color={lang.statusColor} />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {featureColumns.map((col) => (
                  <div key={col.key} className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <SupportBadge level={lang[col.key]} />
                    {col.label}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary"
        >
          <div className="flex items-center gap-1.5">
            <SupportBadge level="full" />
            <span>Supported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SupportBadge level="partial" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SupportBadge level="none" />
            <span>Not yet</span>
          </div>
        </motion.div>

        {/* Roadmap callout */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-text-secondary">
            Missing your language?{" "}
            <a
              href="https://github.com/marcmantei/myceliums/issues/new?title=Language+request:+&labels=language-support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-glow hover:underline"
            >
              Open a request
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
