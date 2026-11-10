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


[While writing yesterday's note](/notes/ask-before-you-install/), I realized that some malware sat on npm for six months before the advisory database most tools read caught up. So, I wondered... how fast does the news about a *vulnerability* travel? I picked 20 CVEs at random and split them up into two groups of 10: the "loud" ones (exploited in the wild: attackers are already using them) and the "quiet" ones (ordinary bugs in npm and PyPI packages).

## Scrolly cards

1. A CVE is an entry in a public catalog of known security bugs. Most of us start paying attention to a bug the day its CVE is published.
2. But let's take **Acronis** (CVE-2026-87886) as an example. The first post about it on X {x} came out... **45 hours before** its CVE record! <!-- chart: Acronis, X only -->

1. News {news} followed, 16 hours **before** the CVE record! And CISA {kev} (the US government's cybersecurity agency) had already listed it as **exploited in the wild**... the day before the record existed. <!-- chart: Acronis, X + news + KEV -->
2. Only then did the CVE record land. <!-- chart: the record line pulses -->
3. Is this unusual? No. Of 10 bugs exploited in the wild, **5 were public somewhere before their CVE record**: on X, Reddit, in the news, on GitHub or on CISA's list. <!-- chart: all 10 exploited, "before" glows -->
4. Public exploit code {poc} came later, **15 hours to 22 days** after the first mention on socials and news. But attackers didn't wait for public exploit code: for 4 of those 6, CISA {kev} had already listed the bug as exploited in the wild. <!-- chart: exploit routes -->
5. Then I looked at 10 ordinary bugs in npm and PyPI packages. Before their CVE record, there was **nothing**. After it, there was a handful of posts and some aggregator news. <!-- chart: the 10 ordinary bugs -->
6. But... look left. Every one of them was **fixed before its CVE** {fix}: 25 days earlier for the typical bug, up to 73. So, the fix was public weeks before the record appeared. This is what we like ;) <!-- chart: fix diamonds slide back -->
7. So the CVE record appeared **after the attackers** for the loud bugs, and **weeks after the fix** for the quiet ones. <!-- chart: same; ✍️ your line -->
8. What does this mean for you? For most bugs, the fix is out **weeks before** the CVE record that your tools are waiting for. So, how can we take fixes when they ship and not wait? <!-- chart: the update flow appears -->
9. Being fast doesn't mean being careless (remember yesterday's note?). The update bot can wait a few days, CI can block install scripts, the scanners can check the lists (usually late, but always check) and the tests decide whether to merge. Even with a 7-day wait before updating, all 10 fixes would have landed before their CVE record. <!-- chart: steps 2-4 lit -->
10. Sometimes tests can't tell you if an update will break your app in unexpected ways, and the people who could check are overwhelmed. Use the agents! **Agents can click through the change and record a walkthrough video**, so a person approves in minutes instead of reading the whole diff. For backend, they can use curl and other tools and do the same thing. <!-- chart: walkthrough step lit -->
11. **What's the conclusion? Have the systems in place so you can update fast, and remember that defense is always in depth, a combination of different measures to make your systems as safe as possible.** <!-- chart: the whole flow; your line, Luisa -->

## What this means for you, and for your agents

<!-- Only what the scrolly doesn't say. Everything else lives in the cards. -->

✍️ **A few lines, your take.** Facts:

- The pipeline from the scrolly, ready to copy: → link the gist here (draft: `gists/fast-dependency-updates/`, not public yet; needs your review).
- ✍️ **Even when it all goes right: php2shell** (one paragraph; facts from data-experiments/2026-10-22-php2shell/NOTES.md, checked 10-22):
  - Coordinated disclosure: PHP tagged the fixed releases under embargo on 10-19; advisory + fix public together on 10-21 (the CVE IDs leaked a day early).
  - Upstream was fast: official Docker image ~5.5 h after the advisory; Ubuntu and Debian fixes within about a day.
  - The slow link is the last mile: someone has to run `apt upgrade` or rebuild the container. 35.8% of WordPress installs run PHP 8.1 or older, which gets no release from the PHP project (source patches only); old Ubuntu gets the fix only with paid Ubuntu Pro.
  - Not in the 20. The full story is the follow-up note (link it when it's out).
- For exploited bugs, watch more than the CVE feed: vendor bulletins, CISA's list, and where security people post. An agent can do this watching for you: a daily check of CISA's list + your dependencies' releases is a few cheap tool calls.
- What I'd do next: a bigger sample (~100 exploited CVEs, about $1), vendor-bulletin times as the real zero, and a weekly fix-adoption curve.
- All through [looot](https://looot.ai) (disclosure: I'm a cofounder). Total cost: $0.22.

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