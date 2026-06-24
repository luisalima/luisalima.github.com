#!/usr/bin/env bash
# Render a Herding Agents diagram (.d2 -> .svg) with the brand fonts.
# Usage: ./render.sh figure.d2 [figure.svg]
# Fonts are reused from the cards renderer (same Google Sans Code TTFs) so we
# don't vendor the binaries twice.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
FONTS="$HERE/../cards/fonts"

if ! command -v d2 >/dev/null 2>&1; then
  echo "d2 not found. Install it:  brew install d2   (or)   curl -fsSL https://d2lang.com/install.sh | sh" >&2
  exit 127
fi

SRC="${1:?usage: render.sh figure.d2 [figure.svg]}"
OUT="${2:-${SRC%.d2}.svg}"

d2 --layout elk \
   --font-regular "$FONTS/GoogleSansCode-Regular.ttf" \
   --font-bold    "$FONTS/GoogleSansCode-Bold.ttf" \
   "$SRC" "$OUT"

echo "wrote $OUT"
