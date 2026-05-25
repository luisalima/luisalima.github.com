---
title: "There is no one-size-fits-all with AI"
pubDatetime: 2026-05-25T08:00:00.000Z
description: "There is no consensus yet on deploying AI into orgs, this is my bet on what the best practices should rest on."
kind: note
tags: ["ai-assisted-coding", "coding-agents", "ai-governance", "evals", "ai-best-practices"]
---

There's no one-size-fits-all with AI. Same as there's no one-size-fits-all with humans; you adapt the tools, and the people, to your reality.

The difference is that for established disciplines we have best practices that we built over years. We don't have consensus on the best way for deploying AI and coding agents into an organization. There is no OWASP Top 10, no SOC 2, no shared playbook everyone points to. We're building the plane as we fly it, and we are flying faster and faster.

I think a lot about [first-principles](/notes/we-are-all-herding-agents/) and trying to get to the "irreducible" set of practices that we should rely on when deploying AI. If we over-complicate things, we risk adding even more entropy and complexity into a field that is already increasingly complex.

So here's my take on what we need to take a bet on, the main questions we need to answer:

**Ownership** — when an agent ships bad code, a named human is accountable, not "the AI." Who is that human (or humans), and how can we enable responsible accountability?

**Governance** — not a compliance checkbox, but real limits on what an agent can touch, what needs a human in the loop, and continuous observability as a core pillar.

**Evals** — because "looks right in review" isn't the same as "verified in runtime against what we actually care about."

Even though sometimes it feels like the modern shape of AI has been around for a longer time than it has (because things are evolving so fast), we are still early. And early is exactly when the defaults get set.
