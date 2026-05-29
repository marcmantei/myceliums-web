"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Plan } from "@/lib/features";
import { hasFeatureAccess, getDefaultPlan } from "@/lib/features";

interface LicenseContextValue {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  canAccess: (feature: string) => boolean;
}

const LicenseContext = createContext<LicenseContextValue>({
  plan: "community",
  setPlan: () => {},
  canAccess: () => true,
});

export function useLicense() {
  return useContext(LicenseContext);
}

export function LicenseProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>(getDefaultPlan);

  const canAccess = useCallback(
    (feature: string) => hasFeatureAccess(feature, plan),
    [plan]
  );

  return (
    <LicenseContext.Provider value={{ plan, setPlan, canAccess }}>
      {children}
    </LicenseContext.Provider>
  );
}
