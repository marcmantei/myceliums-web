/**
 * Stripe webhook handler.
 *
 * NOTE: This module requires server-side execution (API routes).
 * To enable, remove `output: "export"` from next.config.ts.
 *
 * Webhook setup:
 * 1. In Stripe Dashboard → Developers → Webhooks
 * 2. Add endpoint: https://your-domain.com/api/webhooks/stripe
 * 3. Select events:
 *    - checkout.session.completed
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_failed
 * 4. Copy the signing secret to STRIPE_WEBHOOK_SECRET
 *
 * Local testing:
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */

import type { Plan } from "@/lib/features";

export interface WebhookResult {
  event: string;
  userId?: string;
  plan?: Plan;
  action: "upgrade" | "downgrade" | "cancel" | "payment_failed" | "unknown";
}

/**
 * Process a Stripe webhook event.
 * Returns the action to take (update user plan, send email, etc.)
 *
 * Usage in API route:
 * ```ts
 * export async function POST(req: Request) {
 *   const body = await req.text();
 *   const sig = req.headers.get("stripe-signature")!;
 *   const result = await handleWebhook(body, sig);
 *   // Update user plan in your database based on result
 *   return new Response("ok");
 * }
 * ```
 */
export async function handleWebhook(
  body: string,
  signature: string
): Promise<WebhookResult> {
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as Plan | undefined;
      return {
        event: event.type,
        userId: userId ?? undefined,
        plan: plan ?? "pro",
        action: "upgrade",
      };
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const status = subscription.status;
      if (status === "active") {
        return { event: event.type, action: "upgrade" };
      }
      return { event: event.type, action: "downgrade" };
    }

    case "customer.subscription.deleted": {
      return {
        event: event.type,
        plan: "community",
        action: "cancel",
      };
    }

    case "invoice.payment_failed": {
      return {
        event: event.type,
        action: "payment_failed",
      };
    }

    default:
      return { event: event.type, action: "unknown" };
  }
}
