---
title: "I switched from beads to plaintext tasks that live in the diff, managed by a skill"
pubDatetime: 2026-06-12T11:00:00.000Z
description: "I wrote opentasks-skill to teach my coding agents to manage tasks without
external dependencies, with a git-tracked audit system."
kind: note
draft: false
tags: ["coding-agents", "ai-assisted-coding", "developer-tooling", "claude-code", "oss"]
---

If you worked with coding agents for a while, you know
that you cannot just trust their embedded "todo". Agents forget stuff,
there's the limitations (and degradation) of context,
and you don't have a persistent/deterministic store.

On the other hand, for small-ish projects, going Linear or a full task manager sounds like too much.

For a while, I used [beads](https://github.com/gastownhall/beads).
And, for a while, it worked well; agents picked up the "bd" cli
very quickly and managed tasks effectively.
However, after their port to dolt, things got very messy and unstable.
It started being a blocker for me (and for claude and codex and...)

The biggest advantage of beads is that tasks live in 
git. I want my agents to manage my tasks anyway, so I don't need the fancy
UIs.

And I'm a big fan of having ADRs, open questions, etc in git.
Nowadays agents are also much smarter. So I thought... can we make this a skill?

So I built **opentasks**, which is the smallest version of that idea: one markdown file per task
or open question in `docs/tasks/`, a stable id (`T3`, `Q1`), a status in
frontmatter (`todo`/`doing`/`blocked`/`done`), and an auto-generated index. The
agent updates them as it works; I watch the state move in the same diff as the
code. Decisions link to the ADR that explains the why.

No database, no board, no context the agent has to be told about out of band.
Task state becomes a reviewable artifact, versioned together with the work.

Repo: [github.com/luisalima/opentasks-skill](https://github.com/luisalima/opentasks-skill)

Limitations: it is eventually consistent. Tasks travel with the branch they're created on, 
until they eventually land on `main`.
