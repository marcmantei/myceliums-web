"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

/* ──────────────────────────────────────
   Domain types
   ────────────────────────────────────── */

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  kind: "function" | "class" | "interface" | "module" | "type";
  community: number;
  centrality: number;
  inCycle: boolean;
  file: string;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  relation: string;
  inCycle: boolean;
}

/* ──────────────────────────────────────
   Community palette & kind shapes
   ────────────────────────────────────── */

const COMMUNITY_COLORS = [
  "#6366F1", // indigo  — Auth
  "#10B981", // emerald — API
  "#F59E0B", // amber   — Storage
  "#EC4899", // pink    — UI
  "#06B6D4", // cyan    — Config
  "#8B5CF6", // violet  — Events
];

const KIND_SHAPES: Record<string, string> = {
  function: "circle",
  class: "square",
  interface: "diamond",
  module: "hexagon",
  type: "triangle",
};

/* ──────────────────────────────────────
   Codebase graph datasets
   ────────────────────────────────────── */

interface CodebaseDataset {
  label: string;
  repo: string;
  communityLabels: string[];
  nodes: SimNode[];
  links: SimLink[];
}

const DATASETS: CodebaseDataset[] = [
  {
    label: "FastAPI",
    repo: "fastapi/fastapi",
    communityLabels: ["Routing", "Dependencies", "Security", "Middleware", "Responses", "OpenAPI"],
    nodes: [
      { id: "fa-FastAPI", label: "FastAPI", kind: "class", community: 0, centrality: 0.95, inCycle: false, file: "fastapi/applications.py" },
      { id: "fa-APIRouter", label: "APIRouter", kind: "class", community: 0, centrality: 0.88, inCycle: false, file: "fastapi/routing.py" },
      { id: "fa-add_api_route", label: "add_api_route", kind: "function", community: 0, centrality: 0.72, inCycle: false, file: "fastapi/routing.py" },
      { id: "fa-APIRoute", label: "APIRoute", kind: "class", community: 0, centrality: 0.65, inCycle: false, file: "fastapi/routing.py" },
      { id: "fa-get_request_handler", label: "get_request_handler", kind: "function", community: 0, centrality: 0.78, inCycle: true, file: "fastapi/routing.py" },
      { id: "fa-Depends", label: "Depends", kind: "class", community: 1, centrality: 0.91, inCycle: false, file: "fastapi/params.py" },
      { id: "fa-solve_dependencies", label: "solve_dependencies", kind: "function", community: 1, centrality: 0.85, inCycle: true, file: "fastapi/dependencies/utils.py" },
      { id: "fa-get_dependant", label: "get_dependant", kind: "function", community: 1, centrality: 0.70, inCycle: true, file: "fastapi/dependencies/utils.py" },
      { id: "fa-Dependant", label: "Dependant", kind: "class", community: 1, centrality: 0.62, inCycle: false, file: "fastapi/dependencies/models.py" },
      { id: "fa-SecurityScopes", label: "SecurityScopes", kind: "class", community: 2, centrality: 0.55, inCycle: false, file: "fastapi/security/base.py" },
      { id: "fa-OAuth2", label: "OAuth2PasswordBearer", kind: "class", community: 2, centrality: 0.68, inCycle: false, file: "fastapi/security/oauth2.py" },
      { id: "fa-HTTPBearer", label: "HTTPBearer", kind: "class", community: 2, centrality: 0.48, inCycle: false, file: "fastapi/security/http.py" },
      { id: "fa-APIKeyHeader", label: "APIKeyHeader", kind: "class", community: 2, centrality: 0.42, inCycle: false, file: "fastapi/security/api_key.py" },
      { id: "fa-RequestValidationError", label: "RequestValidationError", kind: "class", community: 3, centrality: 0.58, inCycle: false, file: "fastapi/exceptions.py" },
      { id: "fa-request_validation_handler", label: "request_validation_handler", kind: "function", community: 3, centrality: 0.52, inCycle: false, file: "fastapi/exception_handlers.py" },
      { id: "fa-run_endpoint_function", label: "run_endpoint_function", kind: "function", community: 3, centrality: 0.60, inCycle: true, file: "fastapi/routing.py" },
      { id: "fa-JSONResponse", label: "JSONResponse", kind: "class", community: 4, centrality: 0.50, inCycle: false, file: "fastapi/responses.py" },
      { id: "fa-ORJSONResponse", label: "ORJSONResponse", kind: "class", community: 4, centrality: 0.35, inCycle: false, file: "fastapi/responses.py" },
      { id: "fa-Response", label: "Response", kind: "interface", community: 4, centrality: 0.45, inCycle: false, file: "starlette/responses.py" },
      { id: "fa-get_openapi", label: "get_openapi", kind: "function", community: 5, centrality: 0.75, inCycle: false, file: "fastapi/openapi/utils.py" },
      { id: "fa-get_openapi_path", label: "get_openapi_path", kind: "function", community: 5, centrality: 0.62, inCycle: false, file: "fastapi/openapi/utils.py" },
      { id: "fa-get_flat_models", label: "get_flat_models", kind: "function", community: 5, centrality: 0.55, inCycle: false, file: "fastapi/utils.py" },
      { id: "fa-ModelField", label: "ModelField", kind: "class", community: 5, centrality: 0.48, inCycle: false, file: "fastapi/openapi/models.py" },
    ],
    links: [
      { source: "fa-FastAPI", target: "fa-APIRouter", relation: "extends", inCycle: false },
      { source: "fa-APIRouter", target: "fa-add_api_route", relation: "calls", inCycle: false },
      { source: "fa-add_api_route", target: "fa-APIRoute", relation: "creates", inCycle: false },
      { source: "fa-APIRoute", target: "fa-get_request_handler", relation: "calls", inCycle: false },
      { source: "fa-get_request_handler", target: "fa-solve_dependencies", relation: "calls", inCycle: false },
      { source: "fa-solve_dependencies", target: "fa-get_dependant", relation: "calls", inCycle: true },
      { source: "fa-get_dependant", target: "fa-Dependant", relation: "creates", inCycle: false },
      { source: "fa-get_dependant", target: "fa-solve_dependencies", relation: "recurses", inCycle: true },
      { source: "fa-Depends", target: "fa-solve_dependencies", relation: "triggers", inCycle: false },
      { source: "fa-Dependant", target: "fa-Depends", relation: "wraps", inCycle: false },
      { source: "fa-OAuth2", target: "fa-SecurityScopes", relation: "uses", inCycle: false },
      { source: "fa-HTTPBearer", target: "fa-SecurityScopes", relation: "uses", inCycle: false },
      { source: "fa-APIKeyHeader", target: "fa-SecurityScopes", relation: "uses", inCycle: false },
      { source: "fa-solve_dependencies", target: "fa-OAuth2", relation: "resolves", inCycle: false },
      { source: "fa-get_request_handler", target: "fa-run_endpoint_function", relation: "calls", inCycle: true },
      { source: "fa-run_endpoint_function", target: "fa-get_request_handler", relation: "returns_to", inCycle: true },
      { source: "fa-run_endpoint_function", target: "fa-RequestValidationError", relation: "throws", inCycle: false },
      { source: "fa-RequestValidationError", target: "fa-request_validation_handler", relation: "handled_by", inCycle: false },
      { source: "fa-request_validation_handler", target: "fa-JSONResponse", relation: "returns", inCycle: false },
      { source: "fa-JSONResponse", target: "fa-Response", relation: "extends", inCycle: false },
      { source: "fa-ORJSONResponse", target: "fa-Response", relation: "extends", inCycle: false },
      { source: "fa-FastAPI", target: "fa-get_openapi", relation: "calls", inCycle: false },
      { source: "fa-get_openapi", target: "fa-get_openapi_path", relation: "calls", inCycle: false },
      { source: "fa-get_openapi_path", target: "fa-get_flat_models", relation: "calls", inCycle: false },
      { source: "fa-get_flat_models", target: "fa-ModelField", relation: "reads", inCycle: false },
      { source: "fa-get_openapi_path", target: "fa-APIRoute", relation: "reads", inCycle: false },
      { source: "fa-FastAPI", target: "fa-request_validation_handler", relation: "registers", inCycle: false },
      { source: "fa-solve_dependencies", target: "fa-RequestValidationError", relation: "throws", inCycle: false },
    ],
  },
  {
    label: "Express",
    repo: "expressjs/express",
    communityLabels: ["App", "Router", "Middleware", "Request", "Response", "View"],
    nodes: [
      { id: "ex-createApp", label: "createApplication", kind: "function", community: 0, centrality: 0.95, inCycle: false, file: "lib/express.js" },
      { id: "ex-app.init", label: "app.init", kind: "function", community: 0, centrality: 0.72, inCycle: false, file: "lib/application.js" },
      { id: "ex-app.listen", label: "app.listen", kind: "function", community: 0, centrality: 0.55, inCycle: false, file: "lib/application.js" },
      { id: "ex-app.set", label: "app.set", kind: "function", community: 0, centrality: 0.48, inCycle: false, file: "lib/application.js" },
      { id: "ex-app.use", label: "app.use", kind: "function", community: 0, centrality: 0.88, inCycle: false, file: "lib/application.js" },
      { id: "ex-Router", label: "Router", kind: "class", community: 1, centrality: 0.92, inCycle: true, file: "lib/router/index.js" },
      { id: "ex-Route", label: "Route", kind: "class", community: 1, centrality: 0.80, inCycle: false, file: "lib/router/route.js" },
      { id: "ex-Layer", label: "Layer", kind: "class", community: 1, centrality: 0.75, inCycle: false, file: "lib/router/layer.js" },
      { id: "ex-router.handle", label: "router.handle", kind: "function", community: 1, centrality: 0.85, inCycle: true, file: "lib/router/index.js" },
      { id: "ex-processParams", label: "processParams", kind: "function", community: 1, centrality: 0.60, inCycle: true, file: "lib/router/index.js" },
      { id: "ex-next", label: "next", kind: "function", community: 2, centrality: 0.90, inCycle: true, file: "lib/router/index.js" },
      { id: "ex-query", label: "query", kind: "function", community: 2, centrality: 0.45, inCycle: false, file: "lib/middleware/query.js" },
      { id: "ex-init", label: "init", kind: "function", community: 2, centrality: 0.50, inCycle: false, file: "lib/middleware/init.js" },
      { id: "ex-serveStatic", label: "serveStatic", kind: "function", community: 2, centrality: 0.42, inCycle: false, file: "lib/utils.js" },
      { id: "ex-req", label: "req", kind: "module", community: 3, centrality: 0.78, inCycle: false, file: "lib/request.js" },
      { id: "ex-req.get", label: "req.get", kind: "function", community: 3, centrality: 0.52, inCycle: false, file: "lib/request.js" },
      { id: "ex-req.accepts", label: "req.accepts", kind: "function", community: 3, centrality: 0.48, inCycle: false, file: "lib/request.js" },
      { id: "ex-req.param", label: "req.param", kind: "function", community: 3, centrality: 0.55, inCycle: false, file: "lib/request.js" },
      { id: "ex-res", label: "res", kind: "module", community: 4, centrality: 0.82, inCycle: false, file: "lib/response.js" },
      { id: "ex-res.send", label: "res.send", kind: "function", community: 4, centrality: 0.75, inCycle: false, file: "lib/response.js" },
      { id: "ex-res.json", label: "res.json", kind: "function", community: 4, centrality: 0.70, inCycle: false, file: "lib/response.js" },
      { id: "ex-res.render", label: "res.render", kind: "function", community: 4, centrality: 0.62, inCycle: false, file: "lib/response.js" },
      { id: "ex-res.redirect", label: "res.redirect", kind: "function", community: 4, centrality: 0.50, inCycle: false, file: "lib/response.js" },
      { id: "ex-View", label: "View", kind: "class", community: 5, centrality: 0.58, inCycle: false, file: "lib/view.js" },
      { id: "ex-View.render", label: "View.render", kind: "function", community: 5, centrality: 0.52, inCycle: false, file: "lib/view.js" },
      { id: "ex-View.lookup", label: "View.lookup", kind: "function", community: 5, centrality: 0.40, inCycle: false, file: "lib/view.js" },
    ],
    links: [
      { source: "ex-createApp", target: "ex-app.init", relation: "calls", inCycle: false },
      { source: "ex-createApp", target: "ex-req", relation: "mixes_in", inCycle: false },
      { source: "ex-createApp", target: "ex-res", relation: "mixes_in", inCycle: false },
      { source: "ex-app.init", target: "ex-app.set", relation: "calls", inCycle: false },
      { source: "ex-app.use", target: "ex-Router", relation: "delegates", inCycle: false },
      { source: "ex-Router", target: "ex-Route", relation: "creates", inCycle: false },
      { source: "ex-Route", target: "ex-Layer", relation: "creates", inCycle: false },
      { source: "ex-Router", target: "ex-router.handle", relation: "calls", inCycle: true },
      { source: "ex-router.handle", target: "ex-next", relation: "calls", inCycle: true },
      { source: "ex-next", target: "ex-Layer", relation: "matches", inCycle: false },
      { source: "ex-next", target: "ex-router.handle", relation: "recurses", inCycle: true },
      { source: "ex-router.handle", target: "ex-processParams", relation: "calls", inCycle: true },
      { source: "ex-processParams", target: "ex-next", relation: "calls", inCycle: true },
      { source: "ex-app.init", target: "ex-query", relation: "mounts", inCycle: false },
      { source: "ex-app.init", target: "ex-init", relation: "mounts", inCycle: false },
      { source: "ex-req", target: "ex-req.get", relation: "defines", inCycle: false },
      { source: "ex-req", target: "ex-req.accepts", relation: "defines", inCycle: false },
      { source: "ex-req", target: "ex-req.param", relation: "defines", inCycle: false },
      { source: "ex-res", target: "ex-res.send", relation: "defines", inCycle: false },
      { source: "ex-res", target: "ex-res.json", relation: "defines", inCycle: false },
      { source: "ex-res", target: "ex-res.render", relation: "defines", inCycle: false },
      { source: "ex-res", target: "ex-res.redirect", relation: "defines", inCycle: false },
      { source: "ex-res.json", target: "ex-res.send", relation: "calls", inCycle: false },
      { source: "ex-res.render", target: "ex-View", relation: "creates", inCycle: false },
      { source: "ex-View", target: "ex-View.render", relation: "calls", inCycle: false },
      { source: "ex-View", target: "ex-View.lookup", relation: "calls", inCycle: false },
      { source: "ex-app.listen", target: "ex-createApp", relation: "refs", inCycle: false },
      { source: "ex-Route", target: "ex-next", relation: "calls", inCycle: false },
      { source: "ex-init", target: "ex-req", relation: "extends", inCycle: false },
      { source: "ex-init", target: "ex-res", relation: "extends", inCycle: false },
    ],
  },
  {
    label: "Zod",
    repo: "colinhacks/zod",
    communityLabels: ["Core Types", "Primitives", "Composites", "Parsing", "Errors", "Transforms"],
    nodes: [
      { id: "zd-ZodType", label: "ZodType", kind: "class", community: 0, centrality: 0.98, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodSchema", label: "ZodSchema", kind: "type", community: 0, centrality: 0.60, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodTypeDef", label: "ZodTypeDef", kind: "interface", community: 0, centrality: 0.55, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodString", label: "ZodString", kind: "class", community: 1, centrality: 0.82, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodNumber", label: "ZodNumber", kind: "class", community: 1, centrality: 0.78, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodBoolean", label: "ZodBoolean", kind: "class", community: 1, centrality: 0.50, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodDate", label: "ZodDate", kind: "class", community: 1, centrality: 0.45, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodEnum", label: "ZodEnum", kind: "class", community: 1, centrality: 0.55, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodLiteral", label: "ZodLiteral", kind: "class", community: 1, centrality: 0.42, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodObject", label: "ZodObject", kind: "class", community: 2, centrality: 0.92, inCycle: true, file: "src/types.ts" },
      { id: "zd-ZodArray", label: "ZodArray", kind: "class", community: 2, centrality: 0.75, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodUnion", label: "ZodUnion", kind: "class", community: 2, centrality: 0.70, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodDiscUnion", label: "ZodDiscriminatedUnion", kind: "class", community: 2, centrality: 0.65, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodTuple", label: "ZodTuple", kind: "class", community: 2, centrality: 0.52, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodIntersection", label: "ZodIntersection", kind: "class", community: 2, centrality: 0.58, inCycle: true, file: "src/types.ts" },
      { id: "zd-parse", label: "_parse", kind: "function", community: 3, centrality: 0.90, inCycle: true, file: "src/types.ts" },
      { id: "zd-safeParse", label: "safeParse", kind: "function", community: 3, centrality: 0.85, inCycle: false, file: "src/types.ts" },
      { id: "zd-parseAsync", label: "parseAsync", kind: "function", community: 3, centrality: 0.72, inCycle: false, file: "src/types.ts" },
      { id: "zd-ParseContext", label: "ParseContext", kind: "interface", community: 3, centrality: 0.62, inCycle: true, file: "src/helpers/parseUtil.ts" },
      { id: "zd-handleResult", label: "handleResult", kind: "function", community: 3, centrality: 0.55, inCycle: false, file: "src/types.ts" },
      { id: "zd-ZodError", label: "ZodError", kind: "class", community: 4, centrality: 0.80, inCycle: false, file: "src/ZodError.ts" },
      { id: "zd-ZodIssue", label: "ZodIssue", kind: "type", community: 4, centrality: 0.68, inCycle: false, file: "src/ZodError.ts" },
      { id: "zd-addIssue", label: "addIssueToContext", kind: "function", community: 4, centrality: 0.72, inCycle: false, file: "src/helpers/parseUtil.ts" },
      { id: "zd-errorMap", label: "defaultErrorMap", kind: "function", community: 4, centrality: 0.50, inCycle: false, file: "src/locales/en.ts" },
      { id: "zd-ZodEffects", label: "ZodEffects", kind: "class", community: 5, centrality: 0.70, inCycle: true, file: "src/types.ts" },
      { id: "zd-transform", label: ".transform", kind: "function", community: 5, centrality: 0.65, inCycle: false, file: "src/types.ts" },
      { id: "zd-refine", label: ".refine", kind: "function", community: 5, centrality: 0.62, inCycle: false, file: "src/types.ts" },
      { id: "zd-pipe", label: ".pipe", kind: "function", community: 5, centrality: 0.55, inCycle: true, file: "src/types.ts" },
    ],
    links: [
      { source: "zd-ZodString", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodNumber", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodBoolean", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodDate", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodEnum", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodLiteral", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodObject", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodArray", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodUnion", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodDiscUnion", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodTuple", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodIntersection", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodEffects", target: "zd-ZodType", relation: "extends", inCycle: false },
      { source: "zd-ZodType", target: "zd-ZodTypeDef", relation: "uses", inCycle: false },
      { source: "zd-ZodType", target: "zd-ZodSchema", relation: "implements", inCycle: false },
      { source: "zd-ZodType", target: "zd-parse", relation: "defines", inCycle: false },
      { source: "zd-ZodType", target: "zd-safeParse", relation: "defines", inCycle: false },
      { source: "zd-safeParse", target: "zd-parse", relation: "calls", inCycle: false },
      { source: "zd-parseAsync", target: "zd-parse", relation: "calls", inCycle: false },
      { source: "zd-parse", target: "zd-ParseContext", relation: "creates", inCycle: false },
      { source: "zd-ParseContext", target: "zd-addIssue", relation: "calls", inCycle: false },
      { source: "zd-parse", target: "zd-handleResult", relation: "calls", inCycle: false },
      { source: "zd-handleResult", target: "zd-ZodError", relation: "throws", inCycle: false },
      { source: "zd-ZodError", target: "zd-ZodIssue", relation: "contains", inCycle: false },
      { source: "zd-addIssue", target: "zd-ZodIssue", relation: "creates", inCycle: false },
      { source: "zd-ZodError", target: "zd-errorMap", relation: "uses", inCycle: false },
      { source: "zd-ZodObject", target: "zd-parse", relation: "overrides", inCycle: true },
      { source: "zd-ZodObject", target: "zd-ZodIntersection", relation: "creates_via_and", inCycle: true },
      { source: "zd-ZodIntersection", target: "zd-parse", relation: "overrides", inCycle: true },
      { source: "zd-ZodType", target: "zd-transform", relation: "defines", inCycle: false },
      { source: "zd-ZodType", target: "zd-refine", relation: "defines", inCycle: false },
      { source: "zd-ZodType", target: "zd-pipe", relation: "defines", inCycle: false },
      { source: "zd-transform", target: "zd-ZodEffects", relation: "creates", inCycle: false },
      { source: "zd-refine", target: "zd-ZodEffects", relation: "creates", inCycle: false },
      { source: "zd-ZodEffects", target: "zd-parse", relation: "wraps", inCycle: true },
      { source: "zd-pipe", target: "zd-ZodEffects", relation: "chains", inCycle: true },
      { source: "zd-ZodArray", target: "zd-parse", relation: "overrides", inCycle: false },
      { source: "zd-ZodUnion", target: "zd-parse", relation: "overrides", inCycle: false },
    ],
  },
  {
    label: "React",
    repo: "facebook/react",
    communityLabels: ["Reconciler", "Fiber", "Hooks", "Scheduler", "DOM", "Events"],
    nodes: [
      { id: "re-reconciler", label: "beginWork", kind: "function", community: 0, centrality: 0.95, inCycle: true, file: "packages/react-reconciler/src/ReactFiberBeginWork.js" },
      { id: "re-completeWork", label: "completeWork", kind: "function", community: 0, centrality: 0.88, inCycle: true, file: "packages/react-reconciler/src/ReactFiberCompleteWork.js" },
      { id: "re-commitRoot", label: "commitRoot", kind: "function", community: 0, centrality: 0.82, inCycle: false, file: "packages/react-reconciler/src/ReactFiberCommitWork.js" },
      { id: "re-reconcileChildren", label: "reconcileChildren", kind: "function", community: 0, centrality: 0.78, inCycle: false, file: "packages/react-reconciler/src/ReactChildFiber.js" },
      { id: "re-FiberNode", label: "FiberNode", kind: "class", community: 1, centrality: 0.92, inCycle: false, file: "packages/react-reconciler/src/ReactFiber.js" },
      { id: "re-createFiber", label: "createFiber", kind: "function", community: 1, centrality: 0.75, inCycle: false, file: "packages/react-reconciler/src/ReactFiber.js" },
      { id: "re-FiberRoot", label: "FiberRoot", kind: "class", community: 1, centrality: 0.70, inCycle: false, file: "packages/react-reconciler/src/ReactFiberRoot.js" },
      { id: "re-workLoop", label: "workLoopSync", kind: "function", community: 1, centrality: 0.85, inCycle: true, file: "packages/react-reconciler/src/ReactFiberWorkLoop.js" },
      { id: "re-performUnit", label: "performUnitOfWork", kind: "function", community: 1, centrality: 0.80, inCycle: true, file: "packages/react-reconciler/src/ReactFiberWorkLoop.js" },
      { id: "re-useState", label: "useState", kind: "function", community: 2, centrality: 0.90, inCycle: false, file: "packages/react/src/ReactHooks.js" },
      { id: "re-useEffect", label: "useEffect", kind: "function", community: 2, centrality: 0.85, inCycle: false, file: "packages/react/src/ReactHooks.js" },
      { id: "re-useReducer", label: "useReducer", kind: "function", community: 2, centrality: 0.65, inCycle: false, file: "packages/react/src/ReactHooks.js" },
      { id: "re-useMemo", label: "useMemo", kind: "function", community: 2, centrality: 0.60, inCycle: false, file: "packages/react/src/ReactHooks.js" },
      { id: "re-dispatcher", label: "ReactCurrentDispatcher", kind: "module", community: 2, centrality: 0.72, inCycle: false, file: "packages/react/src/ReactCurrentDispatcher.js" },
      { id: "re-mountState", label: "mountState", kind: "function", community: 2, centrality: 0.68, inCycle: false, file: "packages/react-reconciler/src/ReactFiberHooks.js" },
      { id: "re-scheduleWork", label: "scheduleUpdateOnFiber", kind: "function", community: 3, centrality: 0.88, inCycle: false, file: "packages/react-reconciler/src/ReactFiberWorkLoop.js" },
      { id: "re-unstable_scheduleCallback", label: "scheduleCallback", kind: "function", community: 3, centrality: 0.78, inCycle: false, file: "packages/scheduler/src/Scheduler.js" },
      { id: "re-shouldYield", label: "shouldYieldToHost", kind: "function", community: 3, centrality: 0.55, inCycle: false, file: "packages/scheduler/src/Scheduler.js" },
      { id: "re-requestPaint", label: "requestPaint", kind: "function", community: 3, centrality: 0.45, inCycle: false, file: "packages/scheduler/src/Scheduler.js" },
      { id: "re-createRoot", label: "createRoot", kind: "function", community: 4, centrality: 0.82, inCycle: false, file: "packages/react-dom/src/client/ReactDOMRoot.js" },
      { id: "re-render", label: "render", kind: "function", community: 4, centrality: 0.75, inCycle: false, file: "packages/react-dom/src/client/ReactDOMRoot.js" },
      { id: "re-updateContainer", label: "updateContainer", kind: "function", community: 4, centrality: 0.70, inCycle: false, file: "packages/react-reconciler/src/ReactFiberReconciler.js" },
      { id: "re-HostConfig", label: "HostConfig", kind: "interface", community: 4, centrality: 0.55, inCycle: false, file: "packages/react-dom/src/client/ReactDOMHostConfig.js" },
      { id: "re-dispatchEvent", label: "dispatchEvent", kind: "function", community: 5, centrality: 0.72, inCycle: false, file: "packages/react-dom/src/events/ReactDOMEventListener.js" },
      { id: "re-SyntheticEvent", label: "SyntheticEvent", kind: "class", community: 5, centrality: 0.65, inCycle: false, file: "packages/react-dom/src/events/SyntheticEvent.js" },
      { id: "re-listenToAllEvents", label: "listenToAllEvents", kind: "function", community: 5, centrality: 0.58, inCycle: false, file: "packages/react-dom/src/events/DOMPluginEventSystem.js" },
      { id: "re-batchedUpdates", label: "batchedUpdates", kind: "function", community: 5, centrality: 0.62, inCycle: false, file: "packages/react-dom/src/events/ReactDOMUpdateBatching.js" },
    ],
    links: [
      { source: "re-workLoop", target: "re-performUnit", relation: "calls", inCycle: true },
      { source: "re-performUnit", target: "re-reconciler", relation: "calls", inCycle: true },
      { source: "re-reconciler", target: "re-reconcileChildren", relation: "calls", inCycle: false },
      { source: "re-reconciler", target: "re-completeWork", relation: "returns_to", inCycle: true },
      { source: "re-completeWork", target: "re-performUnit", relation: "returns_to", inCycle: true },
      { source: "re-commitRoot", target: "re-FiberRoot", relation: "reads", inCycle: false },
      { source: "re-reconcileChildren", target: "re-createFiber", relation: "calls", inCycle: false },
      { source: "re-createFiber", target: "re-FiberNode", relation: "creates", inCycle: false },
      { source: "re-FiberRoot", target: "re-FiberNode", relation: "contains", inCycle: false },
      { source: "re-workLoop", target: "re-shouldYield", relation: "checks", inCycle: false },
      { source: "re-useState", target: "re-dispatcher", relation: "reads", inCycle: false },
      { source: "re-useEffect", target: "re-dispatcher", relation: "reads", inCycle: false },
      { source: "re-useReducer", target: "re-dispatcher", relation: "reads", inCycle: false },
      { source: "re-useMemo", target: "re-dispatcher", relation: "reads", inCycle: false },
      { source: "re-dispatcher", target: "re-mountState", relation: "resolves", inCycle: false },
      { source: "re-mountState", target: "re-scheduleWork", relation: "calls", inCycle: false },
      { source: "re-scheduleWork", target: "re-unstable_scheduleCallback", relation: "calls", inCycle: false },
      { source: "re-scheduleWork", target: "re-workLoop", relation: "triggers", inCycle: false },
      { source: "re-unstable_scheduleCallback", target: "re-requestPaint", relation: "calls", inCycle: false },
      { source: "re-createRoot", target: "re-FiberRoot", relation: "creates", inCycle: false },
      { source: "re-createRoot", target: "re-render", relation: "returns", inCycle: false },
      { source: "re-render", target: "re-updateContainer", relation: "calls", inCycle: false },
      { source: "re-updateContainer", target: "re-scheduleWork", relation: "calls", inCycle: false },
      { source: "re-createRoot", target: "re-HostConfig", relation: "uses", inCycle: false },
      { source: "re-createRoot", target: "re-listenToAllEvents", relation: "calls", inCycle: false },
      { source: "re-dispatchEvent", target: "re-SyntheticEvent", relation: "creates", inCycle: false },
      { source: "re-dispatchEvent", target: "re-batchedUpdates", relation: "calls", inCycle: false },
      { source: "re-batchedUpdates", target: "re-scheduleWork", relation: "calls", inCycle: false },
      { source: "re-listenToAllEvents", target: "re-dispatchEvent", relation: "registers", inCycle: false },
      { source: "re-commitRoot", target: "re-useEffect", relation: "flushes", inCycle: false },
    ],
  },
  {
    label: "Django",
    repo: "django/django",
    communityLabels: ["ORM", "HTTP", "URL Routing", "Templates", "Auth", "Admin"],
    nodes: [
      { id: "dj-Model", label: "Model", kind: "class", community: 0, centrality: 0.95, inCycle: false, file: "django/db/models/base.py" },
      { id: "dj-QuerySet", label: "QuerySet", kind: "class", community: 0, centrality: 0.92, inCycle: true, file: "django/db/models/query.py" },
      { id: "dj-Manager", label: "Manager", kind: "class", community: 0, centrality: 0.78, inCycle: true, file: "django/db/models/manager.py" },
      { id: "dj-Field", label: "Field", kind: "class", community: 0, centrality: 0.72, inCycle: false, file: "django/db/models/fields/__init__.py" },
      { id: "dj-SQLCompiler", label: "SQLCompiler", kind: "class", community: 0, centrality: 0.68, inCycle: false, file: "django/db/models/sql/compiler.py" },
      { id: "dj-migrate", label: "migrate", kind: "function", community: 0, centrality: 0.55, inCycle: false, file: "django/core/management/commands/migrate.py" },
      { id: "dj-HttpRequest", label: "HttpRequest", kind: "class", community: 1, centrality: 0.88, inCycle: false, file: "django/http/request.py" },
      { id: "dj-HttpResponse", label: "HttpResponse", kind: "class", community: 1, centrality: 0.85, inCycle: false, file: "django/http/response.py" },
      { id: "dj-WSGIHandler", label: "WSGIHandler", kind: "class", community: 1, centrality: 0.82, inCycle: false, file: "django/core/handlers/wsgi.py" },
      { id: "dj-get_response", label: "get_response", kind: "function", community: 1, centrality: 0.75, inCycle: false, file: "django/core/handlers/base.py" },
      { id: "dj-Middleware", label: "MiddlewareMixin", kind: "class", community: 1, centrality: 0.62, inCycle: false, file: "django/utils/deprecation.py" },
      { id: "dj-URLResolver", label: "URLResolver", kind: "class", community: 2, centrality: 0.80, inCycle: false, file: "django/urls/resolvers.py" },
      { id: "dj-path", label: "path", kind: "function", community: 2, centrality: 0.75, inCycle: false, file: "django/urls/conf.py" },
      { id: "dj-URLPattern", label: "URLPattern", kind: "class", community: 2, centrality: 0.65, inCycle: false, file: "django/urls/resolvers.py" },
      { id: "dj-reverse", label: "reverse", kind: "function", community: 2, centrality: 0.70, inCycle: false, file: "django/urls/base.py" },
      { id: "dj-include", label: "include", kind: "function", community: 2, centrality: 0.58, inCycle: false, file: "django/urls/conf.py" },
      { id: "dj-Template", label: "Template", kind: "class", community: 3, centrality: 0.72, inCycle: false, file: "django/template/base.py" },
      { id: "dj-Context", label: "Context", kind: "class", community: 3, centrality: 0.65, inCycle: false, file: "django/template/context.py" },
      { id: "dj-render", label: "render", kind: "function", community: 3, centrality: 0.78, inCycle: false, file: "django/shortcuts.py" },
      { id: "dj-Engine", label: "Engine", kind: "class", community: 3, centrality: 0.58, inCycle: false, file: "django/template/engine.py" },
      { id: "dj-authenticate", label: "authenticate", kind: "function", community: 4, centrality: 0.72, inCycle: false, file: "django/contrib/auth/__init__.py" },
      { id: "dj-User", label: "AbstractUser", kind: "class", community: 4, centrality: 0.82, inCycle: false, file: "django/contrib/auth/models.py" },
      { id: "dj-login", label: "login", kind: "function", community: 4, centrality: 0.65, inCycle: false, file: "django/contrib/auth/__init__.py" },
      { id: "dj-Permission", label: "Permission", kind: "class", community: 4, centrality: 0.55, inCycle: false, file: "django/contrib/auth/models.py" },
      { id: "dj-ModelAdmin", label: "ModelAdmin", kind: "class", community: 5, centrality: 0.78, inCycle: false, file: "django/contrib/admin/options.py" },
      { id: "dj-AdminSite", label: "AdminSite", kind: "class", community: 5, centrality: 0.72, inCycle: false, file: "django/contrib/admin/sites.py" },
      { id: "dj-ChangeList", label: "ChangeList", kind: "class", community: 5, centrality: 0.60, inCycle: false, file: "django/contrib/admin/views/main.py" },
    ],
    links: [
      { source: "dj-Model", target: "dj-Manager", relation: "creates", inCycle: false },
      { source: "dj-Manager", target: "dj-QuerySet", relation: "returns", inCycle: true },
      { source: "dj-QuerySet", target: "dj-Manager", relation: "refs", inCycle: true },
      { source: "dj-QuerySet", target: "dj-SQLCompiler", relation: "uses", inCycle: false },
      { source: "dj-Model", target: "dj-Field", relation: "defines", inCycle: false },
      { source: "dj-SQLCompiler", target: "dj-Field", relation: "reads", inCycle: false },
      { source: "dj-migrate", target: "dj-Model", relation: "inspects", inCycle: false },
      { source: "dj-WSGIHandler", target: "dj-get_response", relation: "calls", inCycle: false },
      { source: "dj-get_response", target: "dj-Middleware", relation: "chains", inCycle: false },
      { source: "dj-get_response", target: "dj-HttpRequest", relation: "receives", inCycle: false },
      { source: "dj-get_response", target: "dj-HttpResponse", relation: "returns", inCycle: false },
      { source: "dj-get_response", target: "dj-URLResolver", relation: "calls", inCycle: false },
      { source: "dj-URLResolver", target: "dj-URLPattern", relation: "contains", inCycle: false },
      { source: "dj-path", target: "dj-URLPattern", relation: "creates", inCycle: false },
      { source: "dj-include", target: "dj-URLResolver", relation: "creates", inCycle: false },
      { source: "dj-reverse", target: "dj-URLResolver", relation: "queries", inCycle: false },
      { source: "dj-render", target: "dj-Template", relation: "loads", inCycle: false },
      { source: "dj-Template", target: "dj-Context", relation: "uses", inCycle: false },
      { source: "dj-Template", target: "dj-Engine", relation: "created_by", inCycle: false },
      { source: "dj-render", target: "dj-HttpResponse", relation: "returns", inCycle: false },
      { source: "dj-render", target: "dj-HttpRequest", relation: "reads", inCycle: false },
      { source: "dj-authenticate", target: "dj-User", relation: "queries", inCycle: false },
      { source: "dj-login", target: "dj-HttpRequest", relation: "modifies", inCycle: false },
      { source: "dj-login", target: "dj-authenticate", relation: "calls", inCycle: false },
      { source: "dj-User", target: "dj-Permission", relation: "has", inCycle: false },
      { source: "dj-User", target: "dj-Model", relation: "extends", inCycle: false },
      { source: "dj-ModelAdmin", target: "dj-Model", relation: "wraps", inCycle: false },
      { source: "dj-AdminSite", target: "dj-ModelAdmin", relation: "registers", inCycle: false },
      { source: "dj-AdminSite", target: "dj-URLResolver", relation: "creates", inCycle: false },
      { source: "dj-ChangeList", target: "dj-QuerySet", relation: "uses", inCycle: false },
      { source: "dj-ChangeList", target: "dj-ModelAdmin", relation: "reads", inCycle: false },
      { source: "dj-Middleware", target: "dj-HttpRequest", relation: "processes", inCycle: false },
    ],
  },
  {
    label: "Flask",
    repo: "pallets/flask",
    communityLabels: ["App", "Routing", "Request/Response", "Templates", "Blueprints", "CLI"],
    nodes: [
      { id: "fl-Flask", label: "Flask", kind: "class", community: 0, centrality: 0.98, inCycle: false, file: "src/flask/app.py" },
      { id: "fl-run", label: "Flask.run", kind: "function", community: 0, centrality: 0.65, inCycle: false, file: "src/flask/app.py" },
      { id: "fl-wsgi_app", label: "wsgi_app", kind: "function", community: 0, centrality: 0.82, inCycle: false, file: "src/flask/app.py" },
      { id: "fl-full_dispatch", label: "full_dispatch_request", kind: "function", community: 0, centrality: 0.78, inCycle: false, file: "src/flask/app.py" },
      { id: "fl-config", label: "Config", kind: "class", community: 0, centrality: 0.55, inCycle: false, file: "src/flask/config.py" },
      { id: "fl-Map", label: "Map", kind: "class", community: 1, centrality: 0.80, inCycle: false, file: "werkzeug/routing/map.py" },
      { id: "fl-Rule", label: "Rule", kind: "class", community: 1, centrality: 0.75, inCycle: false, file: "werkzeug/routing/rules.py" },
      { id: "fl-route", label: "@route", kind: "function", community: 1, centrality: 0.88, inCycle: false, file: "src/flask/scaffold.py" },
      { id: "fl-add_url_rule", label: "add_url_rule", kind: "function", community: 1, centrality: 0.72, inCycle: false, file: "src/flask/scaffold.py" },
      { id: "fl-url_for", label: "url_for", kind: "function", community: 1, centrality: 0.70, inCycle: false, file: "src/flask/helpers.py" },
      { id: "fl-Request", label: "Request", kind: "class", community: 2, centrality: 0.85, inCycle: false, file: "src/flask/wrappers.py" },
      { id: "fl-Response", label: "Response", kind: "class", community: 2, centrality: 0.80, inCycle: false, file: "src/flask/wrappers.py" },
      { id: "fl-request", label: "request", kind: "module", community: 2, centrality: 0.90, inCycle: true, file: "src/flask/globals.py" },
      { id: "fl-g", label: "g", kind: "module", community: 2, centrality: 0.62, inCycle: false, file: "src/flask/globals.py" },
      { id: "fl-session", label: "session", kind: "module", community: 2, centrality: 0.58, inCycle: false, file: "src/flask/globals.py" },
      { id: "fl-ctx", label: "RequestContext", kind: "class", community: 2, centrality: 0.72, inCycle: true, file: "src/flask/ctx.py" },
      { id: "fl-render_template", label: "render_template", kind: "function", community: 3, centrality: 0.78, inCycle: false, file: "src/flask/templating.py" },
      { id: "fl-Environment", label: "Environment", kind: "class", community: 3, centrality: 0.65, inCycle: false, file: "src/flask/templating.py" },
      { id: "fl-render_string", label: "render_template_string", kind: "function", community: 3, centrality: 0.50, inCycle: false, file: "src/flask/templating.py" },
      { id: "fl-Blueprint", label: "Blueprint", kind: "class", community: 4, centrality: 0.82, inCycle: false, file: "src/flask/blueprints.py" },
      { id: "fl-bp_register", label: "Blueprint.register", kind: "function", community: 4, centrality: 0.72, inCycle: false, file: "src/flask/blueprints.py" },
      { id: "fl-bp_route", label: "Blueprint.route", kind: "function", community: 4, centrality: 0.68, inCycle: false, file: "src/flask/scaffold.py" },
      { id: "fl-FlaskGroup", label: "FlaskGroup", kind: "class", community: 5, centrality: 0.65, inCycle: false, file: "src/flask/cli.py" },
      { id: "fl-run_command", label: "run_command", kind: "function", community: 5, centrality: 0.58, inCycle: false, file: "src/flask/cli.py" },
      { id: "fl-shell_command", label: "shell_command", kind: "function", community: 5, centrality: 0.45, inCycle: false, file: "src/flask/cli.py" },
    ],
    links: [
      { source: "fl-Flask", target: "fl-config", relation: "creates", inCycle: false },
      { source: "fl-Flask", target: "fl-wsgi_app", relation: "defines", inCycle: false },
      { source: "fl-wsgi_app", target: "fl-full_dispatch", relation: "calls", inCycle: false },
      { source: "fl-wsgi_app", target: "fl-ctx", relation: "pushes", inCycle: false },
      { source: "fl-full_dispatch", target: "fl-Map", relation: "matches", inCycle: false },
      { source: "fl-full_dispatch", target: "fl-Response", relation: "returns", inCycle: false },
      { source: "fl-run", target: "fl-wsgi_app", relation: "serves", inCycle: false },
      { source: "fl-Flask", target: "fl-route", relation: "defines", inCycle: false },
      { source: "fl-route", target: "fl-add_url_rule", relation: "calls", inCycle: false },
      { source: "fl-add_url_rule", target: "fl-Rule", relation: "creates", inCycle: false },
      { source: "fl-add_url_rule", target: "fl-Map", relation: "adds_to", inCycle: false },
      { source: "fl-url_for", target: "fl-Map", relation: "queries", inCycle: false },
      { source: "fl-ctx", target: "fl-Request", relation: "creates", inCycle: false },
      { source: "fl-ctx", target: "fl-request", relation: "pushes", inCycle: true },
      { source: "fl-request", target: "fl-ctx", relation: "reads", inCycle: true },
      { source: "fl-ctx", target: "fl-g", relation: "creates", inCycle: false },
      { source: "fl-ctx", target: "fl-session", relation: "opens", inCycle: false },
      { source: "fl-render_template", target: "fl-Environment", relation: "uses", inCycle: false },
      { source: "fl-render_string", target: "fl-Environment", relation: "uses", inCycle: false },
      { source: "fl-render_template", target: "fl-request", relation: "reads", inCycle: false },
      { source: "fl-Flask", target: "fl-Environment", relation: "creates", inCycle: false },
      { source: "fl-Blueprint", target: "fl-bp_register", relation: "defines", inCycle: false },
      { source: "fl-Blueprint", target: "fl-bp_route", relation: "defines", inCycle: false },
      { source: "fl-bp_register", target: "fl-Flask", relation: "registers_on", inCycle: false },
      { source: "fl-bp_route", target: "fl-add_url_rule", relation: "defers_to", inCycle: false },
      { source: "fl-FlaskGroup", target: "fl-Flask", relation: "creates", inCycle: false },
      { source: "fl-run_command", target: "fl-run", relation: "calls", inCycle: false },
      { source: "fl-shell_command", target: "fl-Flask", relation: "uses", inCycle: false },
      { source: "fl-FlaskGroup", target: "fl-run_command", relation: "registers", inCycle: false },
      { source: "fl-FlaskGroup", target: "fl-shell_command", relation: "registers", inCycle: false },
    ],
  },
];

function buildGraph(datasetIndex: number): { nodes: SimNode[]; links: SimLink[]; communityLabels: string[] } {
  const ds = DATASETS[datasetIndex];
  const nodes = ds.nodes.map((n) => ({ ...n }));
  const links = ds.links.map((l) => ({ ...l }));
  return { nodes, links, communityLabels: ds.communityLabels };
}

/* ──────────────────────────────────────
   SVG shape helpers
   ────────────────────────────────────── */

function drawNodeShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  kind: string
) {
  ctx.beginPath();
  switch (KIND_SHAPES[kind]) {
    case "square":
      ctx.rect(x - r, y - r, r * 2, r * 2);
      break;
    case "diamond":
      ctx.moveTo(x, y - r * 1.2);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r * 1.2);
      ctx.lineTo(x - r, y);
      ctx.closePath();
      break;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "triangle":
      ctx.moveTo(x, y - r * 1.15);
      ctx.lineTo(x + r, y + r * 0.7);
      ctx.lineTo(x - r, y + r * 0.7);
      ctx.closePath();
      break;
    default: // circle
      ctx.arc(x, y, r, 0, Math.PI * 2);
      break;
  }
}

/* ──────────────────────────────────────
   Main visualization component
   ────────────────────────────────────── */

export default function CodebaseVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dataRef = useRef(buildGraph(0));
  const communityLabelsRef = useRef(DATASETS[0].communityLabels);
  const animFrameRef = useRef<number>(0);

  // Interactive controls
  const [activeDataset, setActiveDataset] = useState(0);
  const [showCommunities, setShowCommunities] = useState(true);
  const [showCycles, setShowCycles] = useState(true);
  const [showCentrality, setShowCentrality] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [stats, setStats] = useState({ nodes: 0, edges: 0, communities: 0, cycles: 0 });

  // Refs for toggles so the render loop reads latest state without re-creating the simulation
  const showCommunitiesRef = useRef(showCommunities);
  const showCyclesRef = useRef(showCycles);
  const showCentralityRef = useRef(showCentrality);
  showCommunitiesRef.current = showCommunities;
  showCyclesRef.current = showCycles;
  showCentralityRef.current = showCentrality;

  /* ── Switch dataset ── */
  useEffect(() => {
    const graph = buildGraph(activeDataset);
    dataRef.current = graph;
    communityLabelsRef.current = graph.communityLabels;

    const communitySet = new Set(graph.nodes.map((n) => n.community));
    const cycleEdges = graph.links.filter((l) => l.inCycle).length;
    setStats({
      nodes: graph.nodes.length,
      edges: graph.links.length,
      communities: communitySet.size,
      cycles: cycleEdges,
    });

    // Restart simulation with new data
    const sim = simulationRef.current;
    if (sim) {
      sim.nodes(graph.nodes);
      (sim.force("link") as d3.ForceLink<SimNode, SimLink>)?.links(graph.links);
      transformRef.current = d3.zoomIdentity;
      sim.alpha(1).restart();
    }
    hoveredNodeRef.current = null;
    setHoveredNode(null);
  }, [activeDataset]);

  /* ── Canvas render loop ── */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { nodes, links } = dataRef.current;
    const t = transformRef.current;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Save after DPR scale — tooltip will draw in this space
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    // Counter-scale: nodes grow at 50% of zoom, text at 70%
    const zk = t.k;
    const nodeScale = 1 / Math.pow(zk, 0.5);   // at 2x zoom → ~0.71x size
    const textScale = 1 / Math.pow(zk, 0.3);   // at 2x zoom → ~0.81x size

    /* ── Community hulls ── */
    if (showCommunitiesRef.current) {
      const communityGroups = d3.group(nodes, (d) => d.community);
      communityGroups.forEach((groupNodes, communityId) => {
        if (groupNodes.length < 2) return;
        const color = COMMUNITY_COLORS[communityId % COMMUNITY_COLORS.length];
        const cx = d3.mean(groupNodes, (d) => d.x ?? 0) ?? 0;
        const cy = d3.mean(groupNodes, (d) => d.y ?? 0) ?? 0;
        const maxDist = Math.max(
          40,
          ...groupNodes.map((d) =>
            Math.hypot((d.x ?? 0) - cx, (d.y ?? 0) - cy)
          )
        );
        ctx.beginPath();
        ctx.arc(cx, cy, maxDist + 25, 0, Math.PI * 2);
        ctx.fillStyle = color + "12"; // 7% opacity
        ctx.fill();
        ctx.strokeStyle = color + "25";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Community label
        ctx.fillStyle = color + "90";
        ctx.font = `bold ${Math.round(10 * textScale)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.fillText(
          communityLabelsRef.current[communityId % communityLabelsRef.current.length],
          cx,
          cy - maxDist - 12
        );
      });
    }

    /* ── Edges ── */
    for (const link of links) {
      const source = link.source as SimNode;
      const target = link.target as SimNode;
      if (source.x == null || target.x == null) continue;

      const isCross =
        showCommunitiesRef.current && source.community !== target.community;
      const isCycle = showCyclesRef.current && link.inCycle;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y!);

      if (isCross) {
        // Curved cross-community edges
        const mx = (source.x + target.x!) / 2;
        const my = (source.y! + target.y!) / 2 - 20;
        ctx.quadraticCurveTo(mx, my, target.x!, target.y!);
      } else {
        ctx.lineTo(target.x!, target.y!);
      }

      if (isCycle) {
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
      } else if (isCross) {
        ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);
      } else {
        const color =
          COMMUNITY_COLORS[(source as SimNode).community % COMMUNITY_COLORS.length];
        ctx.strokeStyle = color + "40";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head
      const angle = Math.atan2(
        target.y! - source.y!,
        target.x! - source.x
      );
      const arrowLen = 6;
      ctx.beginPath();
      ctx.moveTo(target.x!, target.y!);
      ctx.lineTo(
        target.x! - arrowLen * Math.cos(angle - 0.35),
        target.y! - arrowLen * Math.sin(angle - 0.35)
      );
      ctx.lineTo(
        target.x! - arrowLen * Math.cos(angle + 0.35),
        target.y! - arrowLen * Math.sin(angle + 0.35)
      );
      ctx.closePath();
      ctx.fillStyle = isCycle
        ? "#EF4444"
        : isCross
          ? "rgba(99, 102, 241, 0.5)"
          : COMMUNITY_COLORS[(source as SimNode).community % COMMUNITY_COLORS.length] + "60";
      ctx.fill();
    }

    /* ── Nodes ── */
    const hovered = hoveredNodeRef.current;
    for (const node of nodes) {
      if (node.x == null || node.y == null) continue;
      const color =
        COMMUNITY_COLORS[node.community % COMMUNITY_COLORS.length];
      const baseR = (showCentralityRef.current
        ? 4 + node.centrality * 10
        : 6) * nodeScale;
      const isHovered = hovered?.id === node.id;
      const r = isHovered ? baseR + 2 * nodeScale : baseR;

      // Glow for hovered or cycle nodes
      if (isHovered || (showCyclesRef.current && node.inCycle)) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6 * nodeScale, 0, Math.PI * 2);
        ctx.fillStyle =
          showCyclesRef.current && node.inCycle
            ? "rgba(239, 68, 68, 0.15)"
            : color + "20";
        ctx.fill();
      }

      // Node shape
      drawNodeShape(ctx, node.x, node.y, r, node.kind);
      ctx.fillStyle = showCommunitiesRef.current ? color : "#6366F1";
      ctx.globalAlpha = isHovered ? 1 : 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Border for classes / interfaces
      if (node.kind === "class" || node.kind === "interface") {
        drawNodeShape(ctx, node.x, node.y, r, node.kind);
        ctx.strokeStyle = color + "80";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Cycle ring
      if (showCyclesRef.current && node.inCycle) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 3 * nodeScale, 0, Math.PI * 2);
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

    }

    // Labels — nudge overlapping labels down so none are hidden
    // Sort by centrality descending so important nodes claim their spot first
    const sortedNodes = [...nodes].sort((a, b) => b.centrality - a.centrality);
    const placedLabels: { x: number; y: number; w: number; h: number }[] = [];
    const fontSize = Math.round(9 * textScale);
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
    const labelH = fontSize + 2;

    for (const node of sortedNodes) {
      if (node.x == null || node.y == null) continue;
      const isHovered = hovered?.id === node.id;
      const nr = (showCentralityRef.current ? 4 + node.centrality * 10 : 6) * nodeScale;
      const r = isHovered ? nr + 2 * nodeScale : nr;
      ctx.font = `${isHovered ? "bold " : ""}${fontSize}px 'JetBrains Mono', monospace`;
      const labelW = ctx.measureText(node.label).width;
      const lx = node.x - labelW / 2;
      let ly = node.y + r + 4 * textScale;

      // Nudge down until no overlap (max 3 shifts)
      for (let attempt = 0; attempt < 3; attempt++) {
        const hit = placedLabels.some(
          (p) => lx < p.x + p.w + 4 && lx + labelW + 4 > p.x && ly < p.y + p.h + 2 && ly + labelH + 2 > p.y
        );
        if (!hit) break;
        ly += labelH + 2;
      }

      ctx.fillStyle = isHovered ? "#FAFAFA" : "#A1A1AA";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, ly + fontSize);
      placedLabels.push({ x: lx, y: ly, w: labelW, h: labelH });
    }

    ctx.restore(); // back to DPR-scaled screen space

    /* ── Tooltip overlay (follows mouse cursor, in screen space) ── */
    if (hovered && hovered.x != null) {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Measure text to compute dynamic width
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      const titleW = ctx.measureText(hovered.label).width;
      ctx.font = "12px 'JetBrains Mono', monospace";
      const fileLineW = ctx.measureText(hovered.kind + "  ·  " + hovered.file).width;
      const communityLineW = ctx.measureText("Community: " + communityLabelsRef.current[hovered.community % communityLabelsRef.current.length]).width;
      const centralityLineW = ctx.measureText("Centrality: " + hovered.centrality.toFixed(2) + (hovered.inCycle ? "  ⚠ In cycle" : "")).width;
      const maxTextW = Math.max(titleW, fileLineW, communityLineW, centralityLineW);
      const tooltipW = Math.max(200, maxTextW + 30);
      const tooltipH = 96;
      let tx = mx + 20;
      let ty = my - tooltipH / 2;
      if (tx + tooltipW > w) tx = mx - tooltipW - 20;
      if (ty < 4) ty = 4;
      if (ty + tooltipH > h) ty = h - tooltipH - 4;

      // Background with shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "rgba(12, 12, 15, 0.96)";
      ctx.beginPath();
      ctx.roundRect(tx, ty, tooltipW, tooltipH, 10);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Accent bar
      const accentColor = COMMUNITY_COLORS[hovered.community % COMMUNITY_COLORS.length];
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(tx, ty, 3, tooltipH, [10, 0, 0, 10]);
      ctx.fill();

      // Text
      ctx.fillStyle = "#FAFAFA";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(hovered.label, tx + 14, ty + 22);

      ctx.fillStyle = "#71717A";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText(hovered.kind + "  ·  " + hovered.file, tx + 14, ty + 40);

      ctx.fillStyle = accentColor;
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText(
        "Community: " +
          communityLabelsRef.current[hovered.community % communityLabelsRef.current.length],
        tx + 14,
        ty + 58
      );

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText(
        "Centrality: " + hovered.centrality.toFixed(2) +
          (hovered.inCycle ? "  ⚠ In cycle" : ""),
        tx + 14,
        ty + 76
      );
      ctx.restore();
    }

    ctx.restore(); // outer DPR save
    animFrameRef.current = requestAnimationFrame(render);
  }, []);

  /* ── Setup simulation & interaction ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Size canvas
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const { nodes, links } = dataRef.current;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // D3 force simulation
    const sim = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(55)
          .strength(0.6)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide<SimNode>().radius((d) => 8 + d.centrality * 12))
      .force(
        "x",
        d3.forceX<SimNode>().x((d) => {
          // Cluster communities
          const angle = (d.community / 6) * Math.PI * 2;
          return w / 2 + Math.cos(angle) * 100;
        }).strength(0.07)
      )
      .force(
        "y",
        d3.forceY<SimNode>().y((d) => {
          const angle = (d.community / 6) * Math.PI * 2;
          return h / 2 + Math.sin(angle) * 80;
        }).strength(0.07)
      )
      .alphaDecay(0.008)
      .velocityDecay(0.35);

    simulationRef.current = sim;

    // Zoom & pan
    const zoomBehavior = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
      });

    d3.select(canvas).call(zoomBehavior);

    // Initial transform: center with slight zoom-out
    const initTransform = d3.zoomIdentity.translate(0, 0).scale(1);
    d3.select(canvas).call(zoomBehavior.transform, initTransform);

    // Hover detection
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      const graphX = t.invertX(event.clientX - rect.left);
      const graphY = t.invertY(event.clientY - rect.top);

      // Track screen-space mouse position for tooltip
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      let closest: SimNode | null = null;
      let closestDist = 35;
      for (const node of dataRef.current.nodes) {
        if (node.x == null || node.y == null) continue;
        const dist = Math.hypot(node.x - graphX, node.y - graphY);
        if (dist < closestDist) {
          closest = node;
          closestDist = dist;
        }
      }
      hoveredNodeRef.current = closest;
      setHoveredNode(closest);
      canvas.style.cursor = closest ? "pointer" : "crosshair";
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Drag behavior — implemented via pointer events to avoid D3 drag typing issues with canvas
    let dragNode: SimNode | null = null;

    const handlePointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      const mx = t.invertX(event.clientX - rect.left);
      const my = t.invertY(event.clientY - rect.top);

      for (const node of dataRef.current.nodes) {
        if (node.x == null || node.y == null) continue;
        const r = 4 + (node.centrality ?? 0.5) * 10 + 4;
        if (Math.hypot(node.x - mx, node.y - my) < r) {
          dragNode = node;
          node.fx = node.x;
          node.fy = node.y;
          sim.alphaTarget(0.3).restart();
          canvas.setPointerCapture(event.pointerId);
          event.stopPropagation();
          return;
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragNode) return;
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      dragNode.fx = t.invertX(event.clientX - rect.left);
      dragNode.fy = t.invertY(event.clientY - rect.top);
    };

    const handlePointerUp = () => {
      if (dragNode) {
        dragNode.fx = null;
        dragNode.fy = null;
        dragNode = null;
        sim.alphaTarget(0);
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);

    // Start render loop
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      sim.stop();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, [render]);

  /* ── Toggle simulation ── */
  useEffect(() => {
    const sim = simulationRef.current;
    if (!sim) return;
    if (isSimRunning) {
      sim.alphaTarget(0.05).restart();
    } else {
      sim.alphaTarget(0).stop();
    }
  }, [isSimRunning]);

  return (
    <div className="flex flex-col gap-4">
      {/* Repo selector */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        {DATASETS.map((ds, i) => (
          <button
            key={ds.repo}
            onClick={() => setActiveDataset(i)}
            className={`
              px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200
              ${activeDataset === i
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-text-tertiary border border-white/[0.06] hover:border-white/[0.12]"
              }
            `}
          >
            {ds.label}
            <span className="ml-1.5 text-[10px] text-text-tertiary">{ds.repo}</span>
          </button>
        ))}
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3 px-1">
        <ToggleButton
          label="Communities"
          active={showCommunities}
          onClick={() => setShowCommunities((v) => !v)}
          color="#6366F1"
        />
        <ToggleButton
          label="Cycles"
          active={showCycles}
          onClick={() => setShowCycles((v) => !v)}
          color="#EF4444"
        />
        <ToggleButton
          label="Centrality"
          active={showCentrality}
          onClick={() => setShowCentrality((v) => !v)}
          color="#F59E0B"
        />
        <button
          onClick={() => setIsSimRunning((v) => !v)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200
            ${isSimRunning
              ? "bg-success/15 text-success border border-success/30"
              : "text-text-tertiary border border-white/[0.06] hover:border-white/[0.12]"
            }
          `}
        >
          {isSimRunning ? "⏸ Pause" : "▶ Play"}
        </button>

        {/* Stats chips */}
        <div className="ml-auto flex flex-wrap items-center gap-2 text-[10px] font-mono text-text-tertiary">
          <Hint text="Total symbols parsed from the codebase" align="right"><span>{stats.nodes} nodes</span></Hint>
          <span className="text-white/20">·</span>
          <Hint text="Relationships between symbols — calls, imports, extends" align="right"><span>{stats.edges} edges</span></Hint>
          <span className="text-white/20">·</span>
          <Hint text="Tightly coupled symbol groups via Leiden community detection" align="right"><span className="text-accent">{stats.communities} communities</span></Hint>
          <span className="text-white/20">·</span>
          <Hint text="Circular dependencies (A→B→…→A) — refactoring targets" align="right"><span className="text-danger">{stats.cycles} cycle edges</span></Hint>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[400px] md:h-[520px] rounded-xl overflow-hidden border border-white/[0.06] bg-black/20"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />

        {/* Hover hint */}
        {!hoveredNode && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] font-mono text-text-tertiary pointer-events-none">
            drag to pan · scroll to zoom · hover for details
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[10px] font-mono text-text-tertiary">
        <div className="flex items-center gap-4">
          <span className="text-text-secondary font-semibold">Shapes:</span>
          <LegendItem shape="circle" label="function" tooltip="Standalone functions and methods — the primary unit of behavior" />
          <LegendItem shape="square" label="class" tooltip="Class definitions — stateful objects with methods and properties" />
          <LegendItem shape="diamond" label="interface" tooltip="Interfaces and protocols — contracts that define expected behavior" />
          <LegendItem shape="hexagon" label="module" tooltip="Module-level exports — file or package boundaries" />
          <LegendItem shape="triangle" label="type" tooltip="Type aliases and custom types — structural definitions" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary font-semibold">Edges:</span>
          <Hint text="Calls or references between symbols within the same community">
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 border-t border-accent/40" /> internal
            </span>
          </Hint>
          <Hint text="Connections between different module communities — coupling points">
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 border-t border-dashed border-accent/50" /> cross-community
            </span>
          </Hint>
          <Hint text="Circular dependencies (A→B→…→A) — refactoring candidate">
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 border-t-2 border-dashed border-danger" /> cycle
            </span>
          </Hint>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   Sub-components
   ────────────────────────────────────── */

function ToggleButton({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200
        ${active
          ? "border"
          : "text-text-tertiary border border-white/[0.06] hover:border-white/[0.12]"
        }
      `}
      style={
        active
          ? {
              backgroundColor: color + "15",
              color: color,
              borderColor: color + "4D",
            }
          : undefined
      }
    >
      <span
        className="w-2 h-2 rounded-full transition-colors"
        style={{ backgroundColor: active ? color : "#52525B" }}
      />
      {label}
    </button>
  );
}

function Hint({ children, text, align = "left" }: { children: React.ReactNode; text: string; align?: "left" | "right" }) {
  return (
    <span className="relative group/hint cursor-help border-b border-dotted border-white/20">
      {children}
      <span className={`pointer-events-none absolute bottom-full mb-2 px-3 py-2 w-56 text-[11px] leading-snug font-mono text-white/90 bg-[rgba(12,12,15,0.96)] border border-white/10 rounded-lg shadow-xl whitespace-normal opacity-0 group-hover/hint:opacity-100 transition-opacity duration-150 z-50 ${align === "right" ? "right-0" : "left-0"}`}>
        {text}
      </span>
    </span>
  );
}

function LegendItem({ shape, label, tooltip }: { shape: string; label: string; tooltip?: string }) {
  const inner = (
    <span className="flex items-center gap-1">
      <svg width="10" height="10" viewBox="0 0 10 10" className="text-accent">
        {shape === "circle" && <circle cx="5" cy="5" r="4" fill="#6366F1" opacity={0.7} />}
        {shape === "square" && <rect x="1" y="1" width="8" height="8" fill="#6366F1" opacity={0.7} />}
        {shape === "diamond" && <polygon points="5,0.5 9.5,5 5,9.5 0.5,5" fill="#6366F1" opacity={0.7} />}
        {shape === "hexagon" && <polygon points="7.5,1.3 10,5 7.5,8.7 2.5,8.7 0,5 2.5,1.3" fill="#6366F1" opacity={0.7} />}
        {shape === "triangle" && <polygon points="5,0.5 9.5,9 0.5,9" fill="#6366F1" opacity={0.7} />}
      </svg>
      {label}
    </span>
  );
  if (tooltip) return <Hint text={tooltip}>{inner}</Hint>;
  return inner;
}
