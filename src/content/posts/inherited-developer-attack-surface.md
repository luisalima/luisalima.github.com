---
title: "Are you using Claude Code? You inherited a developer's attack surface"
pubDatetime: 2026-06-19T12:00:00.000Z
description: "Coding agents hand non-developers a developer's full attack surface in an afternoon, without the years of instinct that normally come with it. The exposure is identical; the defenses are absent. The fix has to live in the defaults."
kind: essay
draft: false
tags: ["ai-security", "vibe-coding", "coding-agents", "supply-chain", "ai-safety"]
series: secure-by-design-for-agents
seriesOrder: 4
---

You didn't just inherit a developer's productivity. You inherited their attack surface.

Coding agents have done something genuinely good: they let people who never trained as software engineers build real, working software. A marketing lead ships an internal tool. A founder with no CS background stands up a backend. A researcher automates a pipeline they'd have waited a quarter for. This is the part everyone celebrates, and they're right to.

But running a coding agent doesn't hand you only the productivity of a developer. It hands you the exposure of one, instantly, and without the years of scar tissue that normally come bundled with it.

## What a developer's attack surface actually is

By the time an experienced developer has a "normal" setup, their machine quietly carries a pile of high-value, high-blast-radius assets:

- Long-lived cloud credentials in `~/.aws/credentials`, `~/.config/gcloud`, kubeconfigs
- SSH keys, GPG keys, signing keys
- API tokens for production services, payment processors, internal systems, often in `.env` files or shell history
- Push access to repositories, sometimes to org-wide infrastructure
- A shell that can install and execute arbitrary code from open package registries

None of this is unusual. It's the baseline cost of doing the work. What's also baseline, and invisible, is the layer of instinct a developer builds alongside it. They know `.env` is radioactive. They feel the twitch before pasting a token into a chat window. They've been burned by a typosquatted package, so they read the dependency name twice. They recognize, dimly, when an instruction in a file is trying to act on them.

That instinct layer took years and a few small disasters to grow. A coding agent grants the asset layer in an afternoon and grants the instinct layer never.

## The asymmetry is the whole problem

When a coding agent runs in a real project, it does, by default, everything that makes a developer's environment dangerous: it reads the filesystem including the secrets, executes shell commands, installs packages, fetches URLs, and acts on the content it reads, including untrusted content from a dependency README, a fetched page, or an MCP tool's output. (This is the lethal trifecta — private data, untrusted content, outbound communication, all in one loop — a structural pattern named by Simon Willison.)

An experienced developer pointing an agent at this has a fighting chance, because their instincts partially backstop the tooling. They'll notice the agent reaching somewhere it shouldn't. They'll scope a token down before handing it over. They'll run it in a container because being burned once taught them to.

The new builder has none of that backstop. They inherited the full surface, every credential, every capability, every way the loop can be turned against them, with no internal alarm that any of it is happening. They can't scope down a credential they don't know exists. They can't get suspicious of an injection they've never heard of. The exposure is identical to the developer's; the defenses are absent.

## By the numbers

This isn't hypothetical, and the scale is the point. AI-assisted coding is now the default on-ramp into software, not an expert's add-on: GitHub crossed 180 million developers in 2025, with 36 million joining that year (roughly one a second), and about 80% of new developers reach for Copilot in their first week ([GitHub Octoverse, Oct 2025](https://github.blog/news-insights/octoverse/)). Claude Code alone passed a $2.5B run-rate by early 2026 (Anthropic).

And the surface isn't just exposed, it's being worked. GitGuardian counted 28.6 million new hardcoded secrets on public GitHub in 2025, up 34% year over year, with leaks tied to AI services up 81%; commits made with AI assistants leaked secrets at roughly twice the baseline rate ([GitGuardian, 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026-pr/)). The exploitation is real, too: the self-replicating Shai-Hulud npm worm harvested GitHub tokens and AWS, GCP and Azure keys across 500+ packages ([CISA, Sep 2025](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem)), and a social app its founder built without writing a line of code exposed about 1.5 million API tokens through a Supabase key left live without row-level security ([Wiz, 2026](https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys)).

One honest caveat, and it's why I'm calling this a thesis and not a measurement: almost none of that telemetry isolates non-developers. It measures "AI-assisted" coding, which blends seasoned engineers with first-timers. The scale and the exploitation are documented; the claim that the new, instinct-less builder is the one bearing the cost is the inference the data motivates, not yet a number anyone has cleanly counted.

## The enemy is the defaults, not the builders

It would be easy, and lazy, and wrong, to land this as "inexperienced people shouldn't be allowed near these tools." That's gatekeeping dressed up as security, and it gets the causation backwards.

The new builders are behaving exactly as the tools invite them to. The tools ship with the dangerous capabilities live and the guardrails off: full filesystem read by default, unrestricted shell by default, open egress by default, credentials sitting in plaintext where the agent will happily read them. Then they hand that loaded configuration to someone who has no way to know what any of it means.

You cannot fix that with a warning label or a "best practices" doc. Asking a first-time builder to remember to scope their credentials is asking them to supply the exact instinct the tool assumed they already had, the one thing they structurally do not have. Security that depends on discipline fails everyone; it fails hardest the person with no discipline to draw on yet.

The fix has to live in the defaults, because defaults are the only thing that protects someone who doesn't know they need protecting:

- Credentials scoped narrow by default, so a hijacked or confused agent can't reach anything that matters
- Egress closed by default, so the loop can't phone home
- Execution sandboxed by default, so a bad instruction stays in a box
- Dependency and secret scanning on by default, so a vulnerable or malicious package, or a committed key, can't land unnoticed

That last one is where I started pulling the thread, with [autoscan-kit](https://github.com/luisalima/autoscan-kit): it makes "scan before it lands" the default, through git hooks, repo templates, and CI, so a missed scan requires removing something rather than forgetting to add it. Isolation here is a configuration discipline, not a product you buy, and the entire point of getting it into the defaults is that the new wave never has to know the discipline existed. The floor of safety should not be a function of how many times you've been burned.

If we ship tools that grant a developer's attack surface to people who've never had one, the responsible thing is not to lecture them about the surface. It's to make the surface safe to inherit.
