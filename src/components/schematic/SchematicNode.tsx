"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { SchematicNodeData } from "@/types/graph";
import { getSymbolIcon } from "@/lib/symbolIcons";

/**
 * Custom node component for the schematic view.
 * Displays symbol kind, name, and entry point indicator.
 */
export default function SchematicNode({
  data,
  selected,
}: NodeProps<any>) {
  const Icon = getSymbolIcon(data.kind);

  return (
    <div
      className="relative min-w-max"
      style={{
        background: `linear-gradient(135deg, ${data.color}15 0%, ${data.color}08 100%)`,
        border: `2px solid ${data.color}`,
        borderRadius: "8px",
        padding: "8px 12px",
        boxShadow: selected
          ? `0 0 0 3px rgba(99, 102, 241, 0.5), inset 0 1px 3px rgba(255,255,255,0.1)`
          : `inset 0 1px 3px rgba(255,255,255,0.05)`,
        transition: "all 0.2s",
      }}
    >
      <Handle type="target" position={Position.Top} />

      {/* Node content */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <Icon
            className="h-4 w-4"
            style={{ color: data.color }}
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div className="max-w-xs truncate text-sm font-medium text-slate-100">
              {data.label}
            </div>
            {data.is_entry_point && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  background: `${data.color}20`,
                  color: data.color,
                }}
              >
                Entry Point
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400">{data.symbol_kind_display}</div>
        </div>
      </div>

      {/* Badge for cross-community edges */}
      {data.cross_community_edges > 0 && (
        <div
          className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: data.color }}
        >
          {data.cross_community_edges}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
