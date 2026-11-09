---
title: "Ask before you install"
pubDatetime: 2026-11-09T17:00:00.000Z
description: "Your agent can check a package before it installs it: is it real, is it used, is it clean. npm audit only looks after the fact."
kind: note
draft: true
tags: ["ai-security", "supply-chain", "coding-agents", "secure-coding"]
series: secure-coding-with-agents
seriesOrder: 7
---
Slopsquatting and persuasion: does your agent check before installing?

Most agents already know how to run OSV scanner, npm audit and other tools to check whether there are vulnerabilities in installed packages (I even provided [an OSS tool to enable these checks](https://github.com/luisalima/autoscan-kit)).

But what happens if an agent, for some reason (or [persuasion...](/notes/pages-that-persuade-agents/)) hallucinates package names? And attackers register those plausible package names, in case someone or some agent install them? That is an attack technique called [slopsquatting](https://www.theregister.com/2025/04/12/ai_code_suggestions_sabotage_supply_chain/). Although better most recent models such as Opus 5.5 are already pretty careful (and of course, you're [sandboxing agents](/notes/broken-sandbox-is-worse-than-no-sandbox/)), nowadays, with the proliferation of tools such as [omp](https://omp.sh/) and [command code](https://commandcode.ai/)), that might route to different LLMs depending on the difficulty of the task, sometimes... we might get an unpleasant surprise.

And tools such as npm audit check your *installed* packages, so that comes after the fact.  

So, what can we do? Run checks *first*. Which checks? 

Check that the package is real, used by people, and clean. You can do it very quickly by asking your agent to use [looot](https://looot.ai). Do the following:  

```
Before installing any npm package, check it with looot:
1. npm-registry-package: does it exist? Version, licence, maintainers, install scripts.
2. npm-registry-downloads: downloads last week.
3. osv-package-advisories: known advisories for that version (MAL- means malware).
Stop and ask me if it doesn't exist, has few downloads, has install scripts or has any advisory.
```

Now let's take a real package, such as `express`, as an example. 

It exists, has 5 maintainers, no install scripts, and about 196 million downloads last week. Version 5.3.0 has no known advisories. An old pin, 4.17.1, has 2 CVEs. An old lodash pin, 4.17.15, has 5, including command injection. Running the looot check above would yield:

```
express 5.3.0 · MIT · 5 maintainers · no install scripts
downloads (Nov 2–8): 196,494,336
advisories on 5.3.0: none
advisories on 4.17.1: CVE-2024-29041, CVE-2024-43796
lodash 4.17.15: CVE-2020-8203, CVE-2020-28500, CVE-2021-23337, CVE-2025-13465, CVE-2026-4800
```

I asked my claude about 3 names that an agent might invent, and it came up with `express-session-validator-pro`, `fastify-auth-jwt-helper` and `react-secure-form-sanitizer`. None of them exist on npm today. If someone registers one tomorrow, `npm install` fetches their code, and its install script runs before any audit. Let's run them through looot:

```
express-session-validator-pro   not found on npm
fastify-auth-jwt-helper         not found on npm
react-secure-form-sanitizer     not found on npm
```



Now, let's take two malicious ones: `plain-lang` and `vfat-tools`. [OSV](https://osv.dev) flags both as malware, and npm has replaced them with empty placeholder packages. However, `plain-lang` was flagged on November 5, so a lockfile audit last week, before November 5th, would have passed it. OSV's advice to anyone who installed them: consider the computer fully compromised and rotate every secret on it. Even if you run your agents and installs in sandboxes, this would be real work.  
Here's what would have been shown if you had asked your agent to use looot to check the package:

```
plain-lang   0.0.1-security, "security holding package" · OSV: MAL-2026-18714
vfat-tools   0.0.1-security, "security holding package" · OSV: MAL-2026-4179
```

All of this took a handful of tool calls through looot, at $0.

Of course that an install script isn't proof of malice, and plenty of legitimate packages have one. But it might be a reason to look deeper and ask your agent what is in that install script before installing the package.

But please keep running `npm audit`, [osv-scanner](https://github.com/google/osv-scanner)  and \[get the good defaults in place\](TODO-LINK-TO-MY-TOOL). They catch known vulnerabilities in your lockfile, after the package is in. A check before install covers what they can't:

1. An install script runs during `npm install`, before any audit.
2. A package registered last week has no advisory yet, so existence, downloads, maintainers and install scripts are the signals to look at.
3. Not every agent has a shell. Chat and sandboxed agents can only call tools. You might argue that is good, *but* those sandboxes can hold credentials, and, most importantly, *access*.