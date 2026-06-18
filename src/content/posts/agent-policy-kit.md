---
title: "My agent policy kit"
pubDatetime: 2026-06-12T08:00:00.000Z
description: "I was maintaining the same operating rules in a different config 
for every coding agent I run. So I built one shared policy and skill set
that installs across all of them."
kind: note
draft: false
tags: ["coding-agents", "agentic-architecture", "developer-tooling", "claude-code", "oss"]
---

I run lots of coding agents. My favorite pick for brainstorming (and getting [grilled](/notes/grill-me/))
is Claude Code, but I also run Codex, Amp, and Pi.dev.

My MO since Fable was released is to plan (grilled style) on Claude Code,
then do the implementation on GPT 5.5, then security reviews on both.
When I want something that I can leave running without much overseeing,
I use Amp (even though I didn't touch it since Fable came out).

But I had a problem. Each agent wants its own config: `.claude` here,
`AGENTS.md` there, skills in yet another place. 

I was keeping the same [operating
rules](/notes/agent-operating-policy/) in
several slightly-diverging copies. Plus, I wanted to enforce them better,
my AGENTS.md was getting crowded and I wanted to modularize the key points in
skills.

I also like installing these policies to specific repos, instead
of running them globally; [sometimes I spike, sometimes I do "real software engineering"](/notes/the-task-is-the-variable/).

And I don't want drift on the things that are keeping my agents in line.

So I built **agent-policy-kit**: one shared policy and skill set, installed into
a repo for whichever agents I am using. The same rules of engagement, and the same
skills (`opentasks`, `tdd`, `adr`, `spike`/`slice`/`done`), wherever the agent
reads from. 

It's deliberately boring; shell, versioned, drop-in. No npx install or anything.
I built it for myself. I think that we all have different styles (and tasks)
that it warrants pointing your coding agent at this and getting inspired,
rather than just installing it for yourself blindly.

 Don't forget that [a hook is a boundary, a skill is a request](/notes/a-guardrail-that-admits-it-isnt-one/). One of the skills it ships is small enough
to stand on its own — [tasks that live in the diff](/notes/opentasks-skill/).

Repo: [github.com/luisalima/agent-policy-kit](https://github.com/luisalima/agent-policy-kit)
