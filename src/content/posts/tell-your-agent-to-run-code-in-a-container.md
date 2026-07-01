---
title: "Tell your agent to run code in a container"
pubDatetime: 2026-07-01T09:30:00.000Z
description: "SEED — The single highest-leverage instruction you can give a coding agent: don't run that on my machine, run it in a container. Why the default should be isolation, and how to actually make the agent do it."
draft: true
kind: essay
tags: ["ai-security", "coding-agents", "sandbox", "developer-tooling", "ai-assisted-coding"]
series: secure-by-design-for-agents
seriesOrder: 6
---

<!-- SEED — Luisa's post to write. Outline/scaffold only; the prose is hers.
     Concrete hook: this session, she asked the agent to add a Dockerfile so the
     dev server runs in a container instead of on the host — that IS the pattern.
     Delete this comment and write it out, then flip draft: false. -->

## The angle

The cheapest, highest-leverage safety move with a coding agent isn't a fancy
guardrail. It's an instruction: *don't run that on my machine, run it in a
container.* Execution is where the [inherited attack
surface](/essays/inherited-developer-attack-surface/) actually detonates, and a
container turns "the agent ran something bad" into "the agent ran something bad,
in a box."

## Spine (to write)

- **The concrete hook** — I asked my agent for a Dockerfile so the dev server
  runs in a container, not on my host. That request *is* the whole thesis in
  miniature: move execution off the trusted machine by default.
- **Why the default should be isolation** — tie to [running coding agents
  safer](): the host carries the credentials, the container doesn't have to.
  Blast radius, not prevention.
- **How to actually make the agent do it (the practical core):**
  - Put it in the agent's standing instructions (`AGENTS.md` / `CLAUDE.md`):
    "run code in a container, not on the host."
  - The Dockerfile / compose pattern (bind-mount source, ephemeral runtime).
  - Network egress + mounted-secrets discipline — a container with your `~/.aws`
    mounted in isn't isolation.
  - Note: don't rely on the *agent* remembering — enforce it (link the
    "deterministic denial" axiom / [assume the agent is already
    compromised]()).
- **The friction / honest tradeoffs** — usability cost, when a container is the
  wrong tool (needs host access), microVM vs container ceiling.
- **The close** — isolation is a configuration discipline, not a product. The
  instruction is one line; making it the default is the work.

## Open questions / notes

- Series: filed `secure-by-design` (isolation). Overlaps the hardening/`running
  coding agents safer` essay — decide whether this is a focused *practical*
  companion to it, or gets folded in.
- Link `assume-the-agent-is-already-compromised` + `running-coding-agents-safer`
  once those are live (both currently drafts).
