---
title: "We are all herding agents..."
pubDatetime: 2026-04-13T15:19:38.000Z
description: "Thoughts on doing it right"
tags: ["ai-agents", "ai-assisted-coding", "safety", "human-in-the-loop", "oss", "software-architecture"]
canonicalURL: "https://herdingagents.substack.com/p/we-are-all-herding-agents"
---

We are all herding agents... are we thinking about the safest way to do that, or are we getting tempted and lost by the sheer speed of it all?

Here’s what I believe.

**I believe AI models are not real intelligence, yet**. However, the emerging properties are real and useful, particularly in coding... when used with clear eyes.

**I believe in the democratization of software building**, and that more people building is good. But people need guardrails they don’t know to ask for.

**I believe that we are building AI systems wrong**. When we have a hammer everything looks like a nail, but let’s not forget that we have more than 100 years of computer science accumulated knowledge.

**I believe LLMs should be the compilers to generate deterministic artifacts**, as much as possible. There is a place for probabilistic outcomes; it should not be the default paradigm.

**I believe in specialization over generalization in systems**. Frontier LLMs should not be the default answer for all types of problems. We should invest in small specialized models for resilience and performance.

**I believe in resilience over speed** (and at the same time, I love the enablement that AI-assisted coding brings), but not at the expense of our working systems that support the Internet.

**I believe security must be the default, not the afterthought**. We no longer have excuses not to do that. After all, code generation just got cheaper.

**I believe humans must stay in the loop**, and that nothing replaces human judgement. We shouldn’t see humans as a bottleneck, but rather as a feature. How do we do that?

**I believe in OSS as infrastructure**, and that the tools that make AI-assisted coding safer belong to everyone.

**I believe in diversity over monoculture**, in agents, in teams and in approaches.

**I believe in first principles over trends**. Always!

If you agree with me on some points, you have the deeper story of how I got here, and an invitation at the end.

### The deeper story

Like I said, I believe AI models as they stand are not real intelligence. I am not in the doomer camp, for sure. I actually work with AI and I believe that this is a necessary transition as we adapt.

I have been fascinated by these intelligence-like properties since the release of ChatGPT back in 2022. I started using coding models more seriously in September 2023, and again I must confess I didn’t anticipate the revolution that these emerging properties would cause in software engineering.

Not even 3 years later and we are seeing the disruption that AI-assisted coding (I have a thing against using the term vibe coding, when we are doing serious work) is causing. We are also just starting to see the consequences: from the democratization of software building, to the security problems, to the disruption of software engineering as a profession and as a field.

I am definitely pro democratization of software and technical skills, and I don’t believe that we will automate ourselves out of a job. I believe, however, that the job will look, feel, and be very different than what we were taught (and that rethinking how we teach is a necessity, but that’s a post for another day).

The cat is out of the bag. Developers and non-developers are using these tools, and we who have been around longer and learned the hard way to have tests, CI, static code analysis, linting, separation of concerns, modularization and everything that it takes to do correct and resilient code must be involved to protect the safety of our systems.

The advent of Claude Code was a breakthrough. The agentic experience still feels like magic to me to this day. Seeing it “reason”, use bash to explore and test in somewhat unconventional ways... However we must keep in mind that the problems still exist underneath. And they become even harder to detect… precisely because the model and the experience are better, so the problems are much more nuanced and we trust the output more. This has systemic consequences, such as vulnerable or brittle code shipping to production by people who don’t understand the process and experienced engineers who get lured by the increase in productivity (I know because I am one!). As a result, the internet is becoming less safe for everyone.

We are building the plane while flying it. We are creating a new software engineering discipline with real consequences, no established practices and no safety net. We have done this before multiple times, of course. 10 years ago, we were seeing the proliferation of JavaScript frameworks. I am not going to say “this time is different”. Maybe it is, maybe it isn’t. But I think that we can all agree on the fact that this time it is happening faster. Much faster.

And we are throwing AI at everything. We are also throwing it at things that we shouldn’t, particularly in coding and systems; we don’t need to call LLMs for problems that have well-known solutions such as optimization and search algorithms. But, when we have a hammer, everything looks like a nail. However, we have a corpus of knowledge in algorithms that spans more than a hundred years and what we should be doing is using AI to accelerate the creation of deterministic runnable code as much as possible, so 99% of the uses of frontier models should be as a compiler of that code.

We reached a point where we don’t just need the coding agents to become better. We need deterministic practices that we can run without relying on humans. If we are using LLMs as compilers then we need safe practices and tools.

Here’s what I’m doing about it.

---

### What I’m building and the Liwala collective

What do I believe we are going to need on the human side? Union and diversity; a collective of tech people that care about these matters. Deterministic, solid tools that catch what humans aren’t catching anymore.

Together with Walid Boulanouar, one of the sharpest minds I know in AI agent development, we are launching **liwala**, a collective of people who care about building safe AI systems and sharing knowledge. We are launching a set of simple, focused, composable tools — each one encoding a good practice that people don’t know to ask for.

The first one is **sheal**. Your AI agent keeps making the same mistakes, burning the same tokens, forgetting the same rules. And it is increasingly hard to rely on humans alone to recognize these patterns. Sheal is short for “self heal” and it helps you with that. It reads your coding agent sessions, extracts failure patterns, and writes the learnings back into your agent config. It compounds.

---

### Follow along

This is Herding Agents. A newsletter about building safer AI systems, from first principles, and with intent. I’ll be writing about the tools we build, the problems we encounter, and the things I learn along the way.

Building in public, imperfect and moving.

Follow along if this resonates!

Thanks for reading! Subscribe for free to receive new posts and support my work.
