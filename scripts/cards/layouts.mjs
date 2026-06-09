// Slide layouts → satori node trees. Each layout returns the *content* node for
// the middle of the card; the frame, slide counter and footer chrome are added
// by render.mjs. Plain object form (no JSX) to match src/pages/og.png.ts.

import { COLORS } from "./theme.mjs";

// Satori has no auto-fit: pick a font size from text length so long slides don't
// overflow. Buckets are tuned for the portrait preset; render.mjs scales them.
function fitSize(text, { max, min, longAt }) {
  const len = (text ?? "").length;
  if (len <= longAt) return max;
  // linear-ish taper from max → min as text grows to ~3x longAt
  const t = Math.min(1, (len - longAt) / (longAt * 2));
  return Math.round(max - (max - min) * t);
}

// satori requires explicit display on any div with >1 child — default to flex.
const div = (style, children) => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});
const text = (style, value) => ({ type: "div", props: { style, children: value } });

// --- title -----------------------------------------------------------------
function title(slide, { scale }) {
  const size = fitSize(slide.body, { max: 96, min: 56, longAt: 40 }) * scale;
  return div(
    { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
    [
      slide.kicker
        ? text(
            {
              fontSize: 30 * scale,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 4,
              color: COLORS.muted,
              marginBottom: 28,
            },
            slide.kicker
          )
        : null,
      text(
        { fontSize: size, fontWeight: 700, lineHeight: 1.05, color: COLORS.ink },
        slide.body
      ),
    ].filter(Boolean)
  );
}

// --- quote ------------------------------------------------------------------
function quote(slide, { scale }) {
  const size = fitSize(slide.body, { max: 76, min: 42, longAt: 90 }) * scale;
  return div(
    { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
    [
      text(
        { fontSize: 140 * scale, fontWeight: 700, lineHeight: 0.7, color: COLORS.ink },
        "“"
      ),
      text(
        {
          fontSize: size,
          fontWeight: 700,
          lineHeight: 1.15,
          color: COLORS.ink,
          marginTop: 8,
        },
        slide.body
      ),
      slide.kicker
        ? text(
            { fontSize: 28 * scale, color: COLORS.muted, marginTop: 32 },
            `— ${slide.kicker}`
          )
        : null,
    ].filter(Boolean)
  );
}

// --- statement (explanatory body) ------------------------------------------
function statement(slide, { scale }) {
  const size = fitSize(slide.body, { max: 56, min: 34, longAt: 140 }) * scale;
  return div(
    { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
    [
      slide.kicker
        ? text(
            {
              fontSize: 28 * scale,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: COLORS.muted,
              marginBottom: 24,
            },
            slide.kicker
          )
        : null,
      text(
        { fontSize: size, fontWeight: 400, lineHeight: 1.3, color: COLORS.ink },
        slide.body
      ),
    ].filter(Boolean)
  );
}

// --- list -------------------------------------------------------------------
function list(slide, { scale }) {
  const items = slide.items ?? [];
  const size = fitSize(items.join(" "), { max: 46, min: 30, longAt: 120 }) * scale;
  return div(
    { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
    [
      slide.kicker
        ? text(
            {
              fontSize: 28 * scale,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: COLORS.muted,
              marginBottom: 36,
            },
            slide.kicker
          )
        : null,
      ...items.map(item =>
        div(
          { display: "flex", flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
          [
            text(
              { fontSize: size, fontWeight: 700, color: COLORS.ink, marginRight: 20, lineHeight: 1.25 },
              "—"
            ),
            text(
              { fontSize: size, fontWeight: 400, color: COLORS.ink, lineHeight: 1.25, flexShrink: 1 },
              item
            ),
          ]
        )
      ),
    ].filter(Boolean)
  );
}

// --- outro (CTA) ------------------------------------------------------------
function outro(slide, { scale, stamp }) {
  return div(
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      flexGrow: 1,
    },
    [
      text(
        { fontSize: 52 * scale, fontWeight: 400, lineHeight: 1.25, color: COLORS.ink, marginBottom: 40 },
        slide.body ?? "Read the full piece →"
      ),
      text(
        { fontSize: 44 * scale, fontWeight: 700, color: COLORS.ink },
        stamp.site
      ),
      text(
        { fontSize: 32 * scale, color: COLORS.muted, marginTop: 8 },
        stamp.handle
      ),
    ]
  );
}

export const LAYOUTS = { title, quote, statement, list, outro };

export function renderContent(slide, ctx) {
  const layout = LAYOUTS[slide.type];
  if (!layout) {
    const known = Object.keys(LAYOUTS).join(", ");
    throw new Error(`Unknown slide type ":: ${slide.type}". Use one of: ${known}`);
  }
  return layout(slide, ctx);
}
