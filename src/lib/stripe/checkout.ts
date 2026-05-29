/**
 * Stripe checkout session creation.
 *
 * NOTE: This module requires server-side execution (API routes).
 * It will NOT work with `output: "export"` in next.config.ts.
 * To enable SaaS mode, remove `output: "export"` and deploy to Vercel/Node.
 */

import type { Plan } from "@/lib/features";
import { stripeConfig } from "./config";

interface CreateCheckoutParams {
  userId: string;
  email: string;
  plan: Exclude<Plan, "community">;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Create a Stripe Checkout Session for plan upgrade.
 * Call this from an API route handler.
 */
export async function createCheckoutSession(params: CreateCheckoutParams) {
  // Dynamic import to avoid bundling stripe in the client
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  const priceId =
    params.plan === "pro"
      ? stripeConfig.proPriceId
      : stripeConfig.enterprisePriceId;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: params.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url:
      params.successUrl ?? `${stripeConfig.appUrl}/explore?upgraded=true`,
    cancel_url: params.cancelUrl ?? `${stripeConfig.appUrl}/upgrade`,
    metadata: {
      userId: params.userId,
      plan: params.plan,
    },
  });

  return { url: session.url, sessionId: session.id };
}

/**
 * Create a Stripe Customer Portal session for subscription management.
 */
export async function createPortalSession(customerId: string) {
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${stripeConfig.appUrl}/explore`,
  });

  return { url: session.url };
}
