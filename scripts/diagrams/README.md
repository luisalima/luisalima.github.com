# diagrams — Herding Agents figure renderer

Diagram-as-code in [D2](https://d2lang.com), rendered to brand-consistent SVG.
Driven by the **diagrams** skill (`.claude/skills/diagrams/`).
Sibling of `scripts/cards/` and shares its brand identity + fonts.

```
diagrams/
  assets/theme.d2     brand tokens (6 hex vars) + classes — edit once, all figures update
  templates/          archetype figures: trifecta, taint-flow, matrix
  render.sh           .d2 -> .svg with the Google Sans Code TTFs (borrowed from ../cards/fonts)
```

## Render

```bash
./render.sh templates/trifecta.d2            # -> templates/trifecta.svg
./render.sh my-figure.d2 out/my-figure.svg
```

Requires `d2` (`brew install d2`). Author new figures next to `assets/theme.d2`
and import it with `...@assets/theme` (templates live one level down, so they
use `...@../assets/theme`).

## Brand

Off-white `#fefbfb` + black `#000000` + Google Sans Code — the same visual
identity as the OG cards (`src/pages/og.png.ts`, `scripts/cards/theme.mjs`).
One signal color only: the site link accent `#006cac`. Red (`#b23a2e`) means
danger and nothing else. Full house rules in the skill.

> Verified on **D2 v0.7.1** — all three templates render. Needs D2 ≥ 0.6.7 for
> `${...}`-in-`classes`. Note `stroke-width` must be an integer 0–15.
