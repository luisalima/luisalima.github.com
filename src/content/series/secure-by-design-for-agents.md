---
title: "Secure by design for coding agents & beyond"
description: "The agent is the attack surface. Threat model, isolation, layered defenses, and the stakes for the people who never signed up for them — secure-by-design applied to the agents we now run on our own machines."
status: ongoing
pubDatetime: 2026-06-30T08:00:00.000Z
---

The capabilities that make an agent useful are the same ones that make it
exploitable. You can't patch that away; you design around it. This is the move we
drew at Fyde: stop trusting the perimeter, assume the inside is hostile, contain
the blast radius. Agents are repeating the mistakes the web already made and
unlearned.

This series is the practitioner's arc for coding agents and the systems around
them. The prompt-injection vector gets its own first-principles treatment in
[Defending against prompt injection](/series/defending-against-prompt-injection/);
here the focus is the rest of secure-by-design: the threat model, the isolation,
the layering, and the stakes.

The arc:

1. **The threat model of agents is wrong** — one agent with self-imposed limits
   can bypass itself. Separation of capabilities is the fix.
2. **Running coding agents safer** — isolation and sandboxing for the hardest
   case: an open-ended goal you can't scope up front.
3. **A broken sandbox is worse than no sandbox** — why one layer is a lie, and
   what layering actually buys you.
4. **You inherited a developer's attack surface** — the stakes, for the people
   who got the capability without the instinct.
5. **A guardrail that admits it isn't one** — a concrete failure, because the
   scenario is the argument.

Some chapters are live; others land as I voice them. Read in order or jump to the
one that's biting you.
