// One slide spec → PNG buffer. Adds the shared chrome (ticket-stub frame, slide
// counter, footer stamp) around the layout content, then satori → sharp.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import { COLORS, FONT } from "./theme.mjs";
import { renderContent } from "./layouts.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load vendored fonts once (deterministic — not the hashed .astro/fonts cache).
const fonts = [
  {
    name: FONT,
    data: readFileSync(resolve(__dirname, "fonts/GoogleSansCode-Regular.ttf")),
    weight: 400,
    style: "normal",
  },
  {
    name: FONT,
    data: readFileSync(resolve(__dirname, "fonts/GoogleSansCode-Bold.ttf")),
    weight: 700,
    style: "normal",
  },
];

// satori requires explicit display on any div with >1 child — default to flex.
const div = (style, children) => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});
const text = (style, value) => ({ type: "div", props: { style, children: value } });

const pad2 = n => String(n).padStart(2, "0");

// Build the full card node tree for one slide.
function card(slide, ctx) {
  const { preset, index, total, stamp, scale } = ctx;
  const isOutro = slide.type === "outro";
  const innerPad = Math.round(preset.pad * 0.75);

  const counter = text(
    { fontSize: 28 * scale, fontWeight: 700, letterSpacing: 3, color: COLORS.muted },
    `${pad2(index + 1)} / ${pad2(total)}`
  );

  const footer = isOutro
    ? null
    : div(
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        },
        [
          text({ fontSize: 28 * scale, fontWeight: 700, color: COLORS.ink }, `— ${stamp.site}`),
          text({ fontSize: 24 * scale, color: COLORS.muted }, stamp.handle),
        ]
      );

  // Inner framed surface: counter (top) · content (grow) · footer (bottom).
  const surface = div(
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      border: `${preset.frame}px solid ${COLORS.ink}`,
      borderRadius: 6,
      background: COLORS.bg,
      padding: innerPad,
    },
    [
      div(
        { display: "flex", flexDirection: "row", justifyContent: "flex-start", marginBottom: 24 },
        [counter]
      ),
      renderContent(slide, ctx),
      footer,
    ].filter(Boolean)
  );

  // Outer page with a ticket-stub offset block behind the frame (brand cue).
  return div(
    {
      position: "relative",
      display: "flex",
      width: preset.width,
      height: preset.height,
      background: COLORS.bg,
      fontFamily: FONT,
      padding: preset.pad,
    },
    [
      div(
        {
          position: "absolute",
          top: preset.pad + 14,
          left: preset.pad + 14,
          width: preset.width - preset.pad * 2,
          height: preset.height - preset.pad * 2,
          background: COLORS.shadow,
          border: `${preset.frame}px solid ${COLORS.ink}`,
          borderRadius: 6,
        },
        []
      ),
      div({ position: "relative", display: "flex", width: "100%", height: "100%" }, [surface]),
    ]
  );
}

export async function renderSlide(slide, ctx) {
  const svg = await satori(card(slide, ctx), {
    width: ctx.preset.width,
    height: ctx.preset.height,
    embedFont: true,
    fonts,
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
