---
title: "Skills are the new agents; an ode to skills, and the risks"
pubDatetime: 2026-06-12T12:00:00.000Z
description: "Coding agents are becoming orchestrators of specialized skills. 
But the ecosystem is fragmented, unversioned, and largely unaudited."
kind: essay
draft: true
tags: ["coding-agents", "agentic-architecture", "ai-security", "developer-tooling", "oss"]
---

Skills are the new agents. All you need to do to create a specialized
agent nowadays is to use Claude Code/Codex, hand it a set of skills
and let it run. You can even use the [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)
to wrap that loop into a deployable agent of your own.

Skills enable agent capabilities. However, I would also argue that
skills _are_ the new agents, and that all we need in order
to develop an "agent" is a capable base model, a loop, and the right skills.

## Going back to the basics

Skills are bundles of text files with specialized instructions for agents,
and, occasionally, shortcuts for capabilities that agents need. And, increasingly,
people use coding agents as orchestrators of agents that base
their capabilities on specialized skills. The coding agents
such as Codex and Claude offer the loop/substrate on which
these specialized agents (via skills) can easily run without
extra investment in development.

Many developers are publishing their "skill packages":

- [Peter Steinberger](https://github.com/steipete/agent-scripts/tree/main/skills)
- [Matt Pocock](https://github.com/mattpocock/skills/tree/main/skills)

Skills are also increasingly used as ways to suggest (not enforce...!)
software development workflows to agents. 
See the example of [gstack](https://github.com/garrytan/gstack) and my own example,
my [agent policy kit](https://github.com/luisalima/agent-policy-kit).

Skills are a way to create compound knowledge and give weaker models
a structured process that you can give the weaker LLM to follow.

But this goes beyond development. 

Many people are using skills to [build a second brain](https://github.com/coleam00/second-brain-skills). The [team at Meta built an AI second brain with skills](https://medium.com/@AnalyticsAtMeta/how-we-built-an-ai-second-brain-for-60k-knowledge-workers-78c507dd795b).

And yet...

- Skills are either discovered from github or the multiple (fragmented) ecosystem of skill marketplaces.
- There is no package management system for bundling skills and making sure that versions are pinned 
(although there are conversations on that in the vercel skills repo, to which I did my own contribution
via [my skills-lock](https://github.com/luisalima/skills-lock) package.json approach for locking skill installs).
- Skills also pose a threat because many skills package code, which is not audited.

If skills _are_ the new agents, then an unaudited skill is an unaudited agent
running with your privileges, and we're shipping them through a channel with none
of the controls we'd demand of code: no manifest, no pinning, no review. That's
the gap I think matters most, and where I started pulling the thread, with
[skills-lock](https://github.com/luisalima/skills-lock).
