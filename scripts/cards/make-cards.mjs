#!/usr/bin/env node
// Carousel/card generator for luisalima.com social.
//
//   node scripts/cards/make-cards.mjs <slug>
//   node scripts/cards/make-cards.mjs path/to/card.md
//
// Reads a card spec (see social/content/cards/<slug>/card.md), renders one PNG
// per slide into <spec-dir>/slides/NN.png. Deterministic — re-run any time.
//
// Spec format (markdown):
//   ---
//   slug: task-variable
//   preset: portrait        # portrait | square | x-landscape
//   campaign: task-variable # feeds UTM on the companion post (not drawn)
//   site: luisalima.com     # optional footer overrides
//   handle: @__luisalima__
//   ---
//   :: title
//   The task variable
//   ---
//   :: quote
//   The unit of work stopped being the file. It became the task.
//   kicker: from thread 05
//   ---
//   :: list
//   - point one
//   - point two
//
// Slides are split on lines that are exactly `---`. The first line of a slide
// is `:: <type>`. A `kicker: ...` line sets the slide kicker. `- ` lines are
// list items; everything else is body text.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import { resolve, dirname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSlide } from "./render.mjs";
import { resolvePreset, STAMP } from "./theme.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../.."); // website/
const cardsRoot = resolve(repoRoot, "../social/content/cards"); // sibling social repo

function resolveSpecPath(arg) {
  if (!arg) {
    console.error("usage: make-cards.mjs <slug | path/to/card.md>");
    process.exit(2);
  }
  if (arg.endsWith(".md")) return isAbsolute(arg) ? arg : resolve(process.cwd(), arg);
  return resolve(cardsRoot, arg, "card.md");
}

// --- minimal frontmatter + slide parser ------------------------------------
function parseSpec(raw) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = {};
  let body = raw;
  if (fmMatch) {
    for (const line of fmMatch[1].split("\n")) {
      const m = line.match(/^([\w-]+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
    body = raw.slice(fmMatch[0].length);
  }

  const blocks = body
    .split(/^---\s*$/m)
    .map(b => b.trim())
    .filter(Boolean);

  const slides = blocks.map((block, i) => {
    const lines = block.split("\n");
    const typeLine = lines.shift().trim();
    const tm = typeLine.match(/^::\s*(\w+)/);
    if (!tm) {
      throw new Error(`Slide ${i + 1}: first line must be ":: <type>", got "${typeLine}"`);
    }
    const slide = { type: tm[1], kicker: null, body: "", items: [] };
    const bodyLines = [];
    for (const line of lines) {
      const k = line.match(/^kicker:\s*(.*)$/);
      if (k) {
        slide.kicker = k[1].trim();
        continue;
      }
      const li = line.match(/^[-*]\s+(.*)$/);
      if (li) {
        slide.items.push(li[1].trim());
        continue;
      }
      bodyLines.push(line);
    }
    slide.body = bodyLines.join("\n").trim();
    return slide;
  });

  return { meta, slides };
}

async function main() {
  const specPath = resolveSpecPath(process.argv[2]);
  if (!existsSync(specPath)) {
    console.error(`No spec at ${specPath}`);
    process.exit(1);
  }

  const { meta, slides } = parseSpec(readFileSync(specPath, "utf8"));
  if (slides.length === 0) {
    console.error("No slides found in spec.");
    process.exit(1);
  }

  const preset = resolvePreset(meta.preset);
  const scale = (preset.fontScale ?? 1) * (preset.width / 1080);
  const stamp = { site: meta.site || STAMP.site, handle: meta.handle || STAMP.handle };

  const outDir = resolve(dirname(specPath), "slides");
  // Clean stale slides so a shortened carousel doesn't leave orphans.
  if (existsSync(outDir)) {
    for (const f of readdirSync(outDir)) {
      if (/^\d+\.png$/.test(f)) rmSync(resolve(outDir, f));
    }
  }
  mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const ctx = { preset, index: i, total: slides.length, stamp, scale };
    const png = await renderSlide(slides[i], ctx);
    const name = `${String(i + 1).padStart(2, "0")}.png`;
    writeFileSync(resolve(outDir, name), png);
    console.log(`  ✓ ${name}  [:: ${slides[i].type}]  ${preset.width}×${preset.height}`);
  }

  console.log(`\n${slides.length} slide(s) → ${outDir}`);
  if (meta.campaign) {
    console.log(`Companion post UTM: utm_campaign=${meta.campaign}`);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
