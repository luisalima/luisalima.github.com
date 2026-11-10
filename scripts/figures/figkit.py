# figkit: the house kit for data figures on luisalima.com (see .claude/skills/visual-explainer).
# Hand-built SVG: one claim per figure, site font by name, CSS entry animations that also run inside <img>,
# three skins. Import with `from figkit import *` AFTER sys.path points here; the skin is read from argv:
#   --theme=light (site default) | night (dark card, dotted grid, glowing marks) | ticket (cards' ticket-stub frame)
import math
import pathlib
import sys
from html import escape

THEME = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--theme=")), "light")

# site tokens (website/scripts/diagrams/assets/theme.d2); BLUE/OCHRE passed the dataviz palette check
INK, PAPER, LINE, MUTED, SHADE = "#000", "#fefbfb", "#ecebeb", "#6b6b6b", "#f6f1ee"
BLUE, OCHRE, RED, GREEN, KEVC, XC = "#006cac", "#9a7b2f", "#b23a2e", "#008300", "#eda100", "#2a78d6"
NEAR, LATER, ON_BLUE, OUTLINE = "#cfe2f0", "#eeeae6", "#fefbfb", "#000"
if THEME == "night":
    INK, PAPER, LINE, MUTED, SHADE = "#e8edf2", "#0d1117", "#1f2630", "#8b96a3", "#131a23"
    BLUE, OCHRE, RED, GREEN, KEVC = "#3b9eff", "#e0b34f", "#ff5f56", "#2fd36b", "#ffc53d"
    NEAR, LATER, ON_BLUE, OUTLINE = "#173a5e", "#1a212b", "#ffffff", "#0d1117"
# categorical slots (dataviz reference palette minus its red; red = danger on this site). Order validated:
# validate_palette.js passes in this order. Pair every colour with a shape when a series has to be told apart.
CAT = ["#008300", "#2a78d6", "#eb6834", "#6250d6", "#1baf7a", "#b23a2e", "#eda100"]

W = 760
FONT = 'font-family="Google Sans Code, ui-monospace, monospace"'


def t(x, y, s, size=13, fill=None, anchor="start", weight=400, extra=""):
    fill = INK if fill is None else fill
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}"{extra}>{escape(s)}</text>'


# Entry animations. A wrapping page can add class "wait" to the <svg> to hold every mark at its start,
# then swap in a clone without it when the figure scrolls into view (a clone restarts CSS animations).
ANIM_CSS = """<style>
.gx,.pop,.fade{animation-fill-mode:both;animation-timing-function:cubic-bezier(.2,.7,.2,1)}
.gx{transform-box:fill-box;transform-origin:left center;animation-name:gx;animation-duration:.8s}
.pop{transform-box:fill-box;transform-origin:center;animation-name:pop;animation-duration:.45s;animation-timing-function:cubic-bezier(.3,1.6,.5,1)}
.fade{animation-name:fade;animation-duration:.5s}
[data-linear]{animation-timing-function:linear}
@keyframes gx{from{transform:scaleX(0)}}@keyframes pop{from{transform:scale(0);opacity:0}}@keyframes fade{from{opacity:0}}
.wait .gx,.wait .pop,.wait .fade{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.gx,.pop,.fade{animation:none!important}}
</style>"""


def A(cls, delay, inner, dur=None):
    """Wrap marks in an animated group: cls = gx (grow from the left) | pop | fade; delay/dur in seconds."""
    d = f";animation-duration:{dur:.2f}s" if dur else ""
    return f'<g class="{cls}" style="animation-delay:{delay:.2f}s{d}">{inner}</g>'


def page(title, sub, body, h, foot):
    """Title (the claim), muted subtitle lines, body drawn in a group starting at y=0, footnote lines."""
    sub_lines = sub if isinstance(sub, list) else [sub]
    foot_lines = foot if isinstance(foot, list) else [foot]
    top = 40 + 20 * len(sub_lines) + 42
    H = top + h + 16 + 16 * len(foot_lines) + 8
    if THEME == "ticket":
        top += 14; H += 22
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" class="{THEME}" viewBox="0 0 {W} {H}" width="{W}" height="{H}" {FONT}>',
           f"<title>{escape(title)}</title>", ANIM_CSS]
    if THEME == "night":
        # glow only on shapes and bars: a filter on a zero-height <line> makes the line disappear
        out += ['<defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/>'
                '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
                f'<pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="{LINE}"/></pattern></defs>',
                "<style>svg.night .pop>polygon,svg.night .pop>circle,svg.night .pop>path,svg.night .gx>rect{filter:url(#glow)}</style>",
                f'<rect width="100%" height="100%" rx="10" fill="{PAPER}"/><rect width="100%" height="100%" rx="10" fill="url(#dots)" opacity=".6"/>',
                t(24, 34, title, 19, INK, weight=700)]
    elif THEME == "ticket":
        out += [f'<rect width="100%" height="100%" fill="{PAPER}"/>',
                f'<rect x="14" y="14" width="{W - 22}" height="{H - 22}" fill="#000"/>',
                f'<rect x="6" y="6" width="{W - 22}" height="{H - 22}" fill="{PAPER}" stroke="#000" stroke-width="3"/>',
                f'<rect x="6" y="6" width="{W - 22}" height="46" fill="#000"/>',
                t(24, 36, title, 19, PAPER, weight=700)]
    else:
        out += [f'<rect width="100%" height="100%" fill="{PAPER}"/>', t(24, 34, title, 19, weight=700)]
    sub_y = 76 if THEME == "ticket" else 58
    out += [t(24, sub_y + 20 * i, s, 13.5, MUTED) for i, s in enumerate(sub_lines)]
    out.append(f'<g transform="translate(0,{top})">{body}</g>')
    out += [t(24, top + h + 20 + 16 * i, s, 11, MUTED) for i, s in enumerate(foot_lines)]
    out.append("</svg>")
    return "\n".join(out)


def shape(kind, x, y, r, fill, title=None):
    """circle | square | diamond | triangle | hex | star | cross, outlined; title = native hover text."""
    tip = f"<title>{escape(title)}</title>" if title else ""
    st = f'fill="{fill}" stroke="{OUTLINE}" stroke-opacity="{1 if THEME == "night" else .5}"'

    def poly(n, R, rot=-90, inner=None):
        k = n * 2 if inner else n
        pts = []
        for i in range(k):
            a = math.radians(rot + 360 / k * i)
            rr = inner if inner and i % 2 else R
            pts.append(f"{x + rr * math.cos(a):.1f},{y + rr * math.sin(a):.1f}")
        return f'<polygon points="{" ".join(pts)}" {st}>{tip}</polygon>'

    if kind == "circle":
        return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" {st}>{tip}</circle>'
    if kind == "square":
        return f'<rect x="{x - r * .85:.1f}" y="{y - r * .85:.1f}" width="{r * 1.7:.1f}" height="{r * 1.7:.1f}" {st}>{tip}</rect>'
    if kind == "diamond":
        p = f"{x},{y - r * 1.2} {x + r * 1.2},{y} {x},{y + r * 1.2} {x - r * 1.2},{y}"
        return f'<polygon points="{p}" {st}>{tip}</polygon>'
    if kind == "triangle":
        return poly(3, r * 1.25)
    if kind == "hex":
        return poly(6, r * 1.05, 0)
    if kind == "star":
        return poly(5, r * 1.35, -90, r * 0.6)
    if kind == "cross":
        a, R = r * 0.42, r * 1.05
        d = f"M{x - a},{y - R}h{2 * a}v{R - a}h{R - a}v{2 * a}h{-(R - a)}v{R - a}h{-2 * a}v{-(R - a)}h{-(R - a)}v{-2 * a}h{R - a}z"
        return f'<path d="{d}" {st}>{tip}</path>'
    raise ValueError(kind)


def uniq(svg, suffix):
    """Make filter/pattern ids unique when several figures share one page (ids are document-global)."""
    for i in ("glow", "dots"):
        svg = svg.replace(f'id="{i}"', f'id="{i}-{suffix}"').replace(f"url(#{i})", f"url(#{i}-{suffix})")
    return svg


def preview_html(figs, title, lede="", captions=None):
    """One page with every figure: plays each on scroll, Replay buttons, light/dark page. figs = {name: svg}."""
    parts = ['<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
             f"<title>{escape(title)}</title>",
             '<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;700&display=swap" rel="stylesheet">',
             '<style>:root{--bg:#fefbfb;--ink:#000;--muted:#6b6b6b}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1b1a19;--ink:#f3f1ee;--muted:#a8a5a0}}:root[data-theme="dark"]{--bg:#1b1a19;--ink:#f3f1ee;--muted:#a8a5a0}',
             'body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 "Google Sans Code",monospace}main{max-width:820px;margin:0 auto;padding:24px 16px}',
             'figure{margin:0 0 36px}figure svg{width:100%;height:auto;display:block}figcaption{color:var(--muted);font-size:13px;margin-top:6px}',
             '.replay{font:inherit;font-size:12px;background:none;border:1px solid currentColor;border-radius:5px;color:inherit;padding:1px 8px;cursor:pointer}</style></head><body><main>',
             f'<h1 style="font-size:22px">{escape(title)}</h1>']
    if lede:
        parts.append(f'<p style="color:var(--muted)">{escape(lede)}</p>')
    for i, (name, svg) in enumerate(figs.items(), 1):
        svg = uniq(svg, name).replace('<svg xmlns="http://www.w3.org/2000/svg" class="', '<svg xmlns="http://www.w3.org/2000/svg" class="wait ', 1)
        cap = (captions or {}).get(name, f"Figure {i} · {name}")
        parts.append(f'<figure>{svg}<figcaption>{escape(cap)} · <button class="replay">↻ Replay</button></figcaption></figure>')
    parts.append("""<script>
const play = (f) => { const s = f.querySelector("svg"), c = s.cloneNode(true); c.classList.remove("wait"); s.replaceWith(c); };
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } }), { threshold: 0.35 });
document.querySelectorAll("figure").forEach((f) => { io.observe(f); f.querySelector(".replay").onclick = () => play(f); });
</script></main></body></html>""")
    return "\n".join(parts)


def export_png(svg_paths, out_dir, scale=2):
    """Final frame of each SVG as a PNG (for LinkedIn/X). Needs Playwright: `source ~/.cache/wp-render/env.sh`.
    Reduced motion + animations disabled = the finished picture; never screenshot an infinite animation."""
    from playwright.sync_api import sync_playwright
    fonts = pathlib.Path(__file__).resolve().parent.parent / "cards/fonts"
    face = "".join(f'@font-face{{font-family:"Google Sans Code";font-weight:{w};src:url({(fonts / f).as_uri()})}}'
                   for w, f in ((400, "GoogleSansCode-Regular.ttf"), (700, "GoogleSansCode-Bold.ttf")))
    out_dir = pathlib.Path(out_dir)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": W + 40, "height": 900}, device_scale_factor=scale, reduced_motion="reduce")
        for sp in map(pathlib.Path, svg_paths):
            pg.set_content(f"<style>{face}body{{margin:0}}</style>{sp.read_text()}")
            pg.wait_for_timeout(400)
            pg.locator("svg").first.screenshot(path=str(out_dir / (sp.stem + ".png")), animations="disabled")
        b.close()
