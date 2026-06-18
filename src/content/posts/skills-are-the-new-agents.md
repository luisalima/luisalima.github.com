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
agent nowadays is to use a harness such as Claude Code, Codex, or even OpenClaw and Hermes,
hand it a set of skills and let it run. 

Skills were originally meant to enable agent capabilities. 
However, I believe that with the sophisticated new harnesses,
skills _are_ the new agents, and that all we need in order
to develop an "agent" is a capable base model, a good harness running the
agent loop, and the right skills.

## What are skills, and what is a harness?

Skills are bundles of text files with specialized instructions for agents,
and, occasionally, scripts that act as tools that can be called by the agent.
They are, essentially, shortcuts for capabilities that agents need. 

I won't bother you with the full anatomy of a skill in this post; the gist is
simple. A skill is a folder of plain-text instructions (a `SKILL.md`) that an
agent loads on demand, plus, occasionally, a script or two it can call. A plugin
is essentially a packaged skill: the same idea, bundled with a little wiring so
an agent can discover, install, and invoke it directly while executing.

A harness is the software layer around an AI model; think of 
a harness as an environment that provides the AI model with the tools
and limits it needs to function, like an agent operating system.

Harnesses are what enable AI models to become "agents". Claude Code, Codex, and even
personal AI agents such as OpenClaw and Hermes put the "operating system" around
the AI model.

And, increasingly, people use these harnesses as orchestrators of agents whose
capabilities come from specialized skills, running on top with no extra
investment in development.


## Why do I think skills are the new agents?

For most of the last two years, building an "agent" meant building a system: a
bespoke prompt, a hand-wired set of tools, an orchestration loop, an eval
harness, and so on. The loop was the hard, expensive part.

That part is now commodity. Claude Code, Codex, 
and the [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)
hand you a capable base model and a production-grade loop for free; you can even
use the SDK to wrap that loop into a deployable agent of your own. What's left,
the thing that actually separates a security-review agent from a release-notes
agent, is the skills you give it.

So I mean it fairly literally: the loop is substrate, and the skill is the part
you're really authoring. It carries the process, the judgment and the intent. The
skill is the agent.

## Skills in development

Many developers are publishing their "skill packages":

- [Peter Steinberger](https://github.com/steipete/agent-scripts/tree/main/skills)
- [Matt Pocock](https://github.com/mattpocock/skills/tree/main/skills)

Skills are also increasingly used as ways to suggest (not enforce...!)
software development workflows to agents. 
See the example of [gstack](https://github.com/garrytan/gstack) and my own example,
my [agent policy kit](https://github.com/luisalima/agent-policy-kit).

Skills are a way to create compound knowledge and give weaker models a
structured process to follow.

But this goes beyond development. 

Many people are using skills to [build a second brain](https://github.com/coleam00/second-brain-skills). 
The [team at Meta built an AI second brain with skills](https://medium.com/@AnalyticsAtMeta/how-we-built-an-ai-second-brain-for-60k-knowledge-workers-78c507dd795b).

I think that, in the future, we will see more and more "bundles" of skills
being packaged as a business, and I see this as an amazing
way for solopreneurs to scale themselves. David Arnoux, who I collaborate with, is
[one such example](https://www.heyarnoux.com/gtm-brain/); he built a GTM Second Brain 
where he essentially "cloned" his skills into a Claude Code package.

Skills are also spreading fast enough that distribution is becoming its own layer.
The bigger entry points today for "single" skills are [Vercel's skills directory](https://www.skills.sh/),
which is a growing, browsable catalog, and [Claude plugins](https://claude.com/plugins),
which is Anthropic's own packaged-skill marketplace. But the market is spreading fast
and there are several alternatives, each with its own CLIs and install methods.

There is also a long tail of GitHub repos and personal collections,
the preferred method for developers to publish their skills,
sometimes also packaged as an npm package.

But discovery is only one side of the story.


## But the infrastructure isn't ready yet

We are seeing the first hints at a future where individuals
publish (and perhaps sell) their packages of skills for several use cases:
marketing, GTM, writing, development, etc.

However, skills are either discovered from github or the multiple (fragmented) ecosystem of skill marketplaces.

There is no package management system for bundling skills and making sure that versions are pinned 
(although there are conversations on that in the vercel skills repo, to which I did my own contribution
via [my skills-lock](https://github.com/luisalima/skills-lock) package.json approach for locking skill installs).

Skills also pose a threat: not only because many skills package code, which is not audited 
(and, in many cases, unversioned), but also because they inject prompts into 
privileged agents. And, if [all useful AI agents are dangerous](/essays/the-most-useful-ai-agents-are-dangerous-by-design/),
useful AI agents with a myriad of skills coming from different sources are
even more dangerous.

If skills _are_ the new agents, then an unaudited skill is an unaudited agent
running with your privileges, and we're shipping them through a channel with none
of the controls we'd demand of code: no manifest, no pinning, no review. That's
the gap I think matters most, and the one where I started pulling the thread, with
[skills-lock](https://github.com/luisalima/skills-lock) and [skills-need-a-lockfile](/essays/skills-need-a-lockfile/).

Skills are not "just text files". Skills are the new agents, and they need to be secured.
