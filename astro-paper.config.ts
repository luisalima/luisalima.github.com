import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://luisalima.com/",
    title: "Luisa Lima",
    description: "Agentic AI systems, secure by design.",
    author: "Luisa Lima",
    profile: "https://luisalima.com/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/Lisbon",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 2,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/luisalima" },
    { name: "linkedin", url: "https://www.linkedin.com/in/luisalima/" },
    {
      name: "substack",
      url: "https://herdingagents.substack.com",
      linkTitle: "Luisa Lima on Substack (Herding Agents)",
    },
    { name: "mail", url: "mailto:luisa+blog@lambdalink.com" },
    { name: "rss", url: "/rss.xml" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "linkedin", url: "https://www.linkedin.com/shareArticle?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
