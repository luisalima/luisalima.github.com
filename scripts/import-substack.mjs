#!/usr/bin/env node
// One-shot Substack RSS → Markdown importer for herdingagents.
// Writes each item to src/content/posts/<slug>.md as a draft.
// Conversion is intentionally simple — review each file by hand.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");
const feedPath = process.argv[2] ?? "/tmp/claude/hg-feed.xml";
const outDir = resolve(repoRoot, "src/content/posts");

mkdirSync(outDir, { recursive: true });

const xml = readFileSync(feedPath, "utf8");

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#?(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

function unwrapCdata(s) {
  return s.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function pickTag(item, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const m = item.match(re);
  return m ? unwrapCdata(m[1]).trim() : null;
}

function pickNs(item, ns, tag) {
  const re = new RegExp(`<${ns}:${tag}>([\\s\\S]*?)<\\/${ns}:${tag}>`);
  const m = item.match(re);
  return m ? unwrapCdata(m[1]).trim() : null;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Minimal HTML → Markdown. Substack RSS HTML is mostly <p>, <h*>, <a>, <strong>,
// <em>, <ul>/<ol>/<li>, <blockquote>, <code>, <pre>, <figure>/<img>, <hr>.
function htmlToMd(html) {
  let md = html;

  // strip Substack-specific wrappers and tracking iframes
  md = md.replace(/<div class="captioned-image-container">[\s\S]*?<\/div>/g, m => {
    const img = m.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    if (img) return `\n\n![${img[2]}](${img[1]})\n\n`;
    return "";
  });
  md = md.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/g, (_, inner) => {
    const img = inner.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    const cap = inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/);
    let out = "";
    if (img) out += `\n\n![${img[2]}](${img[1]})\n`;
    if (cap) out += `*${cap[1].replace(/<[^>]+>/g, "").trim()}*\n\n`;
    return out;
  });

  md = md.replace(/<hr\s*\/?>/g, "\n\n---\n\n");
  md = md.replace(/<br\s*\/?>/g, "  \n");

  for (let i = 6; i >= 1; i--) {
    const re = new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\\/h${i}>`, "g");
    md = md.replace(re, (_, t) => `\n\n${"#".repeat(i)} ${t.replace(/<[^>]+>/g, "").trim()}\n\n`);
  }

  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, (_, t) => {
    const inner = t.replace(/<[^>]+>/g, "").trim();
    return "\n\n" + inner.split("\n").map(l => `> ${l}`).join("\n") + "\n\n";
  });

  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (_, t) => {
    const code = t.replace(/<code[^>]*>/g, "").replace(/<\/code>/g, "").replace(/<[^>]+>/g, "");
    return `\n\n\`\`\`\n${decodeEntities(code)}\n\`\`\`\n\n`;
  });
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (_, t) => `\`${decodeEntities(t)}\``);

  md = md.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => {
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    return `[${cleanText}](${href})`;
  });

  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/g, "**$2**");
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/g, "*$2*");

  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (_, t) => {
    return "\n\n" + t.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, li) => `- ${li.replace(/<[^>]+>/g, "").trim()}\n`) + "\n";
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_, t) => {
    let i = 0;
    return "\n\n" + t.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, li) => `${++i}. ${li.replace(/<[^>]+>/g, "").trim()}\n`) + "\n";
  });

  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, t) => `\n\n${t.trim()}\n\n`);
  md = md.replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/g, (_, src, alt) => `![${alt}](${src})`);

  md = md.replace(/<\/?(?:div|span|section|article|main|header|footer|aside|iframe|table|tbody|tr|td|th|thead|tfoot)[^>]*>/g, "");
  md = md.replace(/<[^>]+>/g, "");

  md = decodeEntities(md);
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

// Extract items
const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
console.log(`Found ${itemBlocks.length} items in feed.`);

let imported = 0;
for (const item of itemBlocks) {
  const title = pickTag(item, "title") ?? "Untitled";
  const link = pickTag(item, "link") ?? "";
  const pubDate = pickTag(item, "pubDate") ?? "";
  const description = pickTag(item, "description") ?? "";
  const contentEncoded = pickNs(item, "content", "encoded") ?? "";

  const pubDatetime = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
  const slug = slugify(title) || `post-${imported + 1}`;
  const filePath = resolve(outDir, `${slug}.md`);
  if (existsSync(filePath)) {
    console.log(`skip (exists): ${slug}`);
    continue;
  }

  const body = htmlToMd(contentEncoded);
  const descMd = description.replace(/<[^>]+>/g, "").trim().slice(0, 200) || title;

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `pubDatetime: ${pubDatetime}`,
    `description: ${JSON.stringify(descMd)}`,
    `tags: ["substack"]`,
    `draft: true`,
    `canonicalURL: ${JSON.stringify(link)}`,
    "---",
    "",
    `> Imported from [Substack](${link}). Review before publishing — un-set \`draft: true\` when ready.`,
    "",
    body,
    "",
  ].join("\n");

  writeFileSync(filePath, frontmatter);
  imported++;
  console.log(`wrote: src/content/posts/${slug}.md  (${title})`);
}

console.log(`\nImported ${imported} posts.`);
