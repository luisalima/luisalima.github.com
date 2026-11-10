---
title: "How fast do CVEs travel?"
pubDatetime: 2026-11-10T17:00:00.000Z
description: "I followed 20 CVEs from advisory to X, Reddit, news, GitHub and CISA KEV. The exploited ones arrive before the record. The quiet ones get fixed weeks before anyone says a word."
kind: note
draft: true
tags: ["ai-security", "supply-chain", "vulnerabilities", "secure-coding"]
series: secure-coding-with-agents
seriesOrder: 8
---


\[While writing yesterday's note\](), I realized that some malware sat on npm for six months before the advisory database most tools read caught up. So, I wondered... how fast does the news about a *vulnerability* travel? 

So I picked 20 CVEs at random and split them up into two groups of 10:

- **"loud":** exploited in the wild (on CISA's Known Exploited Vulnerabilities list, KEV), added Aug–Nov 2026, one per vendor
- **"quiet":** ordinary npm and PyPI advisories reviewed by GitHub, with a CVE, not on KEV

- For each one, the first time it showed up: fixed version, Reddit, X, news, a GitHub repo, KEV, a public exploit repo.
- All through [looot](https://looot.ai) (disclosure: I'm a cofounder). Total cost: $0.22.



## What is a CVE? (for readers outside security)

- A CVE is an entry in a public catalogue of known security bugs: an ID like `CVE-2026-87886` plus a short public record (what's affected, which versions).
- The catalogue is the CVE Program, run by MITRE. IDs are assigned by authorised organisations ("CNAs"): vendors such as Microsoft or GitHub, and security companies.
- Most security tooling works from it, directly or through databases built on it (GitHub's advisory database, OSV, NVD): `npm audit`, Dependabot, scanners, the "vulnerable dependency" email.
- So for most teams the CVE record is the moment they find out. That's why it matters when it's late.
- Possible one-liner to rewrite: "a CVE is a bug's public ID card: the record your scanner is waiting for."
- In the scrolly this is step 1 ("day zero").

## The quiet ones: fixed weeks before anyone says a word

✍️ **Your take on it.** Facts:

- All 10 quiet packages released the fix **before** the advisory. Median: **~25 days** (605 h) before.
- After the advisory: 0 X posts, 0 news, 0 repos (medians). X found 3 of 10 at all, all from accounts under 1k followers.
- Fix adoption, npm, share of last week's downloads still on a vulnerable version:
  - generator-jhipster 93%, ghost 83%, @backstage/plugin-techdocs-node 38%, **seroval 35%** (~12.5M of ~36M), vite 1.4% (only one version affected).
- seroval (CVE-2026-116584): fix 2026-09-29, advisory 2026-10-26.
- So what? Anyone who reads diffs has weeks of head start. Your lockfile audit only knows once the advisory exists. → ties back to [Ask before you install](/notes/ask-before-you-install/) and [dependency scanning should be a default](/essays/dependency-scanning-should-be-a-default/).

## The loud ones: the CVE record is not the starting gun

✍️ **Your take on it.** Facts:

- For **5 of 10** exploited CVEs, something showed up *before* the CVE record (X, Reddit, news, a repo or KEV itself). For the quiet ones: 0 of 10.
- Acronis (CVE-2026-87886): 10 X posts + news ~45 h before the record; KEV listed it the day before the record.
- VMware vCenter (CVE-2026-59310): X, Reddit and news all about a day before the record.
- Likely reason: vendor bulletins and researchers go first, the record follows.
- Medians after the record: first X post **3.6 h**, first news **4.8 h**, first GitHub repo 18.9 h, KEV **36 h** (3 same day, 1 the day before).
- Who posts first on X: 8 of 10 from accounts with &gt;10k followers.
- Odd one out: Linux kernel (CVE-2026-53362). Record on July 4, first X post ~10 days later, no news until CISA added it to KEV 54 days later. The news followed KEV, not the other way round.

## From talk to exploit: days

✍️ **Your take on it.** Facts:

- First X post: median 3.6 h. First public exploit repo: median **~13 days** (308 h), 6 of 10. Fastest: **25 h** (MLflow, CVE-2026-64849).
- "Public exploit repo" = a repo whose name or description says poc/exploit/rce. I didn't open them; fake PoC repos that ship malware are common.

## What this means for you, and for your agents

- For your dependencies, many times the advisory is late by design and the fix is already out. Update on releases, not on dependencies
-  **Automated unit and integration tests in CI, so updating is fast.** If the fix ships weeks before the advisory, the teams that win are the ones who can take an update the day it lands: a bot opens the PR, the tests say it's safe, it merges. Without tests, every update is a manual risk, so people wait for the advisory (or longer: seroval's 35%).
→ link the pipeline gist here (draft: `gists/fast-dependency-updates/`, not public yet).
- (Luisa, 11-10) **Doesn't "update fast" contradict yesterday's note?** No: fast, but checked. Yesterday: an age gate is good but it isn't a check, so check the package before you install it. Today: fixes land weeks before the CVE, so be able to take them quickly. Same lesson: put the checks in the pipeline, not in waiting.
  - The earliest fix in the 10 came **8 days** (183 h) before its CVE record, so even a **7-day age gate** would have had all 10 fixes in before the record.
  - The pipeline gist uses a 3-day cooldown + check-before-install style checks + CI tests. Link [Ask before you install](/notes/ask-before-you-install/) here as the "checked" half.
- (Luisa, 11-10) **When integration tests aren't enough**, and because humans are overwhelmed: have the agents do a walkthrough video for a human to approve. (In the scrolly as optional step 5, between Tests and Auto-merge. Not in the pipeline gist yet.)
- For exploited bugs, watch more than the CVE feed: vendor bulletins, KEV, and where security people post.
- An agent can do this watching for you: a daily check of KEV + your dependencies' releases is a few cheap tool calls.
- What I'd do next: a bigger sample (\~100 KEV CVEs, about $1), vendor-bulletin times as the real zero, and a weekly fix-adoption curve.

## Addendum: method and caveats

- **n = 20.** Medians over 3–10 points. This is an anecdote with a method, not a base rate.
- **The sample was fixed before any spread data was fetched** (random seed 20261106). Loud: 10 of 44 vendors on KEV, CVE-2026-* only. Quiet: 5 npm + 5 PyPI.
- **"Advisory"** = the earliest of the CVE.org record, NVD, OSV and GitHub advisory. In practice, the CVE.org record for all 20.
- **"First seen" is a lower bound on speed.** Search APIs miss posts (deleted, protected, unindexed), and Reddit search is weak: only 3 of 10 loud CVEs found.
- **KEV and many news dates are day-resolution.** They count as "before" only if the whole day comes before the advisory.
- **News is fuzzy.** Only articles with the CVE id in the title or snippet, minus vulnerability databases and feeds. The quiet group's "news" is mostly aggregators.
- **Fix adoption** compares downloads per version. CI and mirrors dominate npm counts, and old major lines may be pinned on purpose.
- **Recency:** late-window CVEs (vite, seroval) had only about 10 days to travel.
- **Cost:** $0.22 over 251 calls. News search was 71% of it; registry, OSV, KEV, CVE.org, NVD and GitHub calls were free.
- **Not covered:** Bluesky (no search endpoint without auth).