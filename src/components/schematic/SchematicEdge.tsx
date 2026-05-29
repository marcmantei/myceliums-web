"use client";

import { EdgeProps, BaseEdge, getBezierPath } from "@xyflow/react";

export default function SchematicEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: EdgeProps<any>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isProcessStep = data?.weight ? data.weight > 1.5 : false;

  return (
    <BaseEdge
      path={edgePath}
      interactionWidth={40}
      style={{
        stroke: isProcessStep ? "#10B981" : "#64748B",
        strokeWidth: isProcessStep ? 2.5 : 1.5,
        opacity: selected ? 1 : 0.5,
      }}
    />
  );
}
