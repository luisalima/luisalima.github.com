---
title: "A broken sandbox is worse than no sandbox, layer your defenses"
pubDatetime: 2026-05-21T12:00:00.000Z
description: "Lessons we need to take from the second bypass of Claude Code's network sandbox in five months"
kind: note
tags: ["ai-security", "ai-assisted-coding", "sandbox", "security"]
---

[Aonan Guan](https://oddguan.com/) published a [(second) complete bypass of Claude Code's network sandbox](https://oddguan.com/blog/second-time-same-sandbox-anthropic-claude-code-network-allowlist-bypass-data-exfiltration/). The outcome is that a process inside the sandbox can reach a host that Claude Code's allowlist says to block, with the consequence that Claude Code can exfiltrate whatever it can touch.

First-principle learnings:

1. never bet on a single trust boundary, especially if you don't control it. Layer your defenses.
2. a broken sandbox is even worse than no sandbox, if the user is counting on it for containment.

The vendor sandbox is _only_ the inner ring of defense, it is not the "wall". That wall needs to live somewhere the agent cannot control, such as a VM or container with strict egress networking rules enforced **outside** the agent's influence.
