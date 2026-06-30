---
title: "Building your AI operating system"
description: "Personal applications over your own data, built securely: an agent that mines your email, one that mines your browsing history, and the rest of the private AI layer that actually earns its access. Useful, and not handed to someone else's cloud."
status: planned
pubDatetime: 2026-06-30T08:00:00.000Z
---

The most useful AI isn't the chatbot in a tab; it's the set of small agents that
work over *your* data — your email, your reading, your history — and hand you
back leverage. The catch is that those are exactly the agents with access worth
attacking. So the whole point of this series is building them in a way where the
access is earned and contained, not assumed.

This is the personal version of everything in the security series, turned into
things I actually use:

- **An agent that mines my email, securely** — surfaces what matters without
  becoming an exfiltration path.
- **An agent that mines my browsing history, securely** — turns a firehose into
  signal, on my machine.
- **The private layer around them** — scoped access, local where it counts, and
  the trust boundaries that make "give an agent my inbox" a sane sentence.

A roadmap for now. Each project lands as a build write-up here; the ones with a
clean problem-to-outcome shape also graduate to a [case
study](/case-studies/). Chapters as I ship them.
