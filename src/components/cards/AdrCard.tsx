"use client";

export default function AdrCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📋</span>
          <span className="text-xs font-mono text-accent">ADR-007</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Accepted
        </span>
      </div>

      <h4 className="text-sm font-medium text-white">
        Use PostgreSQL for persistent storage
      </h4>

      <div className="space-y-2 text-[11px] font-mono">
        <div>
          <span className="text-text-tertiary">Context: </span>
          <span className="text-text-secondary">
            Need ACID transactions for billing data, team prefers SQL...
          </span>
        </div>
        <div>
          <span className="text-text-tertiary">Decision: </span>
          <span className="text-text-secondary">
            PostgreSQL with connection pooling via pgBouncer
          </span>
        </div>
        <div>
          <span className="text-text-tertiary">Linked: </span>
          <span className="text-accent">db_connect</span>
          <span className="text-text-tertiary">, </span>
          <span className="text-accent">run_migration</span>
          <span className="text-text-tertiary">, </span>
          <span className="text-accent">pool_config</span>
        </div>
      </div>
    </div>
  );
}
