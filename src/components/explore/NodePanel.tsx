"use client";

import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import type { NodeDetailResponse } from "@/types/graph";

interface NodePanelProps {
  node: NodeDetailResponse;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
}

export default function NodePanel({ node, onClose, onNavigate }: NodePanelProps) {
  const incoming = node.neighbors.filter((n) => n.direction === "incoming");
  const outgoing = node.neighbors.filter((n) => n.direction === "outgoing");

  return (
    <div className="w-80 shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-900 p-4">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-mono text-sm font-bold text-slate-100">
            {node.name}
          </h2>
          <span
            className="inline-block mt-1 rounded px-1.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: node.color + "30", color: node.color }}
          >
            {node.symbol_kind_display}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* File location */}
      <div className="mb-4 rounded bg-slate-800/50 px-3 py-2">
        <div className="font-mono text-xs text-slate-400">{node.file}</div>
        <div className="font-mono text-xs text-slate-500">
          L{node.line}–{node.end_line}
        </div>
      </div>

      {/* Signature */}
      {node.signature && (
        <div className="mb-4">
          <div className="mb-1 text-xs font-medium text-slate-500">
            Signature
          </div>
          <pre className="overflow-x-auto rounded bg-slate-800/50 px-3 py-2 font-mono text-xs text-slate-300">
            {node.signature}
          </pre>
        </div>
      )}

      {/* Meta */}
      <div className="mb-4 flex gap-4 text-xs text-slate-500">
        <span>Community: {node.community || "—"}</span>
        <span>Depth: {node.depth}</span>
        {node.is_entry_point && (
          <span className="text-emerald-400">Entry Point</span>
        )}
      </div>

      {/* Incoming neighbors */}
      {incoming.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500">
            <ArrowLeft className="h-3 w-3" />
            Called by ({incoming.length})
          </div>
          <div className="space-y-1">
            {incoming.map((n) => (
              <button
                key={`${n.id}-${n.relationship}`}
                onClick={() => onNavigate(n.id)}
                className="block w-full rounded px-2 py-1 text-left font-mono text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                {n.name}
                <span className="ml-2 text-slate-600">{n.relationship}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Outgoing neighbors */}
      {outgoing.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500">
            <ArrowRight className="h-3 w-3" />
            Calls ({outgoing.length})
          </div>
          <div className="space-y-1">
            {outgoing.map((n) => (
              <button
                key={`${n.id}-${n.relationship}`}
                onClick={() => onNavigate(n.id)}
                className="block w-full rounded px-2 py-1 text-left font-mono text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                {n.name}
                <span className="ml-2 text-slate-600">{n.relationship}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Semantic neighbors */}
      {node.semantic_neighbors.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500">
            <Sparkles className="h-3 w-3" />
            Semantically similar ({node.semantic_neighbors.length})
          </div>
          <div className="space-y-1">
            {node.semantic_neighbors.map((n) => (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                className="flex w-full items-center justify-between rounded px-2 py-1 text-left font-mono text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <span>{n.name}</span>
                <span className="text-indigo-400">
                  {(n.similarity * 100).toFixed(0)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
