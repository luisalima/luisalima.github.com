---
title: "Secure coding practices with agents"
description: "The other half of the problem: not securing the agent, but shipping secure software with one. Posture, supply chain, and the practices that used to live in engineers' heads and now have to live in the agent's instructions."
status: ongoing
pubDatetime: 2026-06-30T08:00:00.000Z
---

Securing the agent is one problem, but using the agent to ship software that holds
up is another.
And as software engineering increasingly means "AI-assisted engineering",
it's the problem most teams will actually have.

The practices that make software resilient used to live in senior engineers'
heads, in [our collective "boo-boos"](https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing-the-fuck-down/) and in wikis (that unfortunately mostly nobody read).

With agents writing the code, those practices
have to move into instructions, defaults, and checks that fire on their own.
Discipline you have to remember is discipline you and the agents will skip when it
matters.

The arc:

1. **The task is the variable:** safety isn't a fast/careful dial. Match your
   posture to the task in front of you.
2. **Agents only do what you ask:** which is the problem and the solution; you
   encode the standards instead of hoping for them.
3. **Skills are just text files. So where's the lockfile?** A skill is a
   prompt injected into a privileged agent. That's a supply-chain problem.
4. **Dependency scanning should be a default, not a discipline:** push the scan
   into places that fire without you, so skipping it takes effort.
5. **Accuracy over agreement:** the standing instructions that make an agent
   tell you you're wrong instead of cheerfully shipping the mistake.
6. **An agent operating policy:** TDD, version control, when to stop and ask,
   and what "done" actually means, written down so the discipline survives.


