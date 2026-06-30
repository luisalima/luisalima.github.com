---
title: "My Agent Operating Policy"
pubDatetime: 2026-05-22T19:00:00.000Z
description: "The brief I give agents I want operating with less supervision, under AGENTS.md."
kind: note
tags: ["ai-assisted-coding", "coding-agents", "tdd", "agent-operating-policy", "ai-autonomy"]
series: secure-coding-with-agents
seriesOrder: 6
---

Now that coding agents are becoming much better, I want to give them more autonomy. So I wrote an [Agent Operating Policy](https://gist.github.com/luisalima/c6130c6ae1ff0783aa057e4cdf2ff9a0). It covers TDD, version control, when to stop and ask, what "done" actually means, and a few other things. 

I created it based on my past experience as an engineering manager / CTO and software engineer/architect, as well as based on the past 2.5 years of experience working with coding agents. When you write your own, I encourage you to draw on your past experiences too and add more details as you detect the most common failure modes. Also, be sure to review and update it as you go, because the experience with coding agents is exponentially better with time.

Two points I want to call out, because they are where my agents drift the most:

**TDD, but done with intent.** The test must come first and it must fail for the right reason _before_ the agent writes the code. Tests must assert intent (user-visible behavior) and not the implementation. So they should be written as if you don't know the internal implementation (test the interface, not the specifics). I also explicitly ask the agent to never weaken a test to make it pass, which is a frequent failure mode (both for agents and humans!).

**Vertical slices.** Produce slices that are demonstrable end-to-end at every step, not horizontal layers that do nothing on their own. This is the [stronger signal](/notes/slower-loops-stronger-signal/) that I wrote about before, and that is what keeps the agent honest about the direction.
