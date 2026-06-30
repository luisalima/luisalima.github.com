---
title: "Keeping Agent Sessions Around Long Enough to Learn From Them"
pubDatetime: 2026-06-30T09:00:00.000Z
description: "sbx gives agents clean, isolated sandboxes, but the session evidence dies with them. sheal@0.3.0 adds acquisition flows to pull and preserve raw agent sessions, so the learning loop survives the teardown."
draft: true
kind: essay
tags: ["coding-agents", "agentic-architecture", "developer-tooling", "oss", "ai-assisted-coding"]
series: agentic-engineering
seriesOrder: 5
---

<!-- DRAFT — AI-generated release write-up for sheal@0.3.0. Needs a full voice
     pass: it reads like release notes, not like Luisa. Revoice (open on the
     concrete problem, cut the marketing cadence), then remove this comment and
     flip draft: false. -->

I've been using sbx more heavily for agent work. It gives me clean, isolated sandboxes where agents can make changes without trampling my main working tree. That part is great.

But it surfaced a new problem: the work, the transcript, and the useful context often live inside the sandbox. If the sandbox goes away, or if the agent runtime prunes its own session history, the evidence disappears before I can learn from it.

That matters because sheal is built around a simple idea: coding agents get better when we preserve what happened, inspect repeated failure patterns, and turn those patterns into durable rules, docs, and workflows. If the raw session disappears, the learning loop breaks.

So sheal@0.3.0 adds the first supported acquisition flow for sbx.

```
sheal pull --list
sheal pull sbx <name>
sheal pull sbx --all
```

`sheal pull --list` shows available sandboxes. `sheal pull sbx <name>` pulls one sandbox. `sheal pull sbx --all` captures every eligible sandbox.

The goal is not just to copy a diff. The goal is to preserve enough evidence to understand the session later:

- what changed in the workspace
- what agent-home files existed
- what transcripts were available
- where the evidence came from
- what expected evidence was missing

That last part matters. Real agent environments are messy. Sometimes there is a diff but no transcript. Sometimes a transcript exists under one runtime path but not another. Sometimes the sandbox has already been partially cleaned up. sheal now records those gaps instead of pretending the capture was complete.

The second piece of this release is the raw session registry.

Pulled and imported sessions are normalized into:

```
.sheal/sessions/raw/<stable-session-id>/
```

This gives the project a durable, local copy of the evidence. It also gives sheal a stable substrate for later commands like retrospectives, browsing, search, and learning extraction.

That durability is important because agent systems routinely prune session history. From the agent's point of view, that is reasonable: old sessions are storage overhead. From a learning system's point of view, it is a problem. The most valuable patterns often only show up across many sessions.

A single mistake is noise. The same mistake repeated five times is a rule waiting to be written.

Keeping the raw sessions around lets sheal mine them later for two audiences:

For agents, the output can become operating rules: "inspect real samples before writing parsers," "run the CLI help before guessing flags," "checkpoint sandbox work before teardown."

For humans, the same history becomes an audit trail of how the work actually happened: where time was lost, which tools failed, which assumptions were wrong, and which parts of the workflow need tightening.

This release also adds `sheal sessions import`, which can normalize live local Claude and Codex sessions into the same raw registry:

```
sheal sessions import
```

That means sheal can now preserve sessions from both active local agent homes and pulled sbx sandboxes.

There is also checkpoint support for fragile or long-running environments:

```
sheal pull sbx <name> --checkpoint
sheal pull --checkpoint-run
```

This is for the cases where waiting until the end is too risky. If a sandbox may disappear, checkpoint it while it is still alive.

The bigger direction here is that sheal is becoming less dependent on any one agent runtime's memory model. Agent sessions are treated as evidence. Evidence gets acquired, normalized, preserved, and later distilled into learnings.

That is the loop I want:

1. Agents do work in isolated environments.
2. sheal pulls the evidence before it disappears.
3. Sessions are stored in a durable raw registry.
4. Retrospectives mine those sessions for repeated patterns.
5. Useful patterns become rules for future agents and context for humans.

Install:

```
npm install -g @liwala/sheal@0.3.0
```

This is still early, but 0.3.0 is an important step: sheal can now keep the evidence long enough to learn from it.
