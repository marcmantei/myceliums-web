"use client";

import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useCallback, useMemo } from "react";
import dagre from "dagre";
import {
  GraphNode,
  GraphEdge,
  GraphCommunity,
  SchematicNodeData,
  SchematicEdgeData,
} from "@/types/graph";
import SchematicNode from "./SchematicNode";
import SchematicEdgeComponent from "./SchematicEdge";
import GroupNode from "./GroupNode";

interface SchematicCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  communities: GraphCommunity[];
  onNodeSelect?: (node: GraphNode | null) => void;
  onEdgeSelect?: (edge: GraphEdge | null) => void;
}

const nodeTypes = {
  schematic: SchematicNode,
  communityGroup: GroupNode,
} as const;

const edgeTypes = {
  schematic: SchematicEdgeComponent,
} as const;

const GROUP_COLORS = [
  { bg: "rgba(99, 102, 241, 0.06)", border: "rgba(99, 102, 241, 0.25)", text: "#818cf8" },
  { bg: "rgba(16, 185, 129, 0.06)", border: "rgba(16, 185, 129, 0.25)", text: "#34d399" },
  { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.25)", text: "#fbbf24" },
  { bg: "rgba(239, 68, 68, 0.06)", border: "rgba(239, 68, 68, 0.25)", text: "#f87171" },
  { bg: "rgba(168, 85, 247, 0.06)", border: "rgba(168, 85, 247, 0.25)", text: "#c084fc" },
  { bg: "rgba(14, 165, 233, 0.06)", border: "rgba(14, 165, 233, 0.25)", text: "#38bdf8" },
  { bg: "rgba(236, 72, 153, 0.06)", border: "rgba(236, 72, 153, 0.25)", text: "#f472b6" },
  { bg: "rgba(20, 184, 166, 0.06)", border: "rgba(20, 184, 166, 0.25)", text: "#2dd4bf" },
];

function computeLayout(
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
  communities: GraphCommunity[]
): { nodes: Node[]; edges: Edge[] } {
  const labelToComm: Map<string, GraphCommunity> = new Map();
  for (const c of communities) labelToComm.set(c.label, c);

  // Group nodes by community
  const communityGroups: Map<string, GraphNode[]> = new Map();
  const ungrouped: GraphNode[] = [];
  for (const node of graphNodes) {
    const label = node.community_id || node.community;
    if (label && labelToComm.has(label)) {
      const group = communityGroups.get(label) || [];
      group.push(node);
      communityGroups.set(label, group);
    } else {
      ungrouped.push(node);
    }
  }

  const activeGroups = new Map<string, GraphNode[]>();
  for (const [label, nodes] of communityGroups) {
    if (nodes.length >= 2) {
      activeGroups.set(label, nodes);
    } else {
      ungrouped.push(...nodes);
    }
  }

  // Dagre layout
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80, marginx: 40, marginy: 40 });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const NODE_W = 200;
  const NODE_H = 60;

  for (const node of graphNodes) {
    dagreGraph.setNode(node.id, { width: NODE_W, height: NODE_H });
  }

  const validEdges = graphEdges.filter((e) => e.source !== e.target && e.kind === "CALLS");
  for (const edge of validEdges) {
    dagreGraph.setEdge(edge.source, edge.target, { weight: edge.weight });
  }

  dagre.layout(dagreGraph);

  const positions: Map<string, { x: number; y: number }> = new Map();
  for (const node of graphNodes) {
    const dn = dagreGraph.node(node.id);
    positions.set(node.id, { x: dn.x - NODE_W / 2, y: dn.y - NODE_H / 2 });
  }

  // Build nodes with group containers
  const layoutNodes: Node[] = [];
  const PAD = 30;
  const HEADER = 28;
  let groupIdx = 0;

  for (const [label, groupNodes] of activeGroups) {
    const comm = labelToComm.get(label)!;
    const groupId = `group-${comm.id}`;
    const color = GROUP_COLORS[groupIdx % GROUP_COLORS.length];
    groupIdx++;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of groupNodes) {
      const pos = positions.get(n.id)!;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + NODE_W);
      maxY = Math.max(maxY, pos.y + NODE_H);
    }

    const groupX = minX - PAD;
    const groupY = minY - PAD - HEADER;
    const groupW = maxX - minX + 2 * PAD;
    const groupH = maxY - minY + 2 * PAD + HEADER;

    layoutNodes.push({
      id: groupId,
      type: "communityGroup",
      position: { x: groupX, y: groupY },
      data: { label: comm.label, color: color.text },
      draggable: false,
      selectable: false,
      focusable: false,
      style: {
        width: groupW,
        height: groupH,
        background: color.bg,
        border: `1px dashed ${color.border}`,
        borderRadius: "10px",
        pointerEvents: "none" as const,
      },
    } as Node);

    for (const node of groupNodes) {
      const pos = positions.get(node.id)!;
      layoutNodes.push({
        id: node.id,
        data: {
          label: node.name,
          kind: node.kind,
          symbol_kind_display: node.symbol_kind_display,
          color: node.color,
          file: node.file,
          line: node.line,
          signature: node.signature,
          is_entry_point: node.is_entry_point,
          community_id: node.community_id,
          cross_community_edges: node.cross_community_edges,
        } as SchematicNodeData,
        position: { x: pos.x - groupX, y: pos.y - groupY },
        type: "schematic",
        parentId: groupId,
        extent: "parent" as const,
      } as Node);
    }
  }

  for (const node of ungrouped) {
    const pos = positions.get(node.id)!;
    layoutNodes.push({
      id: node.id,
      data: {
        label: node.name,
        kind: node.kind,
        symbol_kind_display: node.symbol_kind_display,
        color: node.color,
        file: node.file,
        line: node.line,
        signature: node.signature,
        is_entry_point: node.is_entry_point,
        community_id: node.community_id,
        cross_community_edges: node.cross_community_edges,
      } as SchematicNodeData,
      position: pos,
      type: "schematic",
    } as Node);
  }

  const layoutEdges: Edge[] = validEdges.map((edge, idx) => ({
    id: `${edge.source}-${edge.target}-${idx}`,
    source: edge.source,
    target: edge.target,
    data: {
      label: edge.edge_type_display,
      edge_type_display: edge.edge_type_display,
      weight: edge.weight,
    } as SchematicEdgeData,
    type: "schematic",
    animated: edge.weight > 1.5,
  }));

  return { nodes: layoutNodes, edges: layoutEdges };
}

export default function SchematicCanvas({
  nodes: graphNodes,
  edges: graphEdges,
  communities,
  onNodeSelect,
  onEdgeSelect,
}: SchematicCanvasProps) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => computeLayout(graphNodes, graphEdges, communities),
    [graphNodes, graphEdges, communities]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.15 });
    }, 50);
    return () => clearTimeout(timer);
  }, [fitView, layoutedNodes]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === "communityGroup") return;
      const originalNode = graphNodes.find((n) => n.id === node.id);
      if (originalNode && onNodeSelect) {
        onNodeSelect(originalNode);
      }
    },
    [graphNodes, onNodeSelect]
  );

  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const originalEdge = graphEdges.find(
        (e) => e.source === edge.source && e.target === edge.target
      );
      if (originalEdge && onEdgeSelect) {
        onEdgeSelect(originalEdge);
      }
    },
    [graphEdges, onEdgeSelect]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes as any}
      edgeTypes={edgeTypes as any}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      fitView
      minZoom={0.1}
      maxZoom={2}
    >
      <Background color="#334155" gap={12} size={1} />
      <Controls />
    </ReactFlow>
  );
}
