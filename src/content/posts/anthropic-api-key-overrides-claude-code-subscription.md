---
title: "TIL: ANTHROPIC_API_KEY silently overrides your Claude Code subscription"
pubDatetime: 2026-05-22T15:00:00.000Z
description: "If the env var is set, Claude Code uses it — even when you're logged in."
kind: note
tags: ["ai-assisted-coding", "claude-code"]
---

If `ANTHROPIC_API_KEY` is set in your environment, Claude Code routes calls through that key instead of your
OAuth subscription, even when you're logged in. This is documented and intentional, but the failure mode is
quiet. Since there's no warning, you just start burning API credits while thinking you're on the subscription plan.

I hit this while building an app with Claude Code. My app's `load_dotenv()` pulled `ANTHROPIC_API_KEY`
from `.env` into the process environment. Once that var existed, every Claude Code call in that shell billed
against the API key.

Two fixes depending on the situation:

- **If you have it exported in your shell:** `unset ANTHROPIC_API_KEY` before running Claude Code.
- **If you're building an SDK app:** namespace the variable in your `.env` (e.g. `MYAPP_ANTHROPIC_API_KEY`) and read it explicitly in code. Don't let a stray `load_dotenv()` shadow Claude Code's auth.
