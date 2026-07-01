---
title: "Most people doing 'vibe-coding' inherited a developer's attack surface without realizing it"
pubDatetime: 2026-06-19T12:00:00.000Z
description: "Coding agents hand non-developers a developer's full attack surface, without the years of instinct that usually come with being in the trenches doing software development. The exposure is identical, but the defense is absent. The fix must live in the defaults."
kind: essay
draft: true
tags: ["ai-security", "vibe-coding", "coding-agents", "supply-chain", "ai-safety"]
series: secure-by-design-for-agents
seriesOrder: 4
---

We live in a new world, where the boundaries between creatives without 
software skills and development are collapsing. A product manager, 
a solo founder, and anyone can create their own software.

I believe that is a good thing. It feels like being in the early Geocities days 
([try searching for "Geocities" in Google](https://www.google.com/search?q=geocities&oq=geocities]),
where people suddenly discovered the joys of creating with html and animated gifs.

Creating more custom software is a good thing, for all of us. 
SaaS gave us an abstraction that (mostly) works, but it also came with a cost:
the one of adjusting to the "norm" and to the "standard". In enterprise,
it came with a bunch of very specific jobs (like the "JIRA manager") that
are not focused on the specific core business problems (and that is actually
what SaaS was supposed to solve!)

And I truly believe that, just like in the advent of the web (...and Geocities), 
all of these new creations will uncover new needs, drive more ambitious projects, 
there will be an explosion of software, and there will be a need for _more_ software 
engineers, not less (although software engineering is already looking like
a very different job).

However, there is a big problem. All of these people who are using coding agents
to create new software feel that they inherited a developer's
productivity. But most people don't realize that they also inherited
a software developer's attack surface.

## What a developer's attack surface actually is

By the time a  developer has a "normal" setup, their 
machine can carry a pile of high-value, high-blast-radius assets:

- Long-lived cloud credentials in `~/.aws/credentials`, `~/.config/gcloud`, kubeconfigs
- SSH keys, GPG keys, signing keys
- API tokens for several services, payment processors, internal systems, often in `.env` files or shell history
- Push access to repositories, sometimes to org-wide infrastructure
- A shell that can install and execute arbitrary code from open package registries
- etc...

If the setup is done right, these controls will also have their own
blast radius set. After all, if we did our jobs right, security should be 
very boring: (1) isolate, (2) apply the principle of least privilege, 
(3) do aggressive credential rotation, and (4) always do observability.

But this is a catch-22 problem. In order to know _this_, you also need to
_know_ the security practices. And [agents only do what we ask them to]().

So the baseline cost of doing the work outside of an environment
where these practices were set for you can include exposure to
production (and dangerous) environments. Heck, you don't even need
exposure to production keys. You only need to [have one compromised
extension and have access to repos](/essays/swiss-cheese-the-github-attack/).

What's also baseline, and invisible, is the layer of instinct a developer builds 
alongside it. A developer knows `.env` is radioactive, and that you need
multiple environments, that the production credentials should never live
in your machine. 

They (hopefully) don't paste a token into a chat window.
They've been burned by a typosquatted package, so they (hopefully) read the dependency name twice.
They recognize when an instruction in a file is trying to act on them, and
they (hopefully) pin their package versions.

But that instinct layer took years (and a few small disasters,
sometimes at a cost) to grow. 

Using a coding agent grants the asset layer in minutes, and grants the instinct layer...
never, because most people are using coding agents the same way they "used"
developers: full delegation and trust that they are doing the right thing
because "they're the ones who know".

## The asymmetry is the whole problem

When a coding agent runs in a real project, it does, by default, 
everything that makes a developer's environment dangerous: 
it reads the filesystem, executes shell commands, 
installs packages, fetches URLs, and acts on the content it reads, 
including untrusted content from a dependency README,
a fetched page, or an MCP tool's output. 

An experienced developer pointing an agent at this has a fighting chance, 
because their instincts partially backstop the tooling.
They'll scope tokens down before handing them to agents, 
and (hopefully) run agents in containers/sandboxes.

The new builder has none of that backstop. They inherited the full surface,
every credential, every capability, every way the loop can be turned against them,
with no internal alarm that any of it is happening. They can't scope
down a credential they don't know exists; when they do, they don't know
what a scoped down credential is. New builders cannot get suspicious of an
injection they've never heard of. The exposure is identical to the developer's,
but the defenses are absent, or rather, they are the ones handed by the 
coding agent, and [they won't be there if you don't ask]().

## The problem by the numbers

You might think that this is all rambling by a person who has
been working at the intersection of software and security her whole working career.

But this isn't hypothetical, not anymore. If last year, the thought of
running AI-generated code blindly gave me the creeps, nowadays, 
AI-assisted coding is the default on-ramp into software

GitHub crossed 180 million developers in 2025, with 36 million 
joining that year (roughly one a second), and about 80% of new developers
reach for Copilot in their first week ([GitHub Octoverse, Oct 2025](https://github.blog/news-insights/octoverse/)). Claude Code alone passed a $2.5B run-rate by early 2026 (Anthropic).

GitGuardian counted 28.6 million new hardcoded secrets on public GitHub in 2025, 
up 34% year over year, with leaks tied to AI services up 81%; 
commits made with AI assistants leaked secrets at roughly twice the
baseline rate ([GitGuardian, 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026-pr/)).

The self-replicating Shai-Hulud npm worm harvested GitHub tokens and AWS, 
GCP and Azure keys across 500+ packages ([CISA, Sep 2025](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem)), 
and a social app its founder built without writing a line of code exposed
about 1.5 million API tokens through a Supabase key left live without 
row-level security ([Wiz, 2026](https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys)).

One honest caveat: almost none of that telemetry isolates non-developers, 
so we are measuring the results of using "AI-assisted" coding, 
which blends seasoned engineers with first-timers. 
And maybe, as developers, we are starting to suffer from [Automation Bias](https://en.wikipedia.org/wiki/Automation_bias), so the problem goes beyond new developers.


## The enemy is the defaults

It would be easy, and lazy, and wrong, to land this as 
"inexperienced people shouldn't be allowed near these tools."
That is gatekeeping dressed up as security, and it gets the causation backwards.

The new builders are behaving exactly as the tools invite them to. 
The tools ship with the dangerous capabilities live, because
[the agents need them to be useful](), and people tend to
run the tools accepting changes and reads blindly.

And while [Anthropic now has an "auto" mode]() and the main
coding assistants offer a [sandbox, although its defaults are usually
not very strict](), we need to go beyond this. But how?

We cannot fix this with a warning label or a "best practices" doc. 
Asking a first-time builder to remember to scope their credentials is
asking them to supply the exact instinct the tool assumed they already had,
the one thing they structurally do not have. Security that depends on discipline
fails everyone, and it fails hardest the person with no discipline to draw on in the first place.

The fix must live in the (boring) defaults. Credentials scoped narrow by default,
egress closed by default, execution sandboxed by default, dependency
and secret scanning on by default.

If we ship tools that grant a developer's attack surface to people who've never
had one, then we need to make the surface safe to inherit. And (more) security is always a
matter of defense in depth.

