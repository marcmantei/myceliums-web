"use client";

import { X, Copy, CheckCircle2 } from "lucide-react";
import { GraphNode, GraphEdge } from "@/types/graph";
import { useState } from "react";
import { getSymbolIcon } from "@/lib/symbolIcons";

interface DetailPanelProps {
  node?: GraphNode | null;
  edge?: GraphEdge | null;
  onClose: () => void;
}

/**
 * Detail panel showing detailed information about selected node or edge.
 */
export default function DetailPanel({ node, edge, onClose }: DetailPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex w-80 flex-col border-l border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-100">Details</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
          aria-label="Close details"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {node && (
          <div className="space-y-4">
            {/* Node Header */}
            <div>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getSymbolIcon(node.kind);
                  return (
                    <Icon
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: node.color }}
                      strokeWidth={2}
                    />
                  );
                })()}
                <div>
                  <h3 className="font-semibold text-slate-100">{node.name}</h3>
                  <p className="text-xs text-slate-400">{node.symbol_kind_display}</p>
                </div>
              </div>

              {/* Entry Point Badge */}
              {node.is_entry_point && (
                <div
                  className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: `${node.color}20`,
                    color: node.color,
                  }}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Entry Point
                </div>
              )}
            </div>

            {/* Metadata Sections */}
            <div className="space-y-4">
              {/* Location */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Location
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">File:</span>
                    <button
                      onClick={() => copyToClipboard(node.file, "file")}
                      className="group flex items-center gap-1 text-slate-200 hover:text-slate-100 transition-colors"
                    >
                      <span className="font-mono text-xs truncate max-w-xs">
                        {node.file.split("/").pop()}
                      </span>
                      {copied === "file" ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-slate-400">
                    Line: <span className="text-slate-200">{node.line}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              {node.signature && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Signature
                  </h4>
                  <button
                    onClick={() => copyToClipboard(node.signature, "signature")}
                    className="group w-full rounded-lg bg-slate-800/50 p-2 text-left hover:bg-slate-800 transition-colors"
                  >
                    <code className="block font-mono text-xs text-slate-300 break-words">
                      {node.signature.substring(0, 100)}
                      {node.signature.length > 100 ? "..." : ""}
                    </code>
                    {copied === "signature" && (
                      <div className="mt-1 text-xs text-emerald-400">Copied!</div>
                    )}
                  </button>
                </div>
              )}

              {/* Community */}
              {node.community && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Community
                  </h4>
                  <div
                    className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: `${node.color}20`,
                      color: node.color,
                    }}
                  >
                    {node.community}
                  </div>
                </div>
              )}

              {/* Connections */}
              {node.cross_community_edges > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Connections
                  </h4>
                  <div className="rounded-lg bg-slate-800/30 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-200">
                      {node.cross_community_edges}
                    </span>
                    <span className="text-slate-400"> cross-community edges</span>
                  </div>
                </div>
              )}

              {/* Depth */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Hierarchy
                </h4>
                <div className="text-sm text-slate-300">
                  Depth: <span className="font-medium">{node.depth}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {edge && (
          <div className="space-y-4">
            {/* Edge Header */}
            <div>
              <h3 className="font-semibold text-slate-100 mb-2">Edge Details</h3>
              <div className="text-sm text-slate-300">
                <div>
                  <span className="text-slate-400">From:</span>{" "}
                  <span className="font-mono text-xs">{edge.source}</span>
                </div>
                <div>
                  <span className="text-slate-400">To:</span>{" "}
                  <span className="font-mono text-xs">{edge.target}</span>
                </div>
              </div>
            </div>

            {/* Edge Type */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Relationship
              </h4>
              <div className="rounded-lg bg-slate-800/30 px-3 py-2">
                <div className="text-sm font-medium text-slate-200">
                  {edge.edge_type_display}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Kind: {edge.kind}
                </div>
              </div>
            </div>

            {/* Weight */}
            {edge.weight && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Weight
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-slate-800/30 px-3 py-2 text-sm font-medium text-slate-200">
                    {edge.weight.toFixed(2)}
                  </div>
                  {edge.weight > 1.5 && (
                    <div
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#10B981",
                      }}
                    >
                      Process Step
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
