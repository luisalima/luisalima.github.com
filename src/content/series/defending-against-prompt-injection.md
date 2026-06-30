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

In SQL, we learned about SQL injections the hard way: a string you meant as *data* gets executed as a *command*. We fixed it structurally: parameterized queries keep code and data in separate channels, so input can never become an instruction.

However, in LLMs, instructions and data flow through the same channel (the context window),
and there is no parameterized-query equivalent. 

So the work isn't about stopping it, but rather about containing it: building systems where a compromised
agent still can't do much damage.

Many technical people (even the ones working with agents) think 
that this will be solved eventually, or that it is a problem of the future.

I think they're wrong. I agree that frontier models will become more and more
robust to such attacks, and that at some point we will need (and get?) architectures that
route instructions and data through separate channels.

But at the same time, frontier models tend to get more costly per token, and we
are already starting to see local/smaller models used for specialized tasks: the
dual-model pattern of an "expensive" frontier model for planning and a cheaper,
faster one for execution.

For the past month, we also started seeing the advent of the "engineering loop"
(a term from [Peter Steinberger](https://x.com/steipete/status/2063697162748260627)):
prompting moves out of human hands and into another agent that drives the loop.

When I was researching this guide, even frontier models handed me answers
straight from training data, already outdated; I had to question them over and
over. That is the gap. The space moves fast, there is active research, and
[Simon Willison coined the term "lethal trifecta"](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/),
but approachable resources for learning it are thin. 
There are also many people reinventing the wheel, and thinking that 
adding another LLM solves the problem (they're wrong). 

So I built the guide I wish
had existed when I started looking into this space.

The guide builds the reasoning from the
ground up, first-principles style. You read
it to *understand* the defenses, and build your mental "muscle"
on prompt injection problems.

The arc, and its reading order (which is deliberately not the deployment order):

1. **The problem:** the lethal trifecta, and why the agents worth building are
   the ones worth attacking.
2. **The principles:** four axioms — assume compromise, never trust settings,
   agents ignore "STOP," enforce deterministically. Then the pattern that falls
   out of them: read → propose → approve → execute.
3. **Detection:** filtering the obvious, and why it's a first layer, never the
   layer.
4. **Prompt engineering:** what hardening the prompt buys you (less than you'd
   hope), and why it can't be the whole defense.
5. **Isolation:** the real blast-radius control — containers, egress, scoped
   credentials.
6. **Secure architecture:** dual-LLM, typed extraction, dry-run. Redesigning so
   the dangerous data flow never exists.
7. **Defense in depth:** layering, because no single control holds.

Then the supporting surfaces agents don't run without: MCP and memory.
By the time you read this, some parts might already read outdated, 
but the core principles stay the same.

The full guide, with runnable notebooks for every attack and defense, lives in
the [agentic-security repo](https://github.com/luisalima/agentic-security). These
essays are the path through it.
