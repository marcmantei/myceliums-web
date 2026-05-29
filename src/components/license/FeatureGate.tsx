"use client";

import { useLicense } from "./LicenseProvider";
import { FEATURE_GATES } from "@/lib/features";
import { Lock } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  /** Show blurred preview with upgrade CTA instead of hiding content entirely */
  softGate?: boolean;
}

export default function FeatureGate({
  feature,
  children,
  softGate = true,
}: FeatureGateProps) {
  const { canAccess } = useLicense();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (!softGate) {
    return null;
  }

  const gate = FEATURE_GATES[feature];
  const minPlan = gate?.plans[0] ?? "pro";

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm brightness-50">
        {children}
      </div>
      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm">
        <Lock className="mb-3 h-8 w-8 text-slate-500" />
        <p className="mb-1 text-sm font-medium text-slate-300">
          {gate?.label ?? "Premium Feature"}
        </p>
        <p className="mb-4 text-xs text-slate-500">
          Available on the {minPlan.charAt(0).toUpperCase() + minPlan.slice(1)}{" "}
          plan
        </p>
        <Link
          href="/upgrade"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
