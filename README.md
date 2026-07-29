# myceliums-web

Marketing site for [Myceliums](https://github.com/marcmantei/myceliums) — a code
knowledge graph that gives AI agents structural understanding of a codebase.

Live at **[myceliums.marcmantei.com](https://myceliums.marcmantei.com)**.

## Stack

- **Next.js 16** (App Router) with `output: "export"` — fully static, no server
  runtime
- **React 19**, **Tailwind CSS 4**
- **Three.js** / react-three-fiber for the 3D graph views, **@xyflow/react** and
  **d3** for the 2D ones
- **GSAP** and **Framer Motion** for scroll and transition work
- **asciinema-player** for the terminal recordings

The graphs under `public/graphs/` are real Myceliums output, not mock data — each
carries the analyzer's own metadata block (`express.json`, for instance, records
1997 symbols and 2077 relationships across 137 communities). The demo files in
`public/demos/` are derived from them by `scripts/generate-demo-data.mjs`.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

To reproduce a production build the way CI does:

```bash
npm run build          # static export into out/
```

`NEXT_PUBLIC_BASE_PATH` sets the `basePath`. It stays unset locally and for the
custom domain; CI sets it when the site is served from a project subpath.

## Deployment

Pushing to `main` builds the static export and publishes it to GitHub Pages via
`.github/workflows/deploy-website.yml`. No secrets or hosting credentials are
involved. The custom domain is pinned by `public/CNAME`.

## License

Apache-2.0, matching the main project.
