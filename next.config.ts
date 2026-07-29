import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo>, so the static export needs a
// basePath or every asset 404s. CI sets NEXT_PUBLIC_BASE_PATH; leave it unset
// for `next dev` and for a custom domain served from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
