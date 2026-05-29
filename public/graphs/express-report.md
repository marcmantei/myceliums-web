# Graph Report — express

Generated: 2026-04-20  |  Repo ID: `express-afb20702`

## Overview

| Metric | Count |
|--------|-------|
| Symbols | 1997 |
| Files | 155 |
| Relationships | 2077 |
| Communities | 137 |
| Processes | 40 |

## God Nodes (Top 10 by Degree Centrality)

| # | Name | Kind | Degree | In | Out | File | High Coupling |
|---|------|------|--------|----|-----|------|---------------|
| 1 | `next` | Variable | 12 | 12 | 0 | `lib/response.js` | no |
| 2 | `error` | Function | 7 | 4 | 3 | `examples/error/index.js` | no |
| 3 | `callback` | Variable | 7 | 7 | 0 | `lib/response.js` | no |
| 4 | `createApp` | Function | 6 | 0 | 6 | `test/express.static.js` | no |
| 5 | `send` | Variable | 5 | 5 | 0 | `lib/response.js` | no |
| 6 | `parse` | Variable | 5 | 5 | 0 | `lib/request.js` | no |
| 7 | `createRedirectServerForDomain` | Function | 4 | 0 | 4 | `test/res.location.js` | no |
| 8 | `testRequestedRedirect` | Function | 4 | 0 | 4 | `test/res.location.js` | no |
| 9 | `count` | Function | 4 | 2 | 2 | `examples/view-locals/index.js` | no |
| 10 | `onfinish` | Function | 3 | 0 | 3 | `lib/response.js` | no |

## Surprising Cross-Community Connections

Ranked by surprise score (1.0 = unique link between rarely-interacting communities):

| # | Score | Source | Target | Communities |
|---|-------|--------|--------|-------------|
| 1 | 0.750 | `fn2` | `next` | community-15 → next |
| 2 | 0.750 | `tryRender` | `callback` | next → community-134 |
| 3 | 0.500 | `createRedirectServerForDomain` | `parse` | community-15 → community-108 |
| 4 | 0.500 | `testRequestedRedirect` | `error` | community-108 → community-15 |

## Community Summary

| # | Label | Members | Top Symbols | Summary |
|---|-------|---------|-------------|----------|
| 1 | app | 41 | app, count, View, app | Variable module: app, count, ... (4) — handles test |
| 2 | app | 25 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 3 | document | 2 | document | Document module: document — handles fixtures |
| 4 | app | 68 | app, test, local, express | Variable module: app, test, ... (4) — handles test |
| 5 | db | 4 | db, pet, body | Variable module: db, pet, body — handles controllers |
| 6 | app | 6 | app, request, blog, app | Variable module: app, request, ... (4) — handles test |
| 7 | app | 3 | app, request | Variable module: app, request — handles acceptance |
| 8 | app | 6 | app, html, express, GithubView | Variable module: app, html, ... (4) — handles view-constructor |
| 9 | route | 35 | route, req, req, req | Variable module: route, req, ... (4) — handles test |
| 10 | app | 60 | app, accept, test, app | Variable module: app, accept, ... (4) — handles test |
| 11 | assert | 93 | assert, handleHeaders, app | Variable module: assert, handleHeaders, app — handles test |
| 12 | FILES_DIR | 5 | FILES_DIR, express, path, app | Variable module: FILES_DIR, express, ... (4) — handles examples |
| 13 | address | 14 | address, getExpectedClientAddress, test, app | Variable module: address, getExpectedClientAddress, ... (4) — handles test |
| 14 | request | 4 | request, getCookie, app | Variable module: request, getCookie, app — handles acceptance |
| 15 | document | 2 | document | Document module: document — handles public |
| 16 | express | 5 | express, app, app, request | Variable module: express, app, ... (4) — handles test |
| 17 | request | 7 | request, app, express, app | Variable module: request, app, ... (4) — handles test |
| 18 | request | 12 | request, app, app, app | Variable module: request, app, ... (4) — handles test |
| 19 | err | 5 | err, id, user, users | Variable module: err, id, ... (4) — handles route-separation |
| 20 | request | 3 | request, app | Variable module: request, app — handles test |
| 21 | id | 6 | id, body, db, user | Variable module: id, body, ... (4) — handles controllers |
| 22 | app | 14 | app, app, request, app | Variable module: app, app, ... (4) — handles test |
| 23 | logger | 5 | logger, express, app, path | Variable module: logger, express, ... (4) — handles static-files |
| 24 | app | 19 | app, app, app, route | Variable module: app, app, ... (4) — handles test |
| 25 | xhr | 4 | xhr, search, code | Variable module: xhr, search, code — handles public |
| 26 | callback | 102 | callback, onfinish, onerror | Function module: callback, onfinish, onerror — handles lib |
| 27 | app | 30 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 28 | app | 14 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 29 | cookieParser | 6 | cookieParser, app, logger, minute | Variable module: cookieParser, app, ... (4) — handles cookies |
| 30 | app | 8 | app, assert, express, app | Variable module: app, assert, ... (4) — handles test |
| 31 | app | 3 | app, request | Variable module: app, request — handles test |
| 32 | app | 10 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 33 | apiv2 | 3 | apiv2, express | Variable module: apiv2, express — handles multi-router |
| 34 | request | 16 | request, app5, test, app | Variable module: request, app5, ... (4) — handles test |
| 35 | app | 19 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 36 | app | 4 | app, express, cookieSession | Variable module: app, express, cookieSession — handles examples |
| 37 | document | 2 | document | Document module: document — handles files |
| 38 | opts | 25 | opts, fs, args, mod | Variable module: opts, fs, ... (4) — handles lib |
| 39 | request | 3 | request, app | Variable module: request, app — handles test |
| 40 | app | 3 | app, request | Variable module: app, request — handles test |
| 41 | request | 3 | request, app | Variable module: request, app — handles acceptance |
| 42 | app | 3 | app, express | Variable module: app, express — handles examples |
| 43 | request | 4 | request, app, express | Variable module: request, app, express — handles test |
| 44 | express | 9 | express, app, app, app | Variable module: express, app, ... (4) — handles test |
| 45 | document | 2 | document | Document module: document — handles fixtures |
| 46 | app | 3 | app, request | Variable module: app, request — handles test |
| 47 | express | 14 | express, app, app, app | Variable module: express, app, ... (4) — handles test |
| 48 | User | 3 | User, users | Function module: User, users — handles view-locals |
| 49 | body | 5 | body, express, session, app | Variable module: body, express, ... (4) — handles session |
| 50 | app1 | 17 | app1, app2, app1, cb | Variable module: app1, app2, ... (4) — handles test |
| 51 | express | 7 | express, app, app, app | Variable module: express, app, ... (4) — handles test |
| 52 | app | 3 | app, express | Variable module: app, express — handles examples |
| 53 | express | 4 | express, app, request | Variable module: express, app, request — handles test |
| 54 | Security Issues | 18 | Security Issues, Quick Start, Examples, TC emeriti members | Section module: Security Issues, Quick Start, ... (4) — handles functionality |
| 55 | users | 2 | users | Variable module: users — handles content-negotiation |
| 56 | test | 64 | test, test, app, test | Variable module: test, test, ... (4) — handles test |
| 57 | app | 17 | app, app2, express, after | Variable module: app, app2, ... (4) — handles test |
| 58 | createApplication | 10 | createApplication, mixin, req, bodyParser | Variable module: createApplication, mixin, ... (4) — handles lib |
| 59 | server | 14 | server, assert, server, express | Constant module: server, assert, ... (4) — handles test |
| 60 | document | 2 | document | Document module: document — handles fixtures |
| 61 | users | 3 | users, pets | Variable module: users, pets — handles examples |
| 62 | etag | 7 | etag, app, app, request | Variable module: etag, app, ... (4) — handles test |
| 63 | document | 2 | document | Document module: document — handles test |
| 64 | trust | 38 | trust, req, offset, arr | Variable module: trust, req, ... (4) — handles lib |
| 65 | sub1 | 15 | sub1, express, app, sub3 | Variable module: sub1, express, ... (4) — handles test |
| 66 | app | 17 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 67 | posts | 2 | posts | Variable module: posts — handles route-separation |
| 68 | app | 3 | app, request | Variable module: app, request — handles acceptance |
| 69 | document | 2 | document | Document module: document — handles downloads |
| 70 | request | 3 | request, app | Variable module: request, app — handles acceptance |
| 71 | request | 9 | request, app, app, app | Variable module: request, app, ... (4) — handles test |
| 72 | result | 7 | result, { Buffer }, utils, result | Constant module: result, { Buffer }, ... (4) — handles test |
| 73 | fn | 24 | fn, tryRender, authenticate | Function module: fn, tryRender, authenticate — handles auth |
| 74 | logger | 9 | logger, app, path, express | Variable module: logger, app, ... (4) — handles mvc |
| 75 | app | 28 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 76 | app | 6 | app, express, request, app | Variable module: app, express, ... (4) — handles test |
| 77 | local | 45 | local, AsyncLocalStorage, app, local | Variable module: local, AsyncLocalStorage, ... (4) — handles test |
| 78 | assert | 12 | assert, headers, app, app | Variable module: assert, headers, ... (4) — handles test |
| 79 | ⚡ Performance | 5 | ⚡ Performance, 🚀 Improvements, Unreleased Changes, Unreleased Changes | Section module: ⚡ Performance, 🚀 Improvements, ... (4) — handles functionality |
| 80 | calls | 7 | calls, express, app, request | Variable module: calls, express, ... (4) — handles test |
| 81 | {title} | 3 | {title}, {title} | Document module: {title}, {title} — handles examples |
| 82 | apiv1 | 3 | apiv1, express | Variable module: apiv1, express — handles controllers |
| 83 | app | 8 | app, app, request, express | Variable module: app, app, ... (4) — handles test |
| 84 | app | 31 | app, id, app, app | Variable module: app, id, ... (4) — handles test |
| 85 | request | 10 | request, d, express, c | Variable module: request, d, ... (4) — handles test |
| 86 | document | 2 | document | Document module: document — handles test |
| 87 | express | 4 | express, request, app | Variable module: express, request, app — handles test |
| 88 | marked | 8 | marked, fs, express, html | Variable module: marked, fs, ... (4) — handles markdown |
| 89 | app | 13 | app, request, app, express | Variable module: app, request, ... (4) — handles test |
| 90 | fn1 | 76 | fn1, router, request, router | Variable module: fn1, router, ... (4) — handles test |
| 91 | app | 10 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 92 | cb | 8 | cb, after, request, app | Variable module: cb, after, ... (4) — handles test |
| 93 | express | 12 | express, user, name, err | Variable module: express, user, ... (4) — handles web-service |
| 94 | app | 3 | app, request | Variable module: app, request — handles test |
| 95 | user | 34 | user, app, request, tmpl | Variable module: user, app, ... (4) — handles test |
| 96 | document | 2 | document | Document module: document — handles downloads |
| 97 | app | 6 | app, express, cookie, cookieParser | Variable module: app, express, ... (4) — handles test |
| 98 | next | 36 | next | Variable module: next — handles examples |
| 99 | blog | 71 | blog, fn1, fn2, request | Variable module: blog, fn1, ... (4) — handles test |
| 100 | express | 63 | express, test, app, app | Variable module: express, test, ... (4) — handles test |
| 101 | app | 4 | app, express, request | Variable module: app, express, request — handles test |
| 102 | View | 53 | View, slice, debug | Variable module: View, slice, debug — handles lib |
| 103 | now | 10 | now, request, express, app | Variable module: now, request, ... (4) — handles test |
| 104 | app | 38 | app, fn1, app, app | Variable module: app, fn1, ... (4) — handles test |
| 105 | app | 20 | app, { Buffer }, assert, dest | Variable module: app, { Buffer }, ... (4) — handles test |
| 106 | app | 19 | app, app, express, app | Variable module: app, app, ... (4) — handles test |
| 107 | express | 6 | express, app, request, app | Variable module: express, app, ... (4) — handles test |
| 108 | format | 9 | format, express, users, b | Variable module: format, express, ... (4) — handles resource |
| 109 | app | 3 | app, request | Variable module: app, request — handles test |
| 110 | join | 12 | join, list, getCookies | Function module: join, list, getCookies — handles examples |
| 111 | app | 15 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 112 | app | 9 | app, express, utils, app | Variable module: app, express, ... (4) — handles test |
| 113 | pets | 7 | pets, express, verbose, escapeHtml | Variable module: pets, express, ... (4) — handles examples |
| 114 | db | 4 | db, body, id | Variable module: db, body, id — handles user |
| 115 | request | 3 | request, app | Variable module: request, app — handles acceptance |
| 116 | app | 10 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 117 | request | 3 | request, app | Variable module: request, app — handles acceptance |
| 118 | document | 2 | document | Document module: document — handles fixtures |
| 119 | createApp | 52 | createApp, send | Variable module: createApp, send — handles examples |
| 120 | express | 7 | express, app, app, app | Variable module: express, app, ... (4) — handles test |
| 121 | request | 12 | request, app, app, app | Variable module: request, app, ... (4) — handles test |
| 122 | obj | 14 | obj, prefix, dir, handler | Variable module: obj, prefix, ... (4) — handles mvc |
| 123 | request | 6 | request, express, app, app | Variable module: request, express, ... (4) — handles test |
| 124 | users | 5 | users, path, app, express | Variable module: users, path, ... (4) — handles examples |
| 125 | path | 7 | path, app, silent, logger | Variable module: path, app, ... (4) — handles error-pages |
| 126 | utils | 4 | utils, request, app | Variable module: utils, request, app — handles acceptance |
| 127 | from | 42 | from, createETagGenerator | Function module: from, createETagGenerator — handles lib |
| 128 | app | 11 | app, app, app, app | Variable module: app, app, ... (4) — handles test |
| 129 | request | 3 | request, app | Variable module: request, app — handles test |
| 130 | app | 121 | app, after, app, app | Variable module: app, after, ... (4) — handles test |
| 131 | blog | 19 | blog, admin, app, app | Variable module: blog, admin, ... (4) — handles test |
| 132 | request | 3 | request, app | Variable module: request, app — handles test |
| 133 | Express examples | 3 | Express examples, Express examples | Section module: Express examples, Express examples — handles examples |
| 134 | users | 2 | users | Variable module: users — handles examples |
| 135 | express | 6 | express, app, assert, app | Variable module: express, app, ... (4) — handles test |
| 136 | request | 3 | request, express | Variable module: request, express — handles test |
| 137 | str | 53 | str, app, { Buffer }, app | Variable module: str, app, ... (4) — handles test |

## Suggested Cypher Queries

Use `myc query` or the `cypher_query` MCP tool with these queries:

```cypher
// Find all callers of a god node
MATCH (caller)-[:CALLS]->(target {name: "<god_node_name>"})
RETURN caller.name, caller.file_path
ORDER BY caller.name
```

```cypher
// List functions with the most outgoing calls
MATCH (s)-[:CALLS]->()
RETURN s.name, s.kind, s.file_path, count(*) AS out_degree
ORDER BY out_degree DESC
LIMIT 20
```

```cypher
// Find all symbols in a specific file
MATCH (s {file_path: "<path/to/file>"})
RETURN s.name, s.kind, s.start_line
ORDER BY s.start_line
```

```cypher
// Find dead code (functions with no callers)
MATCH (s)
WHERE s.kind = "Function"
AND NOT ()-[:CALLS]->(s)
RETURN s.name, s.file_path
LIMIT 50
```
