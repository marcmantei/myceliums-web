"use client";

const OWNERSHIP = [
  { path: "lib/router/", team: "@express/routing", color: "#6366F1" },
  { path: "lib/response.js", team: "@express/core", color: "#EC4899" },
  { path: "lib/request.js", team: "@express/core", color: "#EC4899" },
  { path: "lib/application.js", team: "@express/core", color: "#EC4899" },
  { path: "lib/view.js", team: "@express/views", color: "#14B8A6" },
  { path: "test/", team: "@express/qa", color: "#F59E0B" },
];

export default function CodeownersCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c] p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">👥</span>
        <span className="text-xs font-mono text-text-secondary">
          CODEOWNERS
        </span>
        <span className="ml-auto text-[10px] text-text-tertiary font-mono">
          {OWNERSHIP.length} rules
        </span>
      </div>

      <div className="space-y-1.5">
        {OWNERSHIP.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-[11px] font-mono"
          >
            <span className="text-text-secondary flex-1 truncate">
              {entry.path}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-tertiary">{entry.team}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
