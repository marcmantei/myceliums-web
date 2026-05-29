"use client";

import TerminalFrame from "@/components/ui/terminal-frame";

export default function ApiContractCard() {
  return (
    <TerminalFrame title="myc contracts" variant="success">
      <div className="space-y-2 text-[11px]">
        <div className="text-emerald-400">
          Detected 1 OpenAPI spec, 12 endpoints
        </div>
        <div className="text-text-tertiary">
          ─────────────────────────────────
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sky-400">GET</span>
            <span className="text-text-secondary">/api/users</span>
            <span className="text-text-tertiary ml-auto">→</span>
            <span className="text-accent">list_users</span>
            <span className="text-emerald-400 text-[10px]">100%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">POST</span>
            <span className="text-text-secondary">/api/users</span>
            <span className="text-text-tertiary ml-auto">→</span>
            <span className="text-accent">create_user</span>
            <span className="text-emerald-400 text-[10px]">100%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">PUT</span>
            <span className="text-text-secondary">/api/users/:id</span>
            <span className="text-text-tertiary ml-auto">→</span>
            <span className="text-accent">update_user</span>
            <span className="text-amber-400 text-[10px]">70%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400">DELETE</span>
            <span className="text-text-secondary">/api/sessions</span>
            <span className="text-text-tertiary ml-auto">→</span>
            <span className="text-text-tertiary italic">unlinked</span>
          </div>
        </div>

        <div className="text-text-tertiary mt-3">
          Coverage: <span className="text-emerald-400">10/12</span> endpoints
          linked (83%)
        </div>
      </div>
    </TerminalFrame>
  );
}
