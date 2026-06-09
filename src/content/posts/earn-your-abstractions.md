---
title: "Earn your abstractions"
pubDatetime: 2026-06-09T16:00:00.000Z
description: "I built a publishing system by hand with the agent first. Once it was battle-tested, I extracted the hooks and skills. Like in code, you can't abstract what you haven't done by hand at least twice."
kind: note
draft: false
tags: ["ai-assisted-coding", "agentic-architecture", "coding-agents", "ai-best-practices"]
---

Today I shipped a website note, turned it into a LinkedIn post and an X thread, and scheduled both
through Buffer. This system didn't exist a week ago as code, Claude Code and I built it by hand first.

Every post I write goes through the same manual loop with my coding agent: I draft 
(yes, by hand and yes, in emacs :D). Then the agent critiques against my voice, and suggests
backlinks. I'd rewrite, we'd build a Buffer payload, dry-run it, and fix whatever broke.
Then schedule and verify. Every single time. No skills, no hooks. "Just the two of us"
doing the work.

This repetition was the spec building phase.

Doing it by hand is what tells us which steps are which. Some you must never get wrong:

- I never auto-publish
- Agent must always dry-run
- Agent must always verify the scheduled post actually landed
- Agent must never blow the character limit. 

Other aspects are pure judgment: the angle for LinkedIn versus X, the voice, what to
cut. These are things that you don't just imagine in a void, you need to have done the work.

Once I started feeling the pain (and Claude as well, starting to lean into memories for
things that should be in writing) we extracted the abstractions. 

The invariants became hooks, so that they were deterministic gates that the agent cannot skip. 

The "craft" became skills, that are applied with judgement ([a hook is a boundary, and a skill is a request](/notes/a-guardrail-that-admits-it-isnt-one/)).

If we'd built the abstractions first, I am sure we'd have abstracted the wrong things.

It's one of the oldest rules in software, the one that's easy to forget when an agent makes building
feel free: pave the cowpaths first. Do the work manually until the path is worn, then pave where
people actually walk, not where you guessed they would.


