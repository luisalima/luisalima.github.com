import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      kind: z.enum(["note", "essay"]).default("essay"),
      series: reference("series").optional(),
      seriesOrder: z.number().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const series = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/series",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(["ongoing", "complete", "planned"]).default("planned"),
      cover: image().optional(),
      pubDatetime: z.date().optional(),
    }),
});

const caseStudies = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/case-studies",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      // "client" = customer engagement (anonymized by default); "project" = own work.
      type: z.enum(["client", "project"]).default("client"),
      // Display label: anonymized descriptor for clients, real name for own projects.
      subject: z.string(),
      sector: z.string().optional(),
      role: z.string().optional(),
      timeframe: z.string().optional(),
      stack: z.array(z.string()).default([]),
      results: z.array(z.string()).default([]),
      tags: z.array(z.string()).default(["case-study"]),
      ogImage: image().or(z.string()).optional(),
      canonicalURL: z.string().optional(),
    }),
});

export const collections = { posts, pages, series, caseStudies };
