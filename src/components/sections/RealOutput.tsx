"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/section-wrapper";
import TerminalFrame from "@/components/ui/terminal-frame";

interface Demo {
  id: string;
  title: string;
  command: string;
  description: string;
  output: string;
}

const DEMOS: Demo[] = [
  {
    id: "impact",
    title: "Impact Detection",
    command: "$ myc impact --diff auth-changes.patch",
    description: "See what breaks before you merge. Function-level blast radius, not file-level guessing.",
    output: `Impact Report for demo-api
============================================================

Directly changed symbols (3):
  [Modified] hash_password (Function) -- auth.py
  [Modified] verify_password (Function) -- auth.py
  [Modified] generate_jwt_token (Function) -- auth.py

Indirectly affected symbols (9):
  [caller at distance 1] login (Function) -- routes/auth_routes.py
  [caller at distance 1] refresh_token (Function) -- routes/auth_routes.py
  [caller at distance 1] register (Function) -- routes/auth_routes.py
  [callee at distance 2] log_request (Function) -- middleware.py
  [callee at distance 2] get_user_by_username (Function) -- database.py
  [callee at distance 2] Comment.to_dict (Method) -- models.py
  [callee at distance 2] get_user (Function) -- routes/user_routes.py
  [callee at distance 2] get_user_by_email (Function) -- database.py
  [callee at distance 2] create_user (Function) -- database.py

Affected files (6):
  auth.py, database.py, middleware.py,
  models.py, routes/auth_routes.py, routes/user_routes.py

Risk score: 2.04 / 10.00`,
  },
  {
    id: "cypher",
    title: "Cypher Queries",
    command: '$ myc query "MATCH (n)-[:CALLS]->(m) RETURN n.name, m.name LIMIT 10"',
    description: "Query your codebase like a database. Same syntax as Neo4j. No server needed.",
    output: `n.name              | m.name
-----------------------------------------
verify_password     | hash_password
get_user_from_token | verify_jwt_token
create_user         | User
update_user         | get_user
create_post         | Post
update_post         | get_post
increment_view_count| get_post
create_comment      | Comment
update_comment      | get_comment
create_app          | setup_logging

10 row(s)`,
  },
  {
    id: "processes",
    title: "Process Tracing",
    command: "$ myc processes demo-api",
    description: "Trace every execution path. Onboard new devs in hours, not weeks.",
    output: `Processes in demo-api:

  1. create_app flow (3 steps)
     create_app → setup_logging → setup_error_handlers

  2. register flow (8 steps)
     register → log_request → get_user_by_username
     → get_user_by_email → hash_password → create_user
     → User → to_dict

  3. login flow (7 steps)
     login → log_request → get_user_by_username
     → verify_password → hash_password
     → generate_jwt_token → to_dict

  4. decorated_function flow (6 steps)
     decorated_function → get_user_from_token
     → verify_jwt_token → get_user → log_request
     → to_dict`,
  },
  {
    id: "search",
    title: "Hybrid Search",
    command: '$ myc search "authenticate"',
    description: "BM25 + semantic + hybrid. Three search modes, zero cloud dependencies.",
    output: `Search results for 'authenticate' in demo-api:

  1. hash_password (Function) — auth.py:14
     [score: 4.55]
     def hash_password(password:

  2. verify_password (Function) — auth.py:31
     [score: 3.00]
     def verify_password(password:

  3. register (Function) — routes/auth_routes.py:18
     [score: 1.76]
     def register():

  4. login (Function) — routes/auth_routes.py:52
     [score: 1.52]
     def login():

  5. get_current_user (Function) — routes/auth_routes.py:84
     [score: 1.21]`,
  },
];

export default function RealOutput() {
  const [activeDemo, setActiveDemo] = useState(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === activeDemo) || DEMOS[0];

  return (
    <SectionWrapper id="real-output" className="py-24 sm:py-32" stagger>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12" data-animate>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Real output. Not mockups.
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Every output below is from an actual <code className="text-accent">myc</code> run against a demo API codebase.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" data-animate>
          {DEMOS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDemo(d.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeDemo === d.id
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-center text-white/60 mb-6 text-sm" data-animate>
          {demo.description}
        </p>

        {/* Terminal output */}
        <div data-animate>
          <TerminalFrame title="myceliums" variant="success">
            <div className="space-y-1 text-sm">
              <div className="text-success font-semibold">{demo.command}</div>
              <div className="mt-3 text-text-secondary whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {demo.output}
              </div>
            </div>
          </TerminalFrame>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Run it yourself: <code className="text-accent/60">cargo install myc && myc analyze . && myc impact</code>
        </p>
      </div>
    </SectionWrapper>
  );
}
