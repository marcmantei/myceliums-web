"use client";

import {
  GitBranch,
  Layers,
} from "lucide-react";
import { GraphCommunity, ProcessCluster } from "@/types/graph";

interface SchematicSidebarProps {
  communities: GraphCommunity[];
  processes: ProcessCluster[];
  viewMode: "processes" | "modules" | "definitions";
  selectedProcessId: string | null;
  selectedCommunityId: string | null;
  onSelectProcess: (processId: string | null) => void;
  onSelectCommunity: (communityId: string | null) => void;
  expandedCommunities: Set<string>;
  onToggleCommunity: (communityId: string) => void;
}

export default function SchematicSidebar({
  communities,
  processes,
  viewMode,
  selectedProcessId,
  selectedCommunityId,
  onSelectProcess,
  onSelectCommunity,
}: SchematicSidebarProps) {
  return (
    <div className="flex w-64 flex-col border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-100">Schematic</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          {communities.length} modules · {processes.length} processes
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Processes view */}
        {viewMode === "processes" &&
          processes.map((process) => {
            const isSelected = process.id === selectedProcessId;
            return (
              <button
                key={process.id}
                onClick={() => onSelectProcess(isSelected ? null : process.id)}
                className={`w-full border-b border-slate-700/20 px-4 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "bg-indigo-500/15 border-l-2 border-l-indigo-400"
                    : "hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <GitBranch
                    className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${
                      isSelected ? "text-indigo-400" : "text-emerald-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium text-sm truncate ${
                        isSelected ? "text-indigo-200" : "text-slate-200"
                      }`}
                    >
                      {process.name}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {process.description}
                    </p>
                    <div className="text-[10px] text-slate-600 mt-1">
                      {process.step_ids.length} steps
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

        {/* Modules view */}
        {viewMode === "modules" &&
          communities.map((community) => {
            const isSelected = community.id === selectedCommunityId;
            return (
              <button
                key={community.id}
                onClick={() => onSelectCommunity(isSelected ? null : community.id)}
                className={`w-full border-b border-slate-700/20 px-4 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "bg-indigo-500/15 border-l-2 border-l-indigo-400"
                    : "hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Layers
                    className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${
                      isSelected ? "text-indigo-400" : "text-slate-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium text-sm truncate ${
                        isSelected ? "text-indigo-200" : "text-slate-200"
                      }`}
                    >
                      {community.label}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      {community.member_count} symbols
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

        {/* Definitions view — no sidebar needed, content loads automatically */}
        {viewMode === "definitions" && (
          <div className="px-4 py-6 text-center text-xs text-slate-500">
            Showing top definitions by call depth on the canvas
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-[10px] text-slate-600">
        {viewMode === "processes" && "Select a process to view its flow"}
        {viewMode === "modules" && "Select a module to explore"}
        {viewMode === "definitions" && "All definitions shown on canvas"}
      </div>
    </div>
  );
}
