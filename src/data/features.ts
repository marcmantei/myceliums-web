import type { LucideIcon } from "lucide-react";
import {
  Network,
  Waves,
  CircleDot,
  Route,
  TerminalSquare,
  Plug,
  Search,
  Eye,
  Zap,
  Shield,
  FileQuestion,
  Brain,
  AlertTriangle,
  Download,
  GitCompare,
} from "lucide-react";

export type IconName = 
  | "network"
  | "waves"
  | "circleDot"
  | "route"
  | "terminalSquare"
  | "plug"
  | "search"
  | "eye"
  | "zap"
  | "shield"
  | "fileQuestion"
  | "brain"
  | "alertTriangle"
  | "download"
  | "gitCompare";

export const ICON_MAP: Record<IconName, LucideIcon> = {
  network: Network,
  waves: Waves,
  circleDot: CircleDot,
  route: Route,
  terminalSquare: TerminalSquare,
  plug: Plug,
  search: Search,
  eye: Eye,
  zap: Zap,
  shield: Shield,
  fileQuestion: FileQuestion,
  brain: Brain,
  alertTriangle: AlertTriangle,
  download: Download,
  gitCompare: GitCompare,
};

export interface HeroFeature {
  id: string;
  title: string;
  iconName: IconName;
  painPoint: string;
  tagline: string;
  shortDescription: string;
  metrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  beforeDemo: {
    title: string;
    lines: string[];
  };
  afterDemo: {
    title: string;
    lines: string[];
  };
}

export interface CompactFeature {
  title: string;
  description: string;
  iconName: IconName;
}

// 6 Hero Features - Impact-first narrative
export const HERO_FEATURES: HeroFeature[] = [
  {
    id: "knowledge-graph",
    title: "Knowledge Graph",
    iconName: "network",
    painPoint: "How can you understand any codebase without manually reading every file and tracing relationships by hand?",
    tagline: "Understand any codebase in seconds. 20+ languages parsed into a complete map of every symbol, relationship, and call chain. No manual setup.",
    shortDescription: "Every symbol, relationship, and call chain across your entire codebase, structured, queryable, and ready for AI agents.",
    metrics: [
      {
        label: "Languages",
        value: "20",
        improvement: "from manual parsing to automatic",
      },
      {
        label: "Symbols parsed",
        value: "38K",
        improvement: "in Django alone",
      },
      {
        label: "Query time",
        value: "0.003s",
        improvement: "vs hours of manual tracing",
      },
    ],
    beforeDemo: {
      title: "Without Knowledge Graph",
      lines: [
        '$ grep -r "className=\\"button\\"" --include="*.tsx"',
        "src/ui/Button.tsx: export const Button = ()",
        "src/Button.tsx: export function Button()",
        "src/components/Button.tsx: const Button = ()",
        "",
        "$ find . -name '*.tsx' | xargs grep -l 'Button'",
        "src/pages/Login.tsx",
        "src/pages/Signup.tsx",
        "src/pages/Dashboard.tsx",
        "src/pages/Settings.tsx",
        "",
        "// Still missing which functions use which Button?",
        "// How are they imported? What's the call flow?",
        "// Manual investigation required... Hours of work",
      ],
    },
    afterDemo: {
      title: "With Knowledge Graph",
      lines: [
        '$ myc query "MATCH (s:Symbol)',
        "  WHERE s.name = 'Button'",
        '  RETURN s.name, s.file, count(*) as callers"',
        "",
        "┌──────────┬──────────────────┬─────────┐",
        "│ s.name   │ s.file           │ callers │",
        "├──────────┼──────────────────┼─────────┤",
        "│ Button   │ src/ui/Button    │ 47      │",
        "└──────────┴──────────────────┴─────────┘",
        "",
        "✓ 1 query. Complete graph. 0.003s",
      ],
    },
  },
  {
    id: "impact-detection",
    title: "Impact Detection",
    iconName: "waves",
    painPoint: "How can you confidently refactor without knowing exactly what breaks?",
    tagline: "Know exactly what breaks before you ship. Every affected function, process, and dependency in one query.",
    shortDescription: "See the blast radius of any change: every affected function, process, and dependency.",
    metrics: [
      {
        label: "Tool calls reduced",
        value: "94%",
        improvement: "47 calls → 3 calls",
      },
      {
        label: "False negatives",
        value: "0",
        improvement: "complete blast radius",
      },
      {
        label: "Query time",
        value: "0.005s",
        improvement: "real-time results",
      },
    ],
    beforeDemo: {
      title: "Basic Agent (47 calls)",
      lines: [
        "User: 'What breaks if I refactor getUserName()?'",
        "",
        "Agent: Calling grep...",
        "$ grep -r 'getUserName' --include='*.ts'",
        "src/user/profile.ts: export const getUserName()",
        "src/user/utils.ts: import { getUserName }",
        "src/api/endpoints.ts: getUserName from utils",
        "",
        "Agent: Calling grep for callers...",
        "$ grep -r 'getUserName' src/",
        "... 40+ more tool calls ...",
        "",
        "Agent: Still missing 3 indirect callers",
        "Result: INCOMPLETE, risky refactor",
      ],
    },
    afterDemo: {
      title: "KG Agent (3 calls)",
      lines: [
        "User: 'What breaks if I refactor getUserName()?'",
        "",
        "Agent: Querying Knowledge Graph...",
        '$ myc query "MATCH (n)-[:CALLS*1..]->(getUserName)',
        '  RETURN n.name"',
        "",
        "Direct callers: profileLoader, apiGateway, auth",
        "Process callers: checkoutProcess, authFlow, sessionInit",
        "All dependencies: LanceDB, tokenValidator, auditLogger",
        "",
        "✓ 3 calls. Complete blast radius. 0.005s",
        "Result: SAFE, confident refactor",
      ],
    },
  },
  {
    id: "community-detection",
    title: "Community Detection",
    iconName: "circleDot",
    painPoint: "How do you discover the true architecture of your codebase instead of guessing from folder names?",
    tagline: "See the real architecture of your codebase, not what the folder structure says, but how the code actually connects.",
    shortDescription: "Leiden algorithm groups related code into logical clusters revealing your true architecture.",
    metrics: [
      {
        label: "Communities found",
        value: "86",
        improvement: "in Django, invisible to IDEs",
      },
      {
        label: "Coupling insights",
        value: "7",
        improvement: "surprising connections revealed",
      },
      {
        label: "Time saved",
        value: "Hours",
        improvement: "vs manual architecture review",
      },
    ],
    beforeDemo: {
      title: "Folder Structure (Lies)",
      lines: [
        "src/",
        "├── auth/           ← looks isolated",
        "├── payments/       ← looks separate",
        "├── users/          ← looks independent",
        "├── api/",
        "└── utils/",
        "",
        "IDE says: 3 modules, loosely coupled",
        "Reality: auth secretly calls payments,",
        "payments references user data,",
        "users imports auth for validation",
        "",
        "God nodes: apiRouter (47 deps), utils (53 deps)",
        "Hidden bottlenecks: undetectable in tree view",
      ],
    },
    afterDemo: {
      title: "Knowledge Graph (Truth)",
      lines: [
        "Community 1: Auth Flow",
        "  - handleAuth, validateToken, sessionManager",
        "  - Internal coupling: 0.92",
        "",
        "Community 2: Payment Pipeline",
        "  - processPayment, validateCard, auditLog",
        "  - Surprising: 0.87 coupling to auth (??)",
        "",
        "God Nodes:",
        "  - apiRouter: 47 outgoing edges (bottleneck)",
        "  - utils: 53 incoming (too general?)",
        "",
        "✓ Architecture gaps revealed",
      ],
    },
  },
  {
    id: "process-tracing",
    title: "Process Tracing",
    iconName: "route",
    painPoint: "How can new team members understand the architecture without weeks of manual code reading?",
    tagline: "New team members understand architecture in minutes, not weeks. Every execution path traced automatically.",
    shortDescription: "Automatically traces execution flows from entry points through entire call chains.",
    metrics: [
      {
        label: "Onboarding time",
        value: "Minutes",
        improvement: "vs weeks of code reading",
      },
      {
        label: "Execution paths",
        value: "100%",
        improvement: "traced automatically",
      },
      {
        label: "Accuracy",
        value: "Complete",
        improvement: "no manual gaps",
      },
    ],
    beforeDemo: {
      title: "Manual Investigation",
      lines: [
        "New engineer: 'How does login work?'",
        "",
        "Manual trace:",
        "1. Read /routes/login.tsx",
        "2. Find handleLogin() - check auth/",
        "3. Check validateToken - find validator",
        "4. Trace session - check session/",
        "5. Check middleware - more deps",
        "6. Still missing: payments integration?",
        "7. Database calls? Cache layer?",
        "",
        "Time: 3-5 hours for one flow",
        "Risk: Missing pieces, incomplete mental model",
      ],
    },
    afterDemo: {
      title: "Automated Process Tracing",
      lines: [
        '$ myc trace --entry-point "POST /login"',
        "",
        "Login Flow:",
        "└── POST /login",
        "    ├── handleLogin(req)",
        "    ├── validateToken(token)",
        "    ├── sessionManager.create()",
        "    ├── auditLog.record()",
        "    ├── emailNotify() [async]",
        "    └── cache.set(session)",
        "",
        "✓ Complete flow. Seconds to understand",
      ],
    },
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search",
    iconName: "search",
    painPoint: "Why spend 12 seconds searching 50k files when you could get precise results instantly?",
    tagline: "Find the right code instantly. Keyword precision meets semantic understanding, zero cloud required.",
    shortDescription: "BM25 keyword + semantic vector search with local embeddings and zero cloud calls.",
    metrics: [
      {
        label: "Query speed",
        value: "0.003s",
        improvement: "vs 12s grep through 50k files",
      },
      {
        label: "Precision",
        value: "99%",
        improvement: "irrelevant results filtered",
      },
      {
        label: "Cloud calls",
        value: "0",
        improvement: "everything stays local",
      },
    ],
    beforeDemo: {
      title: "Grep (Fast but Dumb)",
      lines: [
        "$ grep -r 'process.*payment' --include='*.ts'",
        "src/payments/process.ts: processPayment()",
        "src/utils/logging.ts: log('processing payment')",
        "src/ui/Button.tsx: Process Payment button",
        "src/docs/api.md: describes processPayment",
        "src/tests/fixtures.json: mock processPayment",
        "",
        "40 of 47 results are irrelevant",
        "Time: 12 seconds across 50k files",
      ],
    },
    afterDemo: {
      title: "Hybrid Search (0.003s)",
      lines: [
        "$ myc search 'payment processing logic'",
        "",
        "Results (ranked by relevance):",
        "1. src/payments/process.ts (0.98)",
        "   processPayment() → validateCard()...",
        "2. src/payments/validator.ts (0.94)",
        "   validateCard() → checkFunds()...",
        "3. src/payments/audit.ts (0.87)",
        "   auditPayment() → log transaction...",
        "",
        "✓ 3 relevant results. 0.003s. Local, no cloud",
      ],
    },
  },
  {
    id: "mcp-integration",
    title: "MCP Integration",
    iconName: "plug",
    painPoint: "Why do AI agents make 100+ blind grep calls when they could understand your entire codebase?",
    tagline: "Give your AI agent real intelligence. Structured tools plus deep semantic context from the knowledge graph.",
    shortDescription: "Myceliums analyzes your codebase, builds a semantic knowledge graph, and exposes it to Claude, Cursor, and Windsurf via MCP. Your agent doesn't just get tools, it gets understanding: every symbol, relationship, and dependency, ready to reason about.",
    metrics: [
      {
        label: "Tool calls reduced",
        value: "~80%",
        improvement: "15+ grep calls → 3 KG queries *",
      },
      {
        label: "Context size reduced",
        value: "~99%",
        improvement: "50K tokens → 500 tokens per query *",
      },
      {
        label: "Complete results",
        value: "100%",
        improvement: "full call chain, no missed callers *",
      },
    ],
    beforeDemo: {
      title: "Basic Agent (100+ calls)",
      lines: [
        "User: 'Refactor getUserName safely'",
        "",
        "Agent: Making blind grep calls...",
        "$ grep -r 'getUserName' .",
        "$ grep -r 'getUserName.*import'",
        "$ grep -r 'function.*User'",
        "$ grep -r 'class.*User'",
        "... 96 more grep calls ...",
        "",
        "Result: Still incomplete, lots of noise",
        "Tokens spent: 50,000+ on context",
      ],
    },
    afterDemo: {
      title: "KG Agent (5 calls)",
      lines: [
        "User: 'Refactor getUserName safely'",
        "",
        "Agent: Using KG tools...",
        "Tool 1: graph.getSymbol(name='getUserName')",
        "Tool 2: graph.getCallers(symbol)",
        "Tool 3: graph.getImpact(symbol)",
        "Tool 4: graph.getRelated(symbol, depth=2)",
        "Tool 5: code.getDefinition(symbol)",
        "",
        "Result: Complete, accurate, safe refactor",
        "Tokens spent: 2,000 precise context",
      ],
    },
  },
];

// Remaining 10 compact features (non-hero)
export const COMPACT_FEATURES: CompactFeature[] = [
  {
    title: "Cypher Queries",
    description: "Query your codebase like a database with Neo4j's Cypher language. MATCH, WHERE, RETURN, ORDER BY, LIMIT.",
    iconName: "terminalSquare",
  },
  {
    title: "Interactive Visualization",
    description: "Explore your code graph with force-directed D3.js visualizations. See clusters, dependencies, and patterns.",
    iconName: "eye",
  },
  {
    title: "Token Optimization",
    description: "5-20x fewer tokens for code review. Structural summaries instead of full files.",
    iconName: "zap",
  },
  {
    title: "Local-First",
    description: "Your code never leaves your machine. No API keys, no cloud, no telemetry. Everything stays local.",
    iconName: "shield",
  },
  {
    title: "Design Rationale",
    description: "Extracts WHY/TODO/HACK comments and links them to code. Know the reasoning, not just structure.",
    iconName: "fileQuestion",
  },
  {
    title: "Architectural Intelligence",
    description: "God nodes, surprising connections, and auto-generated reports surface bottlenecks and hidden coupling.",
    iconName: "brain",
  },
  {
    title: "Knowledge Gaps",
    description: "Finds untested code, isolated modules, and documentation holes automatically.",
    iconName: "alertTriangle",
  },
  {
    title: "Multi-Format Export",
    description: "Export to GraphML, Neo4j Cypher, SVG, JSON, or generate an Obsidian wiki from your graph.",
    iconName: "download",
  },
  {
    title: "Graph Diff",
    description: "Compare snapshots to track how your architecture evolves over time.",
    iconName: "gitCompare",
  },
];
