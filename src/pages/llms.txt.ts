// /llms.txt — the comprehension layer (llmstxt.org): a curated, link-first map
// of the site for LLMs/agents that already know the domain. Generated from the
// posts collection so it stays in sync with what's published.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import {
  getSortedCaseStudies,
  getCaseStudyUrl,
} from "@/utils/getCaseStudies";
import config from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(config.site.url);
  const abs = (path: string) => new URL(path, base).href;

  const posts = getSortedPosts(await getCollection("posts"));
  const item = ({ data, id, filePath }: (typeof posts)[number]) =>
    `- [${data.title}](${abs(getPostUrl(data.kind, id, filePath, config.site.lang))}): ${data.description}`;

  const essays = posts.filter(p => p.data.kind === "essay").map(item);
  const notes = posts.filter(p => p.data.kind === "note").map(item);

  const studies = getSortedCaseStudies(await getCollection("caseStudies")).map(
    cs =>
      `- [${cs.data.title}](${abs(getCaseStudyUrl(cs.id, config.site.lang))}): ${cs.data.description}`
  );
  const caseStudiesSection = studies.length
    ? `\n## Case studies\n${studies.join("\n")}\n`
    : "";

  const body = `# ${config.site.author}

> ${config.site.description} Independent advisor on agentic AI systems — essays and notes on building and securing AI agents, and breaking from platform lock-in.

## Essays
${essays.join("\n")}

## Notes
${notes.join("\n")}
${caseStudiesSection}

## Elsewhere
- [Herding Agents — Substack newsletter](https://herdingagents.substack.com)
- [GitHub](https://github.com/luisalima)
- [LinkedIn](https://www.linkedin.com/in/luisalima/)
- [X / Twitter](https://x.com/__luisalima__)
- [liwala — open-source tools](https://liwala.dev)

## About
- [About Luisa Lima](${abs("about/")}): background, advisory, and what she works on
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
