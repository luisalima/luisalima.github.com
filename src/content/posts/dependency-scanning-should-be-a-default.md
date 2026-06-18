---
title: "Dependency scanning should be a default, not a discipline"
pubDatetime: 2026-06-19T12:30:00.000Z
description: "Vulnerability scanning fails like ergonomics: fine when you remember, forgotten the one time it matters. autoscan-kit pushes the scan into places that fire on their own, so skipping it takes effort."
kind: essay
draft: true
tags: ["ai-security", "supply-chain", "developer-tooling", "vulnerability-scanning", "oss"]
---

<!-- DRAFT — agent-drafted tool deep-dive for autoscan-kit, the concrete companion
     to the attack-surface essay (parallels skills-need-a-lockfile ↔ skills-lock).
     Voice it, confirm the framing, then flip draft: false. -->

In [the attack surface you inherit when you run a coding agent](/essays/inherited-developer-attack-surface/), I argued the fix has to live in the defaults: the new builder can't supply security instinct they were never given, so the floor of safety can't depend on discipline. This is one of those defaults, shipped.

Dependency scanning fails the same way ergonomics fails. It's fine when you remember, and forgotten the one time it matters. "Run a scan before you ship" is good advice and useless advice for the same reason "sit up straight" is: it's a thing you have to remember, and the failure mode is silent.

So I stopped treating it as a habit and made it a default. The trick is to push the work into places that fire automatically, so a *missed* scan requires removing something, not remembering to add it. That's the whole idea behind [autoscan-kit](https://github.com/luisalima/autoscan-kit). It's four layers, each catching what the one before it misses.

**1. A global git pre-commit hook.** The highest-ROI piece. Install it once and every `git init` and `git clone` you do from then on inherits a hook that runs [osv-scanner](https://github.com/google/osv-scanner) on your staged lockfiles. No per-repo opt-in, no remembering. It also warns, without blocking, on the quiet mistakes: a manifest staged without its lockfile, or a floating `"latest"` / `*` version that pins you to whatever ships next.

**2. A repo template.** New repos start already wired: Dependabot for weekly grouped updates, and an OSV-Scanner workflow that runs on every PR and uploads results to the Security tab. `gh repo create --template`, and you're covered from commit one.

**3. GitHub account and org defaults.** For the repos you cloned or forked instead of creating: turn on Dependabot alerts, security updates, and secret scanning as the default for new repos, and, for orgs, require the scan as a passing check before merge. A bundled script flips the org toggles, with a `--backfill` for existing repos.

**4. A periodic audit.** Because things drift. A script walks your repos and flags the ones still missing the files, so the gaps surface on a schedule instead of during an incident.

The part I care about most: none of this is a product you buy. It's `osv-scanner` (open source, on Google's vulnerability database), Dependabot, and GitHub's own security features, wired so they're on by default. No new vendor, no advisory-data lock-in, no dashboard to log into. Same instinct as [skills-lock](https://github.com/luisalima/skills-lock): the boring answer that reuses what already works beats the shiny new platform.

I'm not pretending it catches everything. The pre-commit hook only scans lockfiles you actually stage, so a vulnerable transitive already sitting in the tree won't trip it until the lockfile moves (that's what layer 2's CI is for). OSV's database is broad but lags GitHub Advisory in some ecosystems. [Trivy](https://github.com/aquasecurity/trivy) is a heavier option if you want containers and IaC in the same tool. The point isn't a perfect net; it's that the *floor* is automatic, so the person who doesn't know to scan is covered anyway.

If you want the five-minute version, install layer 1 and stop there: `brew install osv-scanner`, then `./scripts/install-git-template.sh`. Every repo you touch after that is scanned without you thinking about it, which is the only kind of security that survives a deadline, or a first-time builder.

Repo: [github.com/luisalima/autoscan-kit](https://github.com/luisalima/autoscan-kit)
