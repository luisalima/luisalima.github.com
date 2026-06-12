---
title: "One policy, every agent"
pubDatetime: 2026-06-09T12:00:00.000Z
description: "I was maintaining the same operating rules in a different config for every coding agent I run. So I built one shared policy and skill set that installs across all of them."
kind: note
draft: true
tags: ["coding-agents", "agentic-architecture", "developer-tooling", "claude-code", "oss"]
---

<!-- DRAFT — I drafted this; it needs your voice before draft: false. -->

I run more than one coding agent. Claude Code most days, but Codex, Amp, and Pi
when the task calls for it. Each one wants its own config: `.claude` here,
`AGENTS.md` there, skills in yet another place. I was keeping the same operating
rules — how to plan, when to write the test first, how to record a decision — in
several slightly-diverging copies. That's exactly the drift you don't want in
the thing that's supposed to keep agents in line.

So I built **agent-policy-kit**: one shared policy and skill set, installed into
a repo for whichever agents you use. The same rules of engagement, and the same
skills (`opentasks`, `tdd`, `adr`, `spike`/`slice`/`done`), wherever the agent
reads from. Install for all of them, or just the ones you run.

It's deliberately boring — shell, versioned, drop-in. The point isn't the
installer; it's that your agents stop each inventing their own house style.

Same instinct as [a hook is a boundary, a skill is a request](/notes/a-guardrail-that-admits-it-isnt-one/),
now portable across agents and repos. One of the skills it ships is small enough
to stand on its own — [tasks that live in the diff](/notes/opentasks-skill/).

Repo: [github.com/luisalima/agent-policy-kit](https://github.com/luisalima/agent-policy-kit)
