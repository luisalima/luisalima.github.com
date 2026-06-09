// Brand tokens + presets for luisalima.com social cards.
// Reuses the site identity from src/pages/og.png.ts (off-white, black frame,
// Google Sans Code) but tuned for carousel slides rather than OG cards.

export const FONT = "Google Sans Code";

export const COLORS = {
  bg: "#fefbfb", // off-white page (matches og.png)
  ink: "#000000", // black text + frame
  muted: "#6b6b6b", // kicker / counter / footer secondary
  shadow: "#ecebeb", // ticket-stub offset block (matches og.png)
};

// Output presets. width/height in px; pad is the outer margin; frame is the
// inner border inset. fontScale lets non-portrait presets breathe.
export const PRESETS = {
  portrait: { width: 1080, height: 1350, pad: 72, frame: 4, fontScale: 1 },
  square: { width: 1080, height: 1080, pad: 72, frame: 4, fontScale: 1 },
  "x-landscape": { width: 1600, height: 900, pad: 80, frame: 4, fontScale: 1.05 },
};

export const DEFAULT_PRESET = "portrait";

// Footer stamp. Overridable via card.md frontmatter (site / handle).
export const STAMP = {
  site: "luisalima.com",
  handle: "@__luisalima__",
};

export function resolvePreset(name) {
  const preset = PRESETS[name ?? DEFAULT_PRESET];
  if (!preset) {
    const known = Object.keys(PRESETS).join(", ");
    throw new Error(`Unknown preset "${name}". Use one of: ${known}`);
  }
  return preset;
}
