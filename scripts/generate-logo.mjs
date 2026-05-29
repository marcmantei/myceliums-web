#!/usr/bin/env node
/**
 * generate-logo.mjs
 *
 * Uses Gemini image generation to create myceliums logo concepts.
 * Generates multiple variants for each logo direction.
 *
 * Requirements:
 *   - GEMINI_API_KEY in environment or ~/.env or ../mitbeziehung.de/.env
 *
 * Usage:
 *   node scripts/generate-logo.mjs
 *   node scripts/generate-logo.mjs --variants 6
 *   node scripts/generate-logo.mjs --direction 2
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { GoogleGenAI } from '@google/genai'

// ── Configuration ──────────────────────────────────────────────────────────────

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..')
const OUTPUT_DIR = join(ROOT, 'public', 'logo-concepts')
const VARIANTS_PER_DIRECTION = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--variants') || '4')
const SINGLE_DIRECTION = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--direction') || '0')

// Find API key
function findApiKey() {
  // 1. Environment variable
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY

  // 2. Local .env
  const localEnv = join(ROOT, '..', '.env')
  if (existsSync(localEnv)) {
    const match = readFileSync(localEnv, 'utf-8').match(/GEMINI_API_KEY=(.+)/)
    if (match) return match[1].trim()
  }

  // 3. mitbeziehung.de .env (sibling project)
  const siblingEnv = resolve(ROOT, '..', '..', 'mitbeziehung.de', '.env')
  if (existsSync(siblingEnv)) {
    const match = readFileSync(siblingEnv, 'utf-8').match(/GEMINI_API_KEY=(.+)/)
    if (match) return match[1].trim()
  }

  // 4. Home .env
  const homeEnv = join(process.env.HOME || '/root', '.env')
  if (existsSync(homeEnv)) {
    const match = readFileSync(homeEnv, 'utf-8').match(/GEMINI_API_KEY=(.+)/)
    if (match) return match[1].trim()
  }

  return null
}

const apiKey = findApiKey()
if (!apiKey) {
  console.error('GEMINI_API_KEY not found. Set it in environment, .env, or sibling project.')
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })

// ── Brand Context ────────────────────────────────────────────────────────────

const BRAND_CONTEXT = `
PRODUCT: myceliums — a code knowledge graph engine for AI agents.
It parses source code into a structured graph of symbols, relationships,
and communities. Built in Rust, local-first, open source (MIT).

BRAND NAME: "myceliums" — inspired by the underground fungal network
(mycelium) that connects trees in a forest. The product connects
symbols in a codebase the same way.

IDENTITY: The "my" in myceliums is the accent element (indigo #6366F1).
The rest "celiums" is white/neutral.

BRAND COLORS:
- Primary accent: #6366F1 (indigo)
- Accent glow: #818CF8 (lighter indigo)
- Background: #09090B (near-black)
- Foreground: #FAFAFA (near-white)
- Secondary: #10B981 (emerald green — used for success/communities)
- Tertiary: #F59E0B (amber — used for warnings/third community)

BRAND PERSONALITY: Technical, precise, developer-focused. Not cute or
playful — sophisticated and structural. Think: the intersection of
biology and computer science.
`

// ── Logo Directions ──────────────────────────────────────────────────────────

const DIRECTIONS = [
  {
    name: 'hex-tight-thick-a',
    prompt: `Design a minimal, modern logo mark for "myceliums".

${BRAND_CONTEXT}

DIRECTION: Three hexagons arranged in a tight triangular cluster —
partially overlapping. Indigo (#6366F1) top, emerald (#10B981) bottom-left,
amber (#F59E0B) bottom-right. Each hex has 1-2 smaller child hexes on
its outer edges.

CRITICAL: The hexagon outlines must be VERY THICK — bold, heavy stroke
weight (at least 8-10% of the hex width). The hexagons should feel solid,
structural, like heavy architectural frames. NOT thin delicate lines.
Think: bold engineering blueprints, thick marker strokes.

In the center gap where the three hexes overlap, ORGANIC mycelial threads
weave between them — thin, curving, branching filaments with small
dot-nodes at connection points. The contrast between the THICK hex frames
and the THIN organic threads is the visual key.

Small child hexes also have thick outlines (proportionally).

STYLE: Heavy-weight outlined hexagons, no fill (or dark fill matching
background). Thin organic threads in lighter indigo (#818CF8). Dark
background (#09090B). Clean, bold, print-friendly. Works at 16px favicon.

FORMAT: Square, dark background (#09090B), centered. Logo mark only — no text.
Output size: 1024×1024 pixels.`,
  },
  {
    name: 'hex-tight-thick-b',
    prompt: `Design a minimal, modern logo mark for "myceliums".

${BRAND_CONTEXT}

DIRECTION: Three hexagons in a tight triangle arrangement with small gaps.
Colors: indigo (#6366F1), emerald (#10B981), amber (#F59E0B).

CRITICAL REQUIREMENT: The hexagon borders must be EXTRA THICK and BOLD —
heavy stroke width, at least 6-8px equivalent at logo scale. The hexagons
should look CHUNKY and SOLID, like heavy frames or containers. This is
the defining visual trait — bold, thick, structural hexagons.

Each hexagon has 1-3 SMALLER child hexagons (same thick outline style,
scaled down) clustered around its edges. The child hexes inherit the
thick-outline aesthetic.

Between all the hexagons, DELICATE organic mycelial threads grow — thin,
curving, branching. The threads are much thinner than the hex outlines,
creating a strong contrast: heavy structure vs delicate organic growth.
Small dot-nodes where threads connect to hex edges.

STYLE: Very bold/thick hexagon outlines (the thickest element in the logo).
Delicate thin organic threads. Dark background (#09090B). The thick hexes
should dominate visually — the threads are subtle connecting tissue.

FORMAT: Square, dark background (#09090B), centered. Logo mark only — no text.
Output size: 1024×1024 pixels.`,
  },
  {
    name: 'hex-tight-thick-c',
    prompt: `Design a minimal, modern logo mark for "myceliums".

${BRAND_CONTEXT}

DIRECTION: Three BOLD hexagons arranged in a triangular cluster. The
hexagons have VERY THICK outlines — the stroke width should be roughly
12-15% of the hexagon's diameter. They should feel HEAVY, SUBSTANTIAL,
like thick metal frames or bold architectural elements.

Colors: indigo (#6366F1) top-center, emerald (#10B981) bottom-left,
amber (#F59E0B) bottom-right. The hexagons partially overlap or sit
very close together.

Each hex has 1-2 child hexes (also thick-outlined, smaller) attached to
outer edges. The fractal hierarchy is subtle but present.

In the overlapping center zone, organic mycelial threads grow between
the hexes — these are THIN and delicate, contrasting sharply with the
thick hex borders. The threads branch, curve naturally, and have small
dot-nodes. Some threads trail off with tiny growth tips.

The CONTRAST is everything: thick rigid hexagons = code structure,
thin organic threads = discovered connections.

STYLE: Extra-bold hex outlines. Thin organic threads. Minimal child hexes.
Dark background (#09090B). Must reproduce well in print at small sizes —
the thick outlines ensure readability.

FORMAT: Square, dark background (#09090B), centered. Logo mark only — no text.
Output size: 1024×1024 pixels.`,
  },
  {
    name: 'hex-tight-thick-d',
    prompt: `Design a minimal, modern logo mark for "myceliums".

${BRAND_CONTEXT}

DIRECTION: Three hexagons with EXTREMELY THICK borders arranged in a
tight triangle. Think of the hexagons as thick, bold, hollow frames —
you can see through them, but the borders are massive and chunky.

Indigo (#6366F1), emerald (#10B981), amber (#F59E0B). Arranged so they
slightly overlap, creating an interlocking effect where the thick borders
cross each other.

1-2 small child hexes per parent (also thick borders, scaled down).

Organic mycelial threads in the gaps — thin, flowing, alive. With
dot-nodes where they touch hex edges. The threads should feel like they're
growing THROUGH the gaps in the thick hex framework.

IMPORTANT: The hex borders should be the THICKEST element — at least
3-4x thicker than the organic threads. The hexes look like they were
drawn with a very fat marker. Bold, confident, structural.

STYLE: Fat-bordered hexagons. Delicate organic threads. High contrast.
Dark background (#09090B). Iconic, memorable, print-ready.

FORMAT: Square, dark background (#09090B), centered. Logo mark only — no text.
Output size: 1024×1024 pixels.`,
  },
]

// ── Generation ───────────────────────────────────────────────────────────────

async function generateLogo(direction, variantIndex) {
  console.log(`  Generating ${direction.name} variant ${variantIndex + 1}...`)

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: [
      {
        role: 'user',
        parts: [{ text: direction.prompt }],
      },
    ],
    config: {
      responseModalities: ['image', 'text'],
    },
  })

  const parts = response.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.inlineData) {
      return Buffer.from(part.inlineData.data, 'base64')
    }
  }

  for (const part of parts) {
    if (part.text) {
      console.log(`    Model note: ${part.text.substring(0, 200)}`)
    }
  }

  throw new Error(`No image returned for ${direction.name} variant ${variantIndex + 1}`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const directions = SINGLE_DIRECTION > 0
    ? [DIRECTIONS[SINGLE_DIRECTION - 1]]
    : DIRECTIONS

  console.log('\n  myceliums logo generation')
  console.log('  ========================\n')
  console.log(`  Directions: ${directions.map(d => d.name).join(', ')}`)
  console.log(`  Variants per direction: ${VARIANTS_PER_DIRECTION}`)
  console.log(`  Output: ${OUTPUT_DIR}\n`)

  for (const direction of directions) {
    console.log(`\n  ${direction.name}:`)

    for (let i = 0; i < VARIANTS_PER_DIRECTION; i++) {
      try {
        const imageBuffer = await generateLogo(direction, i)
        const outPath = join(OUTPUT_DIR, `${direction.name}-v${i + 1}.png`)
        writeFileSync(outPath, imageBuffer)
        console.log(`    Saved: ${direction.name}-v${i + 1}.png (${(imageBuffer.length / 1024).toFixed(1)} KB)`)
      } catch (err) {
        console.error(`    Failed: ${direction.name} v${i + 1}: ${err.message}`)
      }

      // Rate limit delay
      if (i < VARIANTS_PER_DIRECTION - 1) {
        await new Promise(r => setTimeout(r, 3000))
      }
    }

    // Delay between directions
    await new Promise(r => setTimeout(r, 4000))
  }

  console.log('\n  Done! Review concepts in:')
  console.log(`  ${OUTPUT_DIR}\n`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
