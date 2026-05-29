/**
 * Auth provider configuration for Myceliums SaaS.
 *
 * SETUP (Clerk - recommended for Next.js):
 * 1. Create a Clerk app at https://clerk.com
 * 2. Enable GitHub OAuth in Social Connections
 * 3. Set environment variables:
 *    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *    - CLERK_SECRET_KEY
 * 4. Install: npm install @clerk/nextjs
 * 5. Wrap layout.tsx with <ClerkProvider>
 *
 * ALTERNATIVE (Auth0):
 * 1. Create an Auth0 tenant
 * 2. Install: npm install @auth0/nextjs-auth0
 * 3. Set AUTH0_* environment variables
 *
 * The LicenseProvider will read the user's plan from JWT custom claims.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
  plan: "community" | "pro" | "enterprise";
  stripeCustomerId?: string;
  teamId?: string;
}

/**
 * Check if auth is configured.
 */
export function isAuthConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  );
}
