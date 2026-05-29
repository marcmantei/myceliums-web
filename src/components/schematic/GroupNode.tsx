"use client";

import { NodeProps } from "@xyflow/react";

export default function GroupNode({ data }: NodeProps<any>) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute -top-0.5 left-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest opacity-70">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: data.color }} />
        {data.label}
      </div>
    </div>
  );
}
