import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CNAME_FILE = join(process.cwd(), "public", "CNAME");

// Where GitHub Pages serves this repo when no custom domain is pinned.
const PROJECT_SITE_URL = "https://marcmantei.github.io/myceliums-web";

/**
 * Reads the custom domain pinned in `public/CNAME`, if there is one.
 *
 * That file is what attaches the domain to the GitHub Pages deployment, so it
 * is the single source of truth for the host the site is actually served from
 * — the same file `next.config.ts` reads to decide whether the export needs a
 * basePath.
 */
function pinnedCustomDomain(): string | null {
  if (!existsSync(CNAME_FILE)) return null;
  const domain = readFileSync(CNAME_FILE, "utf8").trim();
  return domain.length > 0 ? domain : null;
}

/**
 * The origin the deployed site answers on.
 *
 * Metadata that resolves against a different host — `metadataBase`, canonical
 * links, Open Graph URLs — sends crawlers and link unfurlers to a domain that
 * does not serve this site, so this is derived from the deploy configuration
 * rather than written out by hand where it can drift.
 *
 * Resolved once at build time; the static export has no request-time host.
 */
export const siteUrl: string = (() => {
  const domain = pinnedCustomDomain();
  return domain ? `https://${domain}` : PROJECT_SITE_URL;
})();
