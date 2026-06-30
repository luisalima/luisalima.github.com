---
title: "The task is the variable"
pubDatetime: 2026-06-12T14:00:00.000Z
description: "Safety in AI-assisted coding is not really a dial between fast and careful. The real variable is the task: adjust your posture to match it."
kind: note
draft: false
tags: ["ai-assisted-coding", "ai-security", "software-architecture"]
series: secure-coding-with-agents
seriesOrder: 1
---

We don't talk enough about safety in AI-assisted coding. And when we do, we frame
it as a dial between speed and caution: fast and loose, or slow and careful.
I realized the real variable is the task, not the speed.

There are several fundamentally different jobs that we run as engineers when we 
are writing code:

- One (and usually the first one) is running a `spike`.
A task consists of exploring, researching and prototyping,
usually with nothing real connected (the infamous "csv/json backend"). 
A spike is the moment to be playful,
to create code that is _meant to throw away_. 
- The other is working on a `build`: that means code headed for production,
touching real data, acting in real systems. 

It's the same tool both times: the risk profiles are opposite.

For me, a `spike` doesn't mean "no safety." 
Rather, it means no safety you can safely _postpone_. 
You can defer the static analysis and the test coverage. 
What you can never defer is anything whose damage lands now: 
secrets, credentials, and 
[anything wired to a live system](/notes/broken-sandbox-is-worse-than-no-sandbox/).

So the unit of configuration is the posture, not the tool itself.
And a posture should be a mode that is wired to the task's risk level, 
and chosen before the agent starts. 

Think about environments, our hard learning from years of software engineering
done wrong.

Dev, staging and prod aren't different because the code is super different (it
is actually usually exactly the same!). 
Environments differ because you don't _pick_ prod, you _promote_ into it. 
The hard part was never having different configs. The problem is in the seam: 
the moment a spike quietly becomes a build, but nobody reset the posture.

Match the posture to the task, then guard the seam between them.
