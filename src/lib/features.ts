export type Plan = "community" | "pro" | "enterprise";

export interface FeatureConfig {
  id: string;
  label: string;
  plans: Plan[];
}

/**
 * Central feature gate configuration.
 * Each feature lists which plans have access.
 */
export const FEATURE_GATES: Record<string, FeatureConfig> = {
  interactiveDrillDown: {
    id: "interactiveDrillDown",
    label: "Interactive Drill-Down",
    plans: ["pro", "enterprise"],
  },
  semanticSearch: {
    id: "semanticSearch",
    label: "Semantic Search",
    plans: ["pro", "enterprise"],
  },
  nodeDetail: {
    id: "nodeDetail",
    label: "Node Detail Panel",
    plans: ["pro", "enterprise"],
  },
  teamGraphs: {
    id: "teamGraphs",
    label: "Shared Team Graphs",
    plans: ["enterprise"],
  },
  apiAccess: {
    id: "apiAccess",
    label: "API Access",
    plans: ["pro", "enterprise"],
  },
};

/**
 * Check if a plan has access to a feature.
 */
export function hasFeatureAccess(feature: string, plan: Plan): boolean {
  const gate = FEATURE_GATES[feature];
  if (!gate) return true; // Unknown features are ungated
  return gate.plans.includes(plan);
}

/**
 * Get the current plan from environment or config.
 * In self-hosted mode, reads from NEXT_PUBLIC_MYCELIUM_PLAN.
 * In SaaS mode, this will be overridden by the auth provider.
 */
export function getDefaultPlan(): Plan {
  const envPlan = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_MYCELIUM_PLAN as Plan | undefined)
    : undefined;
  return envPlan || "community";
}
