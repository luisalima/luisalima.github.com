---
title: "I no longer plan, I get grilled instead"
pubDatetime: 2026-05-22T13:30:00.000Z
description: "Matt Pocock's 'grill me' skill replaced plan mode in my workflow."
kind: note
tags: ["ai-assisted-coding", "coding-agents", "plan", "grill-me"]
---

I always ask my AI to be [contrarian and honest](/notes/accuracy-over-agreement/). My usual process to get there is to brainstorm back and forth with the AI, until I'm happy and we jump together to plan mode. 

However, most models are over-eager to please and they propose way too much in an open brainstorming session. A better way that I found to try to reach the shared understanding without increasing the scope too creatively was [Matt Pocock's "grill me" trick that he also ships as a skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md).

"Grill me" does essentially what it says and it forces the LLM to explore all the potential branches in a way that is much more structured.

After being "grilled", I ask the assistant to write the conclusions of our session to a file, and then I edit that file directly by hand (like a barbarian!) to consolidate, course-correct and reason through the main code modules. I don't call plan mode anymore — this file becomes the plan.
