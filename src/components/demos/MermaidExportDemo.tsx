"use client";

import { useEffect, useRef, useState } from "react";

const REPOS = [
  { id: "express", label: "Express", desc: "Node.js framework" },
  { id: "zod", label: "Zod", desc: "TypeScript validation" },
  { id: "fastapi", label: "FastAPI", desc: "Python async API" },
];

interface ArchData {
  mermaid: string;
  services: Array<{ label: string; member_count: number }>;
  connections: Array<{ source: string; target: string; count: number }>;
}

export default function MermaidExportDemo() {
  const [activeRepo, setActiveRepo] = useState("express");
  const [data, setData] = useState<ArchData | null>(null);
  const [rendered, setRendered] = useState("");
  const [loading, setLoading] = useState(true);
  const renderKey = useRef(0);

  // Load architecture data for selected repo
  useEffect(() => {
    setLoading(true);
    fetch(`/demos/architecture-${activeRepo}.json`)
      .then((r) => r.json())
      .then((d: ArchData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeRepo]);

  // Render mermaid diagram
  useEffect(() => {
    if (!data?.mermaid) return;

    let cancelled = false;
    renderKey.current++;
    const currentKey = renderKey.current;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          fontFamily: "JetBrains Mono, monospace",
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            padding: 16,
            nodeSpacing: 40,
            rankSpacing: 50,
          },
          themeVariables: {
            primaryColor: "#6366F1",
            primaryTextColor: "#FAFAFA",
            primaryBorderColor: "#4F46E5",
            lineColor: "#52525B",
            secondaryColor: "#1A1A1E",
            tertiaryColor: "#111114",
            fontSize: "13px",
            edgeLabelBackground: "#111114",
          },
        });

        const id = `mermaid-arch-${currentKey}`;
        const { svg } = await mermaid.render(id, data.mermaid);
        if (!cancelled && currentKey === renderKey.current) {
          setRendered(svg);
        }
      } catch (err) {
        if (!cancelled) {
          setRendered(
            `<pre style="color:#EF4444;font-size:11px;padding:16px;">${data.mermaid}</pre>`
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Repo selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-tertiary font-mono mr-1">
          Repository:
        </span>
        {REPOS.map((repo) => (
          <button
            key={repo.id}
            onClick={() => setActiveRepo(repo.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeRepo === repo.id
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-text-tertiary hover:text-text-secondary border border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            {repo.label}
            <span className="text-text-tertiary ml-1 hidden sm:inline">
              {repo.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Mermaid render area */}
      <div
        className="rounded-xl bg-[#0a0a0c] border border-white/[0.06] overflow-hidden"
        style={{ minHeight: 320 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-80 text-text-tertiary text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mr-2" />
            Loading diagram...
          </div>
        ) : (
          <div
            className="p-6 flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:max-h-[500px]"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        )}
      </div>

      {/* Stats bar */}
      {data && (
        <div className="flex gap-6 text-[11px] font-mono text-text-tertiary">
          <span>
            <span className="text-accent">{data.services.length}</span> services
          </span>
          <span>
            <span className="text-accent">{data.connections.length}</span>{" "}
            connections
          </span>
          <span>
            <span className="text-accent">
              {data.services.reduce((s, n) => s + n.member_count, 0)}
            </span>{" "}
            total symbols
          </span>
        </div>
      )}
    </div>
  );
}
