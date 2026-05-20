---
title: "Slower loops, stronger signal"
pubDatetime: 2026-05-20T13:41:12.000Z
description: "Quick feedback loops are necessary (but not sufficient) scaffolding for AI-assisted coding."
kind: note
tags: ["ai-assisted-coding", "coding-agents", "software-architecture"]
---

Quick feedback loops are necessary (but not sufficient) scaffolding for AI-assisted coding.

The default answer for this is TDD. Write the test, let the agent satisfy it, repeat. Works for humans, should work for agents right? Well, it works, but only on some conditions. Tests must be written before the code, or the agent will write a test to satisfy the code instead. They must encode the system intent, not just the function signature. And even then, this can lead the agent to optimize locally and miss out the bigger picture.

The better unit is to build a vertical slice end-to-end, then expose it through a CLI command that calls the entire thing. The loop is slower per cycle, but the signal is much stronger.
