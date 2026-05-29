/**
 * Stripe configuration for Myceliums SaaS.
 *
 * SETUP:
 * 1. Create a Stripe account at https://stripe.com
 * 2. Create two products: "Myceliums Pro" ($19/mo) and "Myceliums Enterprise" ($99/mo)
 * 3. Copy the price IDs and set them in your environment
 * 4. Set up a webhook endpoint pointing to /api/webhooks/stripe
 * 5. Copy the webhook signing secret
 *
 * ENVIRONMENT VARIABLES:
 * - STRIPE_SECRET_KEY: Stripe secret key (sk_test_... or sk_live_...)
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret (whsec_...)
 * - NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: Price ID for Pro plan
 * - NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID: Price ID for Enterprise plan
 * - NEXT_PUBLIC_APP_URL: Base URL of the app (e.g., https://app.myceliums.ai)
 */

export const stripeConfig = {
  proPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
  enterprisePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    stripeConfig.proPriceId &&
    stripeConfig.enterprisePriceId
  );
}
