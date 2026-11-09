---
title: "Ask before you install"
pubDatetime: 2026-11-09T17:00:00.000Z
description: "Slopsquatting, persuasion, malicious packages: does your agent check before installing?"
kind: note
draft: true
tags: ["ai-security", "supply-chain", "coding-agents", "secure-coding"]
series: secure-coding-with-agents
seriesOrder: 7
---
Many coding agents, \[especially when asked\](), already know how to run osv-scanner, npm audit and other tools to check whether there are vulnerabilities in installed packages (I also published [an OSS tool to enable these checks by default, on github](https://github.com/luisalima/autoscan-kit)).

But what happens if an agent, for some reason (or [persuasion...](/notes/pages-that-persuade-agents/)) hallucinates package names? And attackers register those plausible package names, in case someone or some agent installs them? That is an attack technique called [slopsquatting](https://www.theregister.com/2025/04/12/ai_code_suggestions_sabotage_supply_chain/). Although most recent and advanced models such as Opus 5.5 are already pretty careful (and of course, you're [sandboxing agents, right?](/notes/broken-sandbox-is-worse-than-no-sandbox/)), nowadays, with the proliferation of tools such as [omp](https://omp.sh/) and [command code](https://commandcode.ai/), that mix and match models from several providers and that might route to different LLMs depending on the difficulty of the task or your set rules, sometimes... we might get an unpleasant surprise.

And tools such as npm audit check your *installed* packages, so that comes after the fact.  

## So, what can we do?

Run checks *first*. But which checks, given that we do not want to install the package?

Good signals include checking that the package is real, used by people, and clean. You can do it directly via websearch, or even quicker by asking your agent to use [looot](https://looot.ai). For example, for npm packages, you can do the following:  

```
Before installing any npm package, check it with looot:
1. npm-registry-package: does it exist? Version, licence, maintainers, install scripts.
2. npm-registry-downloads: downloads last week.
3. osv-package-advisories: known advisories for that version (MAL- means malware).
Stop and ask me if it doesn't exist, has few downloads, has install scripts or has any advisory.
```

If everything looks ok, you can go the extra mile and then ask your agent to check for the install script contents (and ultimately, run a mini audit on the code).

## An example of a legit package

Now let's take a real package, such as `express`, as an example. 

It exists, has 5 maintainers, no install scripts, and about 196 million downloads last week. Version 5.3.0 has no known advisories. An old pin, 4.17.1, has 2 CVEs. An old lodash pin, 4.17.15, has 5, including command injection. Running the looot check above would yield:

```
express 5.3.0 · MIT · 5 maintainers · no install scripts
downloads (Nov 2–8): 196,494,336
advisories on 5.3.0: none
advisories on 4.17.1: CVE-2024-29041, CVE-2024-43796
lodash 4.17.15: CVE-2020-8203, CVE-2020-28500, CVE-2021-23337, CVE-2025-13465, CVE-2026-4800
```

## An example of potential slopsquatting

I asked Claude about 3 names that an agent might invent, and it came up with `express-session-validator-pro`, `fastify-auth-jwt-helper` and `react-secure-form-sanitizer`. None of them exist on npm today. If someone registers one tomorrow, `npm install` fetches their code, and its install script runs before any audit. If we run them through looot, of course they wouldn't be found right now:

```
express-session-validator-pro   not found on npm
fastify-auth-jwt-helper         not found on npm
react-secure-form-sanitizer     not found on npm
```

But suppose someone actually registers it. Here is what your agent could say if we used the prompt above:

```
checked the day after someone registers it (hypothetical)
react-secure-form-sanitizer 1.0.0 · published yesterday · 1 maintainer
downloads (last week): 0
install scripts: postinstall
advisories: none
→ ask first: brand new, nobody uses it, runs code on install
```

No advisory yet, so nothing in it says "malware". The signals are what make your agent stop and ask. That's exactly what `plain-lang` looked like for 146 days (below).

## Examples of actual malicious packages

Now, let's take two malicious ones: `plain-lang` and `vfat-tools`. [OSV](https://osv.dev) flags both as malware, and npm has replaced them with empty placeholder packages. However, `plain-lang` was only flagged on November 5, so a lockfile audit last week, before November 5th, would have passed it. OSV's advice to anyone who installed them is to consider the computer fully compromised and rotate every secret on it. Even if you run your agents and installs in sandboxes, this would be real work.

  
Here's what the check says today:

```
plain-lang   0.0.1-security, "security holding package" · OSV: MAL-2026-18714
vfat-tools   0.0.1-security, "security holding package" · OSV: MAL-2026-4179
```

And here's what the same check would have said while they were still on npm:

```
checked Jul 31, 2026
vfat-tools 2.0.1 · published May 19
downloads (Jul 24–30): 150
advisories: MAL-2026-4179, malicious code (in OSV since May 19)
→ stop: known malware
```

```
checked Oct 1, 2026
plain-lang 1.0.1 · published Jun 12, no release since
downloads (Sep 24–30): 0
advisories: none
→ ask first: almost nobody uses it
```

You might think that this is being too careful. However, malicious packages keep appearing, and they don't always reach advisory databases quickly.

On July 31, GitHub's advisory database, the one `npm audit` reads, had nothing on `vfat-tools`. It only got it on November 6 (the full timelines are in the [addendum](#addendum-the-timelines)).

All of this took a handful of tool calls through looot, at $0.

## Food for thought

Of course, an install script isn't proof of malice, and plenty of legitimate packages have one. But it might be a reason to look deeper and ask your agent what is in that install script before installing the package.

Please keep running `npm audit`, [osv-scanner](https://github.com/google/osv-scanner)  and [get the good defaults in place](https://github.com/luisalima/autoscan-kit). They catch known vulnerabilities in your lockfile, after the package is in. A check before install covers what they won't:

1. An install script runs during `npm install`, before any audit.
2. A package registered last week has no advisory yet, so existence, downloads, maintainers and install scripts are the signals to look at.
3. Not every agent has a shell. Chat agents and many hosted agents can only call tools. You might argue that is good, *but* those sandboxes can hold credentials, and, most importantly, *access*. So you can still get a big mess out of a small mishap...!

## Addendum: the timelines

**`vfat-tools`: OSV knew within 26 minutes. npm served it for almost six months.**


| When (UTC)     | What happened                                                      | What a check before install says                                        |
| -------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| May 19, 03:50  | v2.0.0 published on npm                                            | exists, brand new, no downloads, no advisory: new and unused, ask first |
| May 19, 04:16  | OpenSSF's scanner flags it; it reaches OSV                         | `MAL-2026-4179`: stop                                                   |
| May 19, 11:46  | v2.0.1 published, after the flag                                   | still flagged (the advisory covers every version)                       |
| May 20 – Nov 5 | still installable on npm: 3,346 downloads                          | flagged, every day                                                      |
| Nov 6, 05:43   | GitHub's advisory database gets it; npm replaces it a minute later | flagged, plus npm's placeholder package                                 |


**`plain-lang`: no advisory anywhere for 146 days.**


| When (UTC)     | What happened                                                               | What a check before install says                                  |
| -------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Jun 12         | v1.0.0 and v1.0.1 published, 11 minutes apart                               | exists, no advisory, almost no downloads                          |
| Jun 12 – Nov 4 | 357 downloads in 146 days                                                   | no advisory, so only the signals catch it: tiny usage, no history |
| Nov 5, 22:23   | GitHub flags it; npm replaces it the same minute; OSV gets it an hour later | `MAL-2026-18714`: stop                                            |


*Sources: npm registry publish times, OSV advisories and their origins, npm daily downloads, all through looot on November 9. Download counts include mirrors and scanners. The original malicious code is gone, so I couldn't inspect it.*