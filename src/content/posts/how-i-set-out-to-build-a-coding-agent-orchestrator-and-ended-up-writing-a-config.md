---
title: "How I set out to build a coding agent orchestrator and ended up writing a config auditor instead"
pubDatetime: 2026-05-13T17:07:36.000Z
description: "Building (almost) in public, coding agents, security, and breaking from platform lock-in"
tags: ["coding-agents", "security", "config-management", "developer-tooling", "claude-code", "oss"]
---

Nowadays, like many software engineers, I don’t directly touch code much except for when I want to have some old-fashioned fun with Haskell.

And because many of my projects are “researchy” and iterative in nature, I like having a conversation with the agents, rather than writing a big spec upfront (since I don’t even know the spec yet). Sometimes I have several conversations on the same project with several agents, since I value “hearing” different perspectives and thinking from different angles. Other times I’ll have several conversations in parallel on several projects.

So, I had two problems:

1. **Managing the “fleet” (or “swarm”) is getting hard.** It’s becoming increasingly difficult to keep track of so many instances of Claude Code and Codex. I have a methodology where I use one cmux workspace per project and cmux pings me whenever an agent needs input, but the mental load is, of course, high.
2. **I don’t want platform lock-in.** You can tell me that Claude Code now manages a fleet of agents, that Codex can control your entire computer, that this or that vendor has just shipped The-Feature-That Solves-Orchestration-Once-And-For-All. But I don’t believe in being tied to a single platform. I believe in diversity of tools, in being able to pick the best agent for each task, and in the freedom to switch when something better comes along.
3. **I want security by design.** We’ve seen the damage supply-chain attacks have been doing to the industry (it feels like every day there is a new hack!). I want my coding agents to run sandboxed and to contain the blast radius by default.

(Notice the off-by-one? Joke for engineers.)

So (like anyone does), I set out to create an orchestrator.

## letai and David vs Goliath

The orchestrator is called letai, and Walid and I have been building it together. The premise is straightforward: if we’re going to run several coding agents in parallel against our codebases, each one should live in its own isolated container, with a narrow filesystem mount, a credential broker in the middle, and rotating short-lived credentials instead of long-lived API keys sitting in the shell environment. The agent is treated as compromised by default, and our job is to shrink the blast radius if (when) something goes wrong.

The design borrows from Kubernetes, which is a control plane that schedules agent “pods” onto a runtime, and the runtime is swappable. But this is the David vs Goliath part of the story. Every major agent vendor is racing to build their own orchestration layer on top of their own agent on top of their own runtime. Even if they integrate other agents, the whole story feels like a lock-in.

It also turns out that building orchestrators that support *all* coding agents on several runtimes with a very strong threat model — treating the coding agent itself as untrusted — is a hard problem. Walid, always the practical one, asked the question that reframed it: is there a way we can do this in a simpler way? What security measures do coding agents provide out-of-the-box? So many people are running them directly in their machines. Their defaults must be ok. Right?...

## What can a coding agent do in your machine, after all?

You just installed a coding agent. What can it do with the actual configs that it ships with? What is the agent allowed to read, write, execute and fetch?

Every modern coding agent ships with some kind of sandbox primitive. Claude Code has a native sandbox (Seatbelt on macOS, bubblewrap on Linux). Codex has Seatbelt with a configurable policy. Gemini has `tools.sandbox` with several backend options. So, the capability to “turn on” the boundaries does exist, in theory.

However, in practice, there are nuances. Some of the agents allow you to turn the sandbox on from the agent itself (instead of from its settings file), but it’s not a permanent setting for all your projects unless you go to the settings file. Users also tend to allow commands when they’re distracted or in a rush, leading to wildcard `Bash(*)` permission entries that accumulate from “always allow” clicks across past sessions. People tend to forget to review these things.

So, the capabilities are there, but they are not enough. It’s like having an anti-virus installed and assuming you’re covered, while never checking whether it’s actually running and whether it’s actually scanning your whole disk. We also need to remember to enable and review the capabilities, in different settings, across different coding agents.

So I set out to try to understand this, and that is how sandshell came about.

## What sandshell does

Three verbs do most of the work:

- `audit` answers *“is what I have safe?”* — reads each agent’s real config files and reports findings by severity. Sandbox-enabled checks, bypass-alias checks, wildcard-permission checks, credential-in-shell-rc checks (with source classification — `$(op …)` stays silent, literal values get flagged), MCP allowlist checks. One taxonomy across Claude, Codex, Gemini, plus host hygiene.
- `apply` writes safe defaults. Sandbox on, narrow scope, bypass paths denied, PreToolUse and PostToolUse Bash hooks wired in, audit trail to `~/.sandshell/audit/`. Idempotent, per-agent, or all at once.
- `drift` answers *“did anything change since I last applied?”* — every `apply` captures a baseline, and subsequent audits diff against it. Catches temporary forgotten settings edits, the out-of-band change, the agent self-modifying its own config.

The threat model is narrow. Sandshell is not a runtime sandbox, so it doesn’t catch malicious npm packages before they execute and it doesn’t stop prompt injection. What it does is make sure the boundary the agent already ships with is actually a boundary, that it stays that way between sessions, and that it is enforced across all agents that are installed on the host. It is also purposefully minimal on dependencies; it is a set of bash scripts.

## One layer in a stack

As always, security is a layered problem:

1. **The host config the agent runs inside.** Is the sandbox on? Is it narrow? Are there bypass flags in your shell?
2. **The runtime isolation around the agent.** Containers, microVMs, credential brokers.
3. **The supply chain feeding the agent.** Packages, MCP servers, fetched content.
4. **The agent’s own input handling.** Treating fetched content as untrusted, surfacing suspicious instructions.

You can have a perfect layer 2 and a broken layer 1, and the layer 2 work is limited, because layer 1 is what defines what “compromised” even means for the agent inside the container.

The next posts in this series go into layer 2 in detail: how to actually isolate a coding agent at runtime, what the trade-offs look like across docker, Lima, and sbx, and where the seams between layer 1 and layer 2 leak.

sandshell is our answer at [Liwala](https://www.liwala.dev/) to the layer-1 piece. If you want to see what your own agents are configured to allow, the repo is [here](https://github.com/liwala/sandshell). The next posts will go up the stack.

