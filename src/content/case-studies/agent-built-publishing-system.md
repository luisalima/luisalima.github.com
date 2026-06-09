---
title: "Building a publishing system with agents, then hardening it"
description: "Hand-built a content pipeline with an AI agent, then extracted the invariants into deterministic hooks so the agent couldn't skip them."
pubDatetime: 2026-06-09
draft: true
type: project
subject: "luisalima.com publishing system"
sector: "Personal / open tooling"
role: "Designer & builder"
timeframe: "2026"
stack: ["Claude Code", "Astro", "Buffer API", "agent hooks & skills"]
results:
  - "Drafting-to-publish loop that a human still voices and approves"
  - "Safety invariants enforced in code, not in prompts (no auto-publish)"
  - "Reusable skills extracted only after the flow was proven by hand"
tags: ["agentic-systems", "case-study", "tooling"]
---

<!--
  TEMPLATE / DRAFT — this is a scaffold to show the shape of a case study.
  Replace the prose with your own words (the system voices the words), set
  draft: false when ready, and anonymize any client studies in `subject`.
-->

## Challenge

Publishing across a site, a newsletter, and social channels means repeating
the same error-prone steps — and handing those steps to an AI agent makes it
faster to get them subtly wrong. The risk wasn't speed; it was an agent
auto-posting something unreviewed, or quietly dropping a safety step.

## Approach

I built the whole pipeline by hand with the agent first — drafting, scheduling,
and posting — until the workflow was battle-tested. Only then did I extract the
load-bearing parts: deterministic **hooks** for the invariants that must never
be skipped (nothing auto-posts; created posts are verified), and **skills** for
the craft (voice, repurposing, cards). Invariants live in code; judgment stays
with me.

## Outcome

The agent now does the heavy lifting while the rules it can't talk its way past
are enforced outside the prompt — and the words still get a human voice before
anything ships.
