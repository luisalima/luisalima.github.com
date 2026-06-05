---
title: 'My current "secure" agentic coding stack'
pubDatetime: 2026-06-05T08:00:00.000Z
description: "I value diversity of agents and isolation, I live in the terminal."
kind: note
tags: ["ai-assisted-coding", "coding-agents", "software-architecture", "ai-best-practices"]
---

Lots of people ask about my stack for AI coding. It evolves as new tools appear.

1. **Terminal multiplexer** is [Cmux](https://cmux.com/). I live in the terminal. [Starship](https://starship.rs/) is my prompt. Cmux has the advantage that it notifies you whenever an agent has finished a task, _however_ it does that by injecting a computer use MCP into the agents, which is an approach I'm not particularly fond of. It doesn't notify in the case of sandboxed coding agents. I still use tmux occasionally, and find its programmability superior to cmux, but cmux does offer an in-app browser with a scriptable API.
2. **Isolation** is enabled by [Docker sandboxes](https://docs.docker.com/ai/sandboxes/). I don't allow coding agents to run without external boundaries in my system. In the rare occasion that I do, I activate their native sandboxes and audit the settings using [sandshell](https://github.com/liwala/sandshell).
3. **AI coding agents are** Claude Code, Codex and pi.dev. All my projects have a touch of all of them, usually I brainstorm with Claude Code and the [grill me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md) skill, when it's exploratory/spike work I use Claude Code and for serious/production stuff I use Codex. I am still exploring pi.dev, especially as open-weight models get better for agentic coding.
4. **Memory** is [sheal](https://github.com/liwala/sheal), for browsing past sessions and extracting learnings.
5. **Coding language**... varies by project, I go from python to golang to rust to typescript... Agents allow me to use the best tool for the job.
6. **Security & code analysis scaffolding**: I use one skill that bundles a set of others, each encoding how I want linting, security reviews, and so on. Haven't published that one yet.
7. **Task management**: I use [a simple tasks folder](https://github.com/luisalima/the-tasks-folder-skill) that is tracked in git. Some tasks get promoted to ADRs, and I find that to be approach that works the best for me.
8. **Data science, dataviz, EDA**: I use [marimo notebooks](https://marimo.io/) instead of jupyter notebooks. They are faster, they produce python files that are diffable in git, and you can add widgets for transforming your work into an app.
9. **Editing by hand**: When I need to edit files by hand, I use emacs (yes...) and, occasionally, zed, while I'm awaiting for [neoemacs](https://github.com/eval-exec/neomacs).
10. **Project orchestration**: Right now, I'm orchestrating _projects_ by hand, but Claude Code orchestrates _agents within projects_. I find that to be the sweet spot for me.

I've been through several iterations of this stack, and it's the one that works the best for me right now. Started with Cursor and warp.dev, used lima VMs for isolation, went through a linear/beads phase for task management.


