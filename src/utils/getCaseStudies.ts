import type { CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

export const CASE_STUDIES_BASE = "case-studies";

/** Eligible to show: never drafts; in prod, only once published (with margin). */
export function caseStudyFilter({ data }: CollectionEntry<"caseStudies">) {
  const isPublished =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublished);
}

/** Published case studies, newest first (by modDatetime, else pubDatetime). */
export function getSortedCaseStudies(entries: CollectionEntry<"caseStudies">[]) {
  return entries
    .filter(caseStudyFilter)
    .sort(
      (a, b) =>
        new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() -
        new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime()
    );
}

/** Last path segment of a glob-loader id (e.g. "sub/foo" → "foo"). */
export function getCaseStudySlug(id: string) {
  const parts = id.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : id;
}

/** Navigable URL: /case-studies/<slug>. */
export function getCaseStudyUrl(
  id: string,
  locale: string | undefined = config.site.lang
) {
  return getRelativeLocaleUrl(
    locale,
    `${CASE_STUDIES_BASE}/${getCaseStudySlug(id)}`
  );
}
