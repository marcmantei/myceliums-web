/**
 * Analytics configuration for Myceliums.
 *
 * Supports PostHog (recommended, self-hostable, GDPR-konform)
 * or any custom analytics backend.
 *
 * SETUP:
 * 1. Create PostHog account at https://posthog.com (free tier: 1M events/month)
 * 2. Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST
 * 3. For self-hosted PostHog, set host to your instance URL
 *
 * ENVIRONMENT VARIABLES:
 * - NEXT_PUBLIC_POSTHOG_KEY: PostHog project API key
 * - NEXT_PUBLIC_POSTHOG_HOST: PostHog host (default: https://app.posthog.com)
 * - NEXT_PUBLIC_ANALYTICS_ENABLED: "true" to enable (default: disabled)
 */

export const analyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
};

export function isAnalyticsConfigured(): boolean {
  return analyticsConfig.enabled && !!analyticsConfig.posthogKey;
}
