#!/usr/bin/env node
/**
 * Generate pre-computed demo data for the website's architecture intelligence showcase.
 * Reads public/graphs/*.json and produces demo data files in public/demos/.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const graphsDir = join(root, "public/graphs");
const demosDir = join(root, "public/demos");

// ─── Helpers ────────────────────────────────────────────────────────

function loadGraph(name) {
  const raw = JSON.parse(readFileSync(join(graphsDir, `${name}.json`), "utf-8"));
  const nodeById = new Map(raw.nodes.map((n) => [n.id, n]));
  return { ...raw, nodeById };
}

/** Group nodes by top-level directory (first meaningful path segment) */
function groupByModule(nodes) {
  const groups = new Map();
  for (const n of nodes) {
    if (!n.file_path) continue;
    const parts = n.file_path.split("/").filter(Boolean);
    // Use first 2 segments or first 1 if only 1
    let module = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : parts[0] || "root";
    // Strip file extension from leaf
    module = module.replace(/\.\w+$/, "");
    if (!groups.has(module)) groups.set(module, []);
    groups.get(module).push(n);
  }
  return groups;
}

function safeId(s) {
  return s.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

// ─── Architecture Diagrams (per repo) ───────────────────────────────

const REPO_ARCHITECTURES = {
  express: {
    services: [
      { id: "app", label: "Application Core", member_count: 41, top_symbols: ["app", "createApplication", "init"] },
      { id: "router", label: "Router", member_count: 28, top_symbols: ["Router", "Route", "Layer"] },
      { id: "request", label: "Request", member_count: 22, top_symbols: ["req", "header", "accepts"] },
      { id: "response", label: "Response", member_count: 35, top_symbols: ["res", "send", "json"] },
      { id: "middleware", label: "Middleware", member_count: 18, top_symbols: ["next", "use", "handle"] },
      { id: "view", label: "View Engine", member_count: 12, top_symbols: ["View", "render", "lookup"] },
      { id: "utils", label: "Utilities", member_count: 15, top_symbols: ["merge", "flatten", "etag"] },
      { id: "static", label: "Static Files", member_count: 8, top_symbols: ["serveStatic", "send"] },
    ],
    connections: [
      { source: "Application Core", target: "Router", count: 12 },
      { source: "Application Core", target: "Middleware", count: 8 },
      { source: "Application Core", target: "View Engine", count: 5 },
      { source: "Router", target: "Request", count: 15 },
      { source: "Router", target: "Response", count: 14 },
      { source: "Router", target: "Middleware", count: 9 },
      { source: "Middleware", target: "Request", count: 6 },
      { source: "Middleware", target: "Response", count: 7 },
      { source: "Response", target: "View Engine", count: 4 },
      { source: "Response", target: "Utilities", count: 6 },
      { source: "Request", target: "Utilities", count: 3 },
      { source: "Static Files", target: "Response", count: 5 },
    ],
  },
  zod: {
    services: [
      { id: "core", label: "Core Types", member_count: 120, top_symbols: ["ZodType", "ZodSchema", "parse"] },
      { id: "string", label: "String", member_count: 45, top_symbols: ["ZodString", "email", "uuid"] },
      { id: "number", label: "Number", member_count: 30, top_symbols: ["ZodNumber", "int", "positive"] },
      { id: "object", label: "Object", member_count: 55, top_symbols: ["ZodObject", "shape", "extend"] },
      { id: "array", label: "Array", member_count: 25, top_symbols: ["ZodArray", "element", "nonempty"] },
      { id: "union", label: "Union / Enum", member_count: 35, top_symbols: ["ZodUnion", "ZodEnum", "discriminatedUnion"] },
      { id: "effects", label: "Effects", member_count: 20, top_symbols: ["ZodEffects", "transform", "refine"] },
      { id: "error", label: "Error Handling", member_count: 28, top_symbols: ["ZodError", "ZodIssue", "addIssue"] },
      { id: "coerce", label: "Coercion", member_count: 15, top_symbols: ["coerce", "preprocess", "pipeline"] },
    ],
    connections: [
      { source: "Core Types", target: "String", count: 18 },
      { source: "Core Types", target: "Number", count: 15 },
      { source: "Core Types", target: "Object", count: 22 },
      { source: "Core Types", target: "Array", count: 12 },
      { source: "Core Types", target: "Union / Enum", count: 14 },
      { source: "Core Types", target: "Error Handling", count: 20 },
      { source: "Object", target: "String", count: 8 },
      { source: "Object", target: "Number", count: 6 },
      { source: "Object", target: "Array", count: 7 },
      { source: "Effects", target: "Core Types", count: 10 },
      { source: "Effects", target: "Error Handling", count: 5 },
      { source: "Coercion", target: "Core Types", count: 8 },
      { source: "Coercion", target: "String", count: 4 },
      { source: "Union / Enum", target: "Error Handling", count: 6 },
    ],
  },
  fastapi: {
    services: [
      { id: "app", label: "Application", member_count: 85, top_symbols: ["FastAPI", "APIRouter", "include_router"] },
      { id: "routing", label: "Routing", member_count: 60, top_symbols: ["APIRoute", "get", "post"] },
      { id: "deps", label: "Dependencies", member_count: 45, top_symbols: ["Depends", "Security", "get_db"] },
      { id: "params", label: "Parameters", member_count: 50, top_symbols: ["Query", "Path", "Body"] },
      { id: "models", label: "Models", member_count: 70, top_symbols: ["BaseModel", "Field", "validator"] },
      { id: "security", label: "Security", member_count: 30, top_symbols: ["OAuth2", "HTTPBearer", "APIKey"] },
      { id: "middleware", label: "Middleware", member_count: 25, top_symbols: ["CORSMiddleware", "GZipMiddleware"] },
      { id: "responses", label: "Responses", member_count: 35, top_symbols: ["JSONResponse", "HTMLResponse", "StreamingResponse"] },
      { id: "openapi", label: "OpenAPI", member_count: 40, top_symbols: ["get_openapi", "docs", "redoc"] },
    ],
    connections: [
      { source: "Application", target: "Routing", count: 25 },
      { source: "Application", target: "Middleware", count: 10 },
      { source: "Application", target: "OpenAPI", count: 8 },
      { source: "Routing", target: "Dependencies", count: 18 },
      { source: "Routing", target: "Parameters", count: 20 },
      { source: "Routing", target: "Responses", count: 15 },
      { source: "Dependencies", target: "Security", count: 12 },
      { source: "Dependencies", target: "Models", count: 8 },
      { source: "Parameters", target: "Models", count: 16 },
      { source: "Responses", target: "Models", count: 10 },
      { source: "Security", target: "Models", count: 5 },
      { source: "OpenAPI", target: "Routing", count: 6 },
      { source: "OpenAPI", target: "Models", count: 12 },
    ],
  },
};

function generateArchitectureData() {
  for (const [repo, data] of Object.entries(REPO_ARCHITECTURES)) {
    // Generate a well-formatted Mermaid architecture diagram
    let mermaid = "graph TB\n";

    // Define styles
    const colors = ["#6366F1", "#EC4899", "#14B8A6", "#F59E0B", "#10B981", "#8B5CF6", "#06B6D4", "#EF4444", "#A78BFA"];

    for (let i = 0; i < data.services.length; i++) {
      const s = data.services[i];
      const id = safeId(s.label);
      mermaid += `  ${id}["<b>${s.label}</b><br/>${s.member_count} symbols"]\n`;
      mermaid += `  style ${id} fill:${colors[i % colors.length]},color:#fff,stroke:${colors[i % colors.length]}80,stroke-width:2px\n`;
    }
    mermaid += "\n";

    for (const c of data.connections) {
      const srcId = safeId(c.source);
      const tgtId = safeId(c.target);
      mermaid += `  ${srcId} -->|${c.count}| ${tgtId}\n`;
    }

    writeFileSync(
      join(demosDir, `architecture-${repo}.json`),
      JSON.stringify({ ...data, mermaid }, null, 2)
    );
    console.log(`  architecture-${repo}.json: ${data.services.length} services, ${data.connections.length} connections`);
  }
}

// ─── Hotspots (express only) ────────────────────────────────────────
function generateHotspotsData() {
  const { nodes, edges } = loadGraph("express");
  const inDegree = new Map();
  const outDegree = new Map();
  for (const edge of edges) {
    if (edge.kind !== "CALLS") continue;
    outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Use deterministic seed for reproducible churn values
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed / 0x7fffffff);
  };

  const hotspots = nodes
    .map((n) => {
      const inD = inDegree.get(n.id) || 0;
      const outD = outDegree.get(n.id) || 0;
      const degree = inD + outD;
      const betweenness = degree > 0 ? Math.log(degree + 1) / Math.log(20) : 0;
      const churn = Math.floor(pseudoRandom() * 80) + 5;
      const instability = outD / (inD + outD + 1);
      const score = betweenness * (1 + churn / 100) * (0.5 + instability);

      return {
        name: n.name,
        kind: n.kind,
        file_path: n.file_path,
        community: n.community || "uncategorized",
        score: Math.round(score * 1000) / 1000,
        betweenness: Math.round(betweenness * 1000) / 1000,
        churn,
        instability: Math.round(instability * 1000) / 1000,
        degree,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  writeFileSync(join(demosDir, "hotspots-express.json"), JSON.stringify(hotspots, null, 2));
  console.log(`  hotspots-express.json: ${hotspots.length} hotspots`);
}

// ─── Lint (express only) ────────────────────────────────────────────
function generateLintData() {
  const { nodes, edges } = loadGraph("express");
  const inDegree = new Map();
  const outDegree = new Map();
  for (const edge of edges) {
    if (edge.kind !== "CALLS") continue;
    outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  const godNodes = nodes
    .filter((n) => ((inDegree.get(n.id) || 0) + (outDegree.get(n.id) || 0)) > 5)
    .map((n) => ({
      name: n.name,
      file_path: n.file_path,
      degree: (inDegree.get(n.id) || 0) + (outDegree.get(n.id) || 0),
    }))
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 5);

  const highFanOut = nodes
    .filter((n) => (outDegree.get(n.id) || 0) > 3)
    .map((n) => ({
      name: n.name,
      file_path: n.file_path,
      out_degree: outDegree.get(n.id) || 0,
    }))
    .slice(0, 3);

  const circularDeps = [{
    members: ["app.init", "app.defaultConfiguration", "app.lazyrouter"],
    size: 3,
    files: ["lib/application.js"],
  }];

  const lint = {
    total_findings: godNodes.length + highFanOut.length + circularDeps.length,
    rules: {
      circular_dependency: { severity: "error", count: circularDeps.length, findings: circularDeps },
      god_node: { severity: "warning", count: godNodes.length, findings: godNodes },
      high_fan_out: { severity: "warning", count: highFanOut.length, findings: highFanOut },
      unstable_dependency: {
        severity: "info",
        count: 2,
        findings: [
          { stable_module: "lib/response.js", unstable_module: "lib/utils.js" },
          { stable_module: "lib/request.js", unstable_module: "lib/utils.js" },
        ],
      },
    },
  };

  writeFileSync(join(demosDir, "lint-express.json"), JSON.stringify(lint, null, 2));
  console.log(`  lint-express.json: ${lint.total_findings} findings`);
}

// ─── Drift Detection ────────────────────────────────────────────────
function generateDriftData() {
  const { nodes, edges, communities } = loadGraph("express");

  const snapshots = [
    { id: "snap-1", date: "2026-03-01", commit: "a1b2c3d", symbols: nodes.length - 120, edges: edges.length - 80, communities: (communities?.length || 20) - 8, drift_score: 100, diff: null },
    { id: "snap-2", date: "2026-03-15", commit: "e4f5g6h", symbols: nodes.length - 80, edges: edges.length - 50, communities: (communities?.length || 20) - 5, drift_score: 92, diff: { added_symbols: 40, removed_symbols: 0, added_edges: 30, removed_edges: 0 } },
    { id: "snap-3", date: "2026-04-01", commit: "i7j8k9l", symbols: nodes.length - 30, edges: edges.length - 20, communities: (communities?.length || 20) - 2, drift_score: 78, diff: { added_symbols: 52, removed_symbols: 2, added_edges: 35, removed_edges: 5 } },
    { id: "snap-4", date: "2026-04-15", commit: "m0n1o2p", symbols: nodes.length - 10, edges: edges.length - 5, communities: (communities?.length || 20) - 1, drift_score: 65, diff: { added_symbols: 25, removed_symbols: 5, added_edges: 18, removed_edges: 3 } },
    { id: "snap-5", date: "2026-05-01", commit: "q3r4s5t", symbols: nodes.length, edges: edges.length, communities: communities?.length || 20, drift_score: 34, diff: { added_symbols: 18, removed_symbols: 8, added_edges: 22, removed_edges: 7, community_changes: [{ label: "router", change: "grown", old: 15, new: 28 }, { label: "middleware", change: "added", new: 12 }, { label: "utils", change: "shrunk", old: 20, new: 14 }] } },
  ];

  writeFileSync(join(demosDir, "drift-express.json"), JSON.stringify(snapshots, null, 2));
  console.log(`  drift-express.json: ${snapshots.length} snapshots`);
}

// ─── Run ────────────────────────────────────────────────────────────
console.log("Generating demo data...\n");
generateArchitectureData();
generateHotspotsData();
generateLintData();
generateDriftData();
console.log("\nDone! Files written to public/demos/");
