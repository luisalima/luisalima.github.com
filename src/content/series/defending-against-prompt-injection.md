---
title: "Prompt injection is, and will continue to be, a problem"
description: "Been building a learning guide from first principles, focused on prompt injection, reasoned from the axioms up through the defenses, in the order that makes each one make sense so that humans (and agents) can connect the dots."
status: ongoing
pubDatetime: 2026-06-30T08:00:00.000Z
---

Most security when building systems with agents can be solved by
doing the same old boring security measures:

1. Isolate
2. Least privilege
3. Credential rotation
4. (Observability)

But with LLMs, we have something that looks like an old category of
security problems, but is also, at the same time, novel.
That is prompt injection, and it is the one vulnerability you can't patch away, because it isn't
exactly a bug; it is a feature.

In SQL, we learned about SQL injections the hard way: <TODO explain what a SQL injection is>

However, in LLMs, instructions and data flow through the same channel (the context window),
and there is no parameterized-query equivalent for an LLM. 

So the question right now is not really "how do I stop it", but
rather "how do I design a system where a compromised agent
still cannot do much damage."

Many technical people (even the ones working with agents) think 
that this will be solved eventually, or that it is a problem of the future.

I think they're wrong. While I agree that frontier models will become more and more
robust to such attacks, and that at some point, we will see the need
to develop architectures that take instructions and data to different channels,
at the same time, frontier models tend to get more costly per token, and
we are already starting to see the usage of local/smaller models for specialized
tasks (or the dual model of using a frontier "expensive" model for planning
and a cheaper/faster model for execution).

For the past month, we also started seeing the advent of the infamous
"engineering loop", which takes prompting out of the human hands and
into another agent.

Taking this into account, I have been building something for months.
It is the guide that I wish existed when I started looking into this space.
While [Simon Willison coined the term "lethal trifecta"]() and there is
active research in the space, I feel that there is a lack of approachable 
resources for larning this. It also happened to me that, when researching for the guide,
frontier models gave me answers out of training data, that was 
still outdated; I had to question the model over and over again.

The guide builds the reasoning from the
ground up, first-principles style. You read
it to *understand* the defenses, not to copy them.

The arc, and its reading order, which is deliberately not the deployment order:

1. **The problem** — the lethal trifecta: why the agents worth building are the
   ones worth attacking.
2. **The principles** — four axioms: assume compromise, never trust settings,
   agents ignore "STOP," enforce deterministically. Then the pattern that falls
   out of them: read → propose → approve → execute.
3. **Detection** — filtering the obvious, and why it's a first layer, never the
   layer.
4. **Prompt engineering** — what hardening the prompt buys you (less than you'd
   hope) and why it cannot just be "it".
5. **Isolation** — the real blast-radius control: containers, egress, scoped
   credentials.
6. **Secure architecture** — dual-LLM, typed extraction, dry-run. Redesigning so
   the dangerous data flow never exists.
7. **Defense in depth** — layering, because no single control holds.

Then the supporting surfaces agents don't run without: MCP and memory.
By the time you read this, some parts might already read outdated, 
but the principles stay the same.

The full guide, with runnable notebooks for every attack and defense, lives in
the [agentic-security repo](https://github.com/luisalima/agentic-security). These
essays are the path through it.
