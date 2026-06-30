---
title: "Agents only do what you ask, and that is a problem... and a solution"
pubDatetime: 2026-06-08T06:00:00.000Z
description: "The practices that make software hold up used to live in engineers' heads and in wikis nobody read. They now need to live in instructions that steer an agent."
kind: note
tags: ["ai-assisted-coding", "coding-agents", "software-architecture", "ai-best-practices"]
series: secure-coding-with-agents
seriesOrder: 2
---

Agents only do what you ask, and that is a problem. 

I don't see new coders caring for linting anymore. 
They don't know how to ask for a proper static code analysis or security review. 
They adjust tests to the code rather than doing TDD on intent and behavior.
They don't have proper logging/observability policies. They don't know what 
are the best practices for secret management.

These things, in the past, lived in the heads of senior engineers, and in 
documentation and wikis that they wrote. It also lived in the good defaults
created by frameworks such as Ruby on Rails, company-level and public scaffoldings.

All of this happened because we, humans, cared for the craft of software engineering.

Now we have coding agents and lots of new people to the field: some 
are converted PMs, others juniors just entering software engineering in a radically 
different era.

But agents do what you ask. While there are some best practices that are encoded into
their behavior, due to their training corpus, they are optimized for delivering.

And the practices that make software hold up later (ADRs, 
least privilege, secrets hygiene, the intent
captured before the code) get dropped not because they stopped mattering, but
because nobody told the agent they were part of the job.

That same property, though, cuts the other way. There is now a place to put those
practices where they will actually have a chance of being read: skills, hooks, agent instructions,
repo-level config. 

The caveat: encoding is necessary, but not sufficient for non-deterministic artifacts.
An agent can skip skills, misapply them or route around them. And, again, _someone_ needs
to know that these exist.

Once they're there, though... maybe the wikis with best practices finally found their audience, 
and it just isn't human.
