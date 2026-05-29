/**
 * Type definitions for the 2D schematic view.
 * Matches the backend API response structures from Phase 1.
 */

export interface GraphNode {
  id: string;
  name: string;
  kind: string;
  symbol_kind_display: string;
  file: string;
  line: number;
  signature: string;
  community: string;
  community_id: string | null;
  depth: number;
  color: string;
  cross_community_edges: number;
  is_entry_point: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  kind: string;
  edge_type_display: string;
  weight: number;
}

export interface GraphCommunity {
  id: string;
  label: string;
  member_count: number;
  symbol_ids: string[];
  internal_edge_count: number;
  external_edge_count: number;
}

export interface ProcessCluster {
  id: string;
  name: string;
  entry_point_id: string;
  step_ids: string[];
  description: string;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  communities: GraphCommunity[];
  processes: ProcessCluster[];
}

export interface ProcessResponse {
  processes: ProcessCluster[];
}

// --- Graph API v1 types (embedding-based visualization) ---

export interface ClusterSymbolSummary {
  id: string;
  name: string;
  kind: string;
}

export interface ClusterEdge {
  target: string;
  weight: number;
}

export interface Cluster {
  id: string;
  label: string;
  size: number;
  x: number;
  y: number;
  color: string;
  top_symbols: ClusterSymbolSummary[];
  edges: ClusterEdge[];
}

export interface GraphOverviewResponse {
  clusters: Cluster[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface NodeNeighbor {
  id: string;
  name: string;
  kind: string;
  relationship: string;
  direction: string;
}

export interface SemanticNeighbor {
  id: string;
  name: string;
  kind: string;
  similarity: number;
}

export interface NodeDetailResponse {
  id: string;
  name: string;
  kind: string;
  symbol_kind_display: string;
  file: string;
  line: number;
  end_line: number;
  signature: string;
  community: string;
  color: string;
  depth: number;
  is_entry_point: boolean;
  neighbors: NodeNeighbor[];
  semantic_neighbors: SemanticNeighbor[];
}

export interface GraphSearchResult {
  id: string;
  name: string;
  kind: string;
  file: string;
  line: number;
  score: number;
}

export interface GraphSearchResponse {
  query: string;
  results: GraphSearchResult[];
}

/**
 * React Flow node data type for schematic visualization.
 * Must extend Record<string, unknown> for React Flow compatibility.
 */
export interface SchematicNodeData extends Record<string, unknown> {
  label: string;
  kind: string;
  symbol_kind_display: string;
  color: string;
  file: string;
  line: number;
  signature: string;
  is_entry_point: boolean;
  community_id: string | null;
  cross_community_edges: number;
}

/**
 * React Flow edge data type for schematic visualization.
 * Must extend Record<string, unknown> for React Flow compatibility.
 */
export interface SchematicEdgeData extends Record<string, unknown> {
  label: string;
  edge_type_display: string;
  weight: number;
}
