import { existsSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo> but a custom domain from the
// root. `public/CNAME` is what pins the custom domain, so it is also the single
// source of truth for which of the two layouts we are building for: if it
// exists the site is served from the root and any basePath would prefix every
// asset with the repo name and 404. Deriving the answer here — rather than
// trusting NEXT_PUBLIC_BASE_PATH to be set correctly by whoever runs the build
// — makes the two files impossible to get out of sync.
const servedFromCustomDomain = existsSync(join(process.cwd(), "public", "CNAME"));

// Otherwise CI passes the base_path reported by actions/configure-pages
// ("/myceliums-web" for a project site). Unset for `next dev`.
const basePath = servedFromCustomDomain ? "" : process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.0.14"],
};

export default nextConfig;
