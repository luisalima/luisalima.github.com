---
title: "Overeager agents and a guardrail that admits it isn't one..."
pubDatetime: 2026-06-09T06:00:00.000Z
description: "Claude Code's permission denial hands the agent a workaround, then asks it to infer and respect the user intent"
kind: note
draft: false
tags: ["ai-security", "ai-assisted-coding", "claude-code", "coding-agents"]
series: secure-by-design-for-agents
seriesOrder: 5
---

> ⎿ Error: Permission to use WebSearch has been denied because Claude Code is running in don't ask mode. IMPORTANT: You *may* attempt to accomplish this action using other tools that might naturally be used to accomplish this goal, e.g. using head instead of cat. But you *should not* attempt to work around this denial in malicious ways, e.g. do not use your ability to run tests to execute non-test actions. You should only try to work around this restriction in reasonable ways that do not attempt to bypass the intent behind this denial. If you believe this capability is essential to complete the user's request, STOP and explain to the user what you were trying to do and why you need this permission. Let the user decide how to proceed.

I just hit this when a tool was denied mid-task (I asked Claude Code to use @claude-code-guide to 
understand more about `CLAUDE_CODE_SAFE_MODE`).
 
To be honest, I was a bit surprised at first. This was one of the few
cases where I run a coding agent in its native sandbox instead 
of an external one (see [my current stack](/notes/my-current-stack/)), because all I was doing in that
project was editing markdown.

This reminded me of the time that I did an experiment with a locked-down Claude Code instance by 
stripping away its `Edit` permissions. When I did that, it started using `sed` to edit files in 
place instead. So I removed `Bash(sed:*)`. And then it started using `awk`, `echo` with file redirects,
etc.

So that's when it hit me. Agents want to please and execute their task, literally. That's what they are
trained to do. And when you cannot predict all the creative ways and lengths to which an 
agent will go to execute, you just admit you cannot prevent it.

So you hand the agent a workaround ("use `head` instead of `cat`"), and then ask it to 
infer the user's *intent* — and respect it. Is this a concession?

`dontAsk` is Claude Code's strictest interactive-free mode, the
one short of full lockdown: it denies any tool you didn't pre-approve, without prompting you.
But the concession is baked into the denial itself. Route around it, without bypassing the 
intent, **please**.

This is Anthropic telling us, in writing, that it cannot fully bound what the agent will do — so it
governs by appeal. But a boundary made of the agent's judgment is the softest one there is.
I would even argue it is not a boundary at all, since that judgment is exactly what prompt injection rewrites.

So, put the boundary you actually depend on somewhere words can't be reinterpreted:
[outside the agent's reach](/notes/broken-sandbox-is-worse-than-no-sandbox/), in a VM or egress
rules it can't touch.


