"use client";

import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Community",
    price: "Free",
    description: "Self-hosted, open source",
    features: [
      "Graph overview visualization",
      "Static graph rendering",
      "Manual webhook integration",
      "Single user",
      "Full AGPL source code",
    ],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19/mo",
    description: "For individual developers",
    features: [
      "Everything in Community",
      "Interactive drill-down visualization",
      "Semantic search in graph",
      "Node detail with semantic neighbors",
      "API access",
      "Managed cloud hosting",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    disabled: false,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99/mo",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Shared team knowledge graphs",
      "Cross-repo dependency visualization",
      "Role-based access control",
      "Audit logging",
      "Dedicated support",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    disabled: false,
    highlight: false,
  },
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Choose Your Plan
        </h1>
        <p className="mb-12 text-center text-slate-400">
          Unlock the full power of your knowledge graph
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 ${
                plan.highlight
                  ? "border-indigo-500 bg-slate-900 shadow-lg shadow-indigo-500/10"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              <h2 className="text-lg font-bold text-white">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-white">
                  {plan.price}
                </span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium ${
                  plan.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : plan.disabled
                      ? "cursor-default bg-slate-800 text-slate-500"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Self-hosted Community edition is always free under AGPL-3.0.{" "}
          <Link href="/" className="text-indigo-400 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
