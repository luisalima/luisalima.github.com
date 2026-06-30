---
title: "Agentic engineering"
description: "The craft of building and operating with agents: the stack I actually run, the method for growing it, the tooling that keeps it honest, and the task layer that keeps work in the diff. Engineering practice, not theory."
status: ongoing
pubDatetime: 2026-06-30T08:00:00.000Z
---

Working well with agents is its own engineering discipline. Not the security of
the agent (that's [its own series](/series/secure-by-design-for-agents/)), and
not the security of what you ship (that's
[another](/series/secure-coding-with-agents/)) — this is the *craft*: how you set
up, grow, and operate the system day to day so it stays a tool and doesn't turn
into sludge.

Everything here is something I run, not something I theorize about.

The arc:

1. **The stack** — my current agentic coding setup, end to end: diversity of
   agents, isolation, terminal-first.
2. **The method** — earn your abstractions: build by hand first, extract the
   system only once it's battle-tested.
3. **The tooling** — one shared policy and skill set that installs across every
   agent, instead of re-maintaining the same config everywhere.
4. **The task layer** — plaintext tasks that live in the diff, managed by a
   skill, with a git-tracked audit trail.

More as the practice evolves.
