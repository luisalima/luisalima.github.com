---
title: "Running local agents"
description: "When the agent runs on your own hardware: local models and when they're actually enough, small models for narrow jobs, sandboxing what you run, and the privacy and cost case for keeping it off someone else's cloud."
status: planned
pubDatetime: 2026-06-30T08:00:00.000Z
---

Not everything needs a frontier model on someone else's servers. There's a real
and growing case for running agents locally: privacy, cost, latency, and not
handing your codebase and context to a third party by default.

This series is the practical version of that argument — not "local is morally
better," but *where local actually holds up*, where it doesn't, and how to run it
safely when it does.

Planned chapters:

1. **Why local, honestly** — the real trade-offs: privacy and control vs.
   capability and convenience. When the frontier model is worth it and when it
   isn't.
2. **Small models for narrow jobs** — the tasks a small or local model handles
   fine, and how to route to them instead of defaulting to the biggest thing.
3. **Local coding agents** — running a capable coding loop on your own machine,
   what's lost and what's gained.
4. **Sandboxing what you run** — isolating a local agent so "local" doesn't mean
   "unguarded" (this links the secure-by-design work).
5. **The setup** — hardware, runtimes, and a stack that doesn't fight you.

A roadmap, not a backlog yet. Chapters land as I write them.
