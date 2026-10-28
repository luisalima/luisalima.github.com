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
              { fontSize: size, fontWeight: 700, color: COLORS.ink, marginRight: 20, lineHeight: 1.25, flexShrink: 0 },
              "—"
            ),
            // flex: 1 1 0 + minWidth 0: satori otherwise measures the item's height
            // at its unwrapped width, so a wrapped item overlaps the next one.
            text(
              {
                fontSize: size,
                fontWeight: 400,
                color: COLORS.ink,
                lineHeight: 1.25,
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
              },
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

// Shared small-caps label used by stat + rows (same treatment as statement/list).
const kickerNode = (slide, scale, marginBottom) =>
  slide.kicker
    ? text(
        {
          fontSize: 28 * scale,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 3,
          color: COLORS.muted,
          marginBottom,
        },
        slide.kicker
      )
    : null;

// --- stat (one big number + label + optional context) -----------------------
// Body: line 1 = the number ("4 / 12", "38%", "1,200"), line 2+ = short label.
// `context: ...` adds a muted line (source / sample size). Numbers must come
// from the source note — see STYLE_GUIDE.md "Safe claims".
function stat(slide, { scale }) {
  const [number = "", ...rest] = slide.body.split("\n").map(l => l.trim()).filter(Boolean);
  const label = rest.join(" ");
  // Mono glyphs are ~0.6em wide; keep the number inside ~800px at portrait.
  const numSize = Math.min(240, Math.floor(820 / Math.max(1, number.length * 0.6))) * scale;
  const labelSize = fitSize(label, { max: 52, min: 36, longAt: 40 }) * scale;
  return div(
    { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
    [
      kickerNode(slide, scale, 20),
      text(
        { fontSize: numSize, fontWeight: 700, lineHeight: 1, letterSpacing: -4, color: COLORS.ink },
        number
      ),
      div(
        { width: 120 * scale, height: 8 * scale, background: COLORS.ink, marginTop: 32 * scale, marginBottom: 32 * scale },
        []
      ),
      label
        ? text({ fontSize: labelSize, fontWeight: 700, lineHeight: 1.2, color: COLORS.ink }, label)
        : null,
      slide.context
        ? text(
            { fontSize: Math.max(24, 28 * scale), lineHeight: 1.35, color: COLORS.muted, marginTop: 28 * scale },
            slide.context
          )
        : null,
    ].filter(Boolean)
  );
}

// --- rows (data card: 2–6 label/value rows) ---------------------------------
// Items are `- label: value` (split on the LAST ": "). Optional body text is a
// heading above the rows; `context: ...` is a muted footnote (source / n).
// Rough line count for Google Sans Code (mono, ~0.6em advance per glyph).
const MONO_ADV = 0.6;
// Greedy word-wrap line count (mono font, so chars-per-line is exact enough).
function lineCount(str, size, width) {
  const perLine = Math.max(1, Math.floor(width / (size * MONO_ADV)));
  let lines = 1;
  let used = 0;
  for (const word of (str ?? "").split(/\s+/).filter(Boolean)) {
    let len = word.length;
    if (used > 0 && used + 1 + len <= perLine) used += 1 + len;
    else if (used === 0 && len <= perLine) used = len;
    else {
      if (used > 0) lines++;
      while (len > perLine) {
        lines++;
        len -= perLine;
      }
      used = len;
    }
  }
  return lines;
}

function rows(slide, { scale, box }) {
  const parsed = (slide.items ?? []).map(item => {
    const at = item.lastIndexOf(": ");
    return at === -1
      ? { label: item, value: "" }
      : { label: item.slice(0, at).trim(), value: item.slice(at + 2).trim() };
  });
  const n = Math.max(parsed.length, 1);
  const baseRow = (n <= 3 ? 44 : n <= 4 ? 40 : 36) * scale;
  const basePad = (n <= 3 ? 30 : n <= 4 ? 26 : 22) * scale;
  const headBase = slide.body ? fitSize(slide.body, { max: 52, min: 38, longAt: 40 }) * scale : 0;
  const ctxSize = Math.max(24, 26 * scale);
  const ruleW = Math.max(2, Math.round(3 * scale));
  const rule = `${ruleW}px solid ${COLORS.ink}`;
  const colW = box?.w ?? 1080 - 2 * 72 - 8 - 2 * 54;
  const availH = box?.h ?? Infinity;
  // A value never takes more than ~42% of the column; it wraps (right-aligned)
  // instead of squeezing the label to zero width.
  const valueMax = Math.round(colW * 0.42);

  // Fit to the available height: estimate the stack, shrink rows (and heading)
  // until it fits. Row text never goes below 26px.
  const measure = k => {
    const rowSize = Math.max(26, baseRow * k);
    const rowPad = basePad * k;
    const headSize = Math.max(32, headBase * k);
    let h = 0;
    if (slide.kicker) h += 28 * scale * 1.2 + (slide.body ? 16 : 32);
    if (slide.body) h += lineCount(slide.body, headSize, colW) * headSize * 1.15 + 32 * k;
    for (const r of parsed) {
      const vW = Math.min(valueMax, r.value.length * rowSize * MONO_ADV);
      const lines = Math.max(
        lineCount(r.label, rowSize, colW - vW - 24),
        lineCount(r.value, rowSize, valueMax)
      );
      h += lines * rowSize * 1.2 + 2 * rowPad + ruleW;
    }
    h += ruleW;
    if (slide.context) h += lineCount(slide.context, ctxSize, colW) * ctxSize * 1.35 + 24;
    return { h, rowSize, rowPad, headSize };
  };
  let fit = measure(1);
  for (let k = 0.95; fit.h > availH * 0.95 && k >= 0.5; k -= 0.05) fit = measure(k);
  const { rowSize, rowPad, headSize } = fit;

  return div(
    { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
    [
      kickerNode(slide, scale, slide.body ? 16 : 32),
      slide.body
        ? text(
            {
              fontSize: headSize,
              fontWeight: 700,
              lineHeight: 1.15,
              color: COLORS.ink,
              marginBottom: 32 * (rowSize / Math.max(1, baseRow)),
            },
            slide.body
          )
        : null,
      div(
        { display: "flex", flexDirection: "column", borderBottom: rule },
        parsed.map(r =>
          div(
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderTop: rule,
              paddingTop: rowPad,
              paddingBottom: rowPad,
            },
            [
              text(
                {
                  fontSize: rowSize,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: COLORS.ink,
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  minWidth: 0,
                  paddingRight: 24,
                },
                r.label
              ),
              // Value capped at ~42% of the column so it can never squeeze the
              // label away. (textAlign:right clips glyphs on wrapped lines in
              // satori, so short values right-align via the container instead.)
              div(
                {
                  display: "flex",
                  flexShrink: 0,
                  maxWidth: valueMax,
                  justifyContent: "flex-end",
                },
                [
                  text(
                    { fontSize: rowSize, fontWeight: 700, lineHeight: 1.2, color: COLORS.ink, maxWidth: valueMax },
                    r.value
                  ),
                ]
              ),
            ]
          )
        )
      ),
      slide.context
        ? text(
            { fontSize: ctxSize, lineHeight: 1.35, color: COLORS.muted, marginTop: 24 },
            slide.context
          )
        : null,
    ].filter(Boolean)
  );
}

export const LAYOUTS = { title, quote, statement, list, stat, rows, outro };

export function renderContent(slide, ctx) {
  const layout = LAYOUTS[slide.type];
  if (!layout) {
    const known = Object.keys(LAYOUTS).join(", ");
    throw new Error(`Unknown slide type ":: ${slide.type}". Use one of: ${known}`);
  }
  return layout(slide, ctx);
}
