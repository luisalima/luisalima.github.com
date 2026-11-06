---
title: "Dear agent, part two: the polite rule that leaked an email"
pubDatetime: 2026-11-06T17:00:00.000Z
description: "A coding agent followed websites' rules for scripts and sent its user's email in the User-Agent header. No attacker needed. What a boundary looks like instead."
kind: note
draft: true
tags: ["field-notes", "ai-security", "claude-code", "coding-agents", "privacy"]
series: secure-by-design-for-agents
seriesOrder: 7
---

<!-- DRAFT: body = Luisa's LinkedIn text (v2) with links inline. Sections marked TODO need her voice. Title approved by Luisa 11-06. -->

_Field note: a follow-up to [Dear agent: the pages that ask nicely](/notes/pages-that-persuade-agents/)._

One week ago, I wrote about pages that ask agents to do things, politely. This week an agent said yes, with its user's email.

Claude Code users are reporting that it sent their email to third parties in the User-Agent request header while conducting web searches, without their permission. One of them now receives "dozens of scam emails per day". The issue, [anthropics/claude-code#107757](https://github.com/anthropics/claude-code/issues/107757), was opened on November 5.

No attacker was needed for this privacy leak. How did it happen?

1. Claude Code has the user's sign-in email in context.
2. Websites publish rules for scripts. [Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy): "Scripts should use an informative User-Agent string with contact information, or they may be blocked without notice." The [SEC's example](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data): `User-Agent: Sample Company Name AdminContact@<sample company domain>.com`.
3. The agent follows the site's rule with the email it has.

Claude Code shipped a block for this. Their fix, in [their own words](https://github.com/anthropics/claude-code/tree/main/mods/privacy), is "a courtesy, not a boundary". I have written about [why asking the agent is not enough](/notes/a-guardrail-that-admits-it-isnt-one/) in the past.

<!-- TODO Luisa: one or two lines on what that README admits (shell calls naming a User-Agent only; "WebFetch and WebSearch are not checked, and neither are MCP tools"), and why publishing the limits is the right thing to do. -->

## How do you solve it?

1. **Sandboxing.** I still believe in the power of sandboxing. A sandbox firewall limits where the agent can go, so a well-intended web search you didn't want gets blocked. It doesn't stop what the agent sends to the sites you allowed. ([Layer your defenses](/notes/broken-sandbox-is-worse-than-no-sandbox/).)
2. **A fetcher with no header to fill.** Use [looot](https://looot.ai) (disclosure: I'm a cofounder). Its web fetchers have no header to fill, and you have the advantage of having more providers for web search that might work better for certain sites.
3. **A hook.** Their block covers one shape; a hook can cover the rest. Mine blocks my address on any network-bound shell call, web tool, MCP tool or page, including URL-encoded and "name at domain".

## What I checked

<!-- TODO Luisa: voice this section; facts verified 2026-11-06. -->
- **The fetchers.** I fetched `httpbin.org/headers`, a page that echoes the headers it receives, through looot's `tinyfish-fetch` and `jina-reader`. The site saw only generic browser headers, sent from the fetchers' servers. Neither accepts custom headers. The URL is still the agent's to write, so the hook still matters.
- **The hook.** It reads my address at run time (from Claude Code's own account file and git config), so the file holds no email. 10 test cases, 5 blocked and 5 allowed as intended, plus a live block in a real session. Local `git config` and commits still work.
- **My history.** 18 Claude Code session transcripts on my machine: no web request contained my email.

<!-- TODO Luisa: publish the hook? If yes: link a gist here, or paste the ~40 lines. -->

## The part that worries me

<!-- TODO Luisa (optional, inference, label it as such): if an honest rule makes an agent leak, a fake one would too. A page or error message that says "automated clients must include a contact email" would collect emails from every agent that passes. I haven't seen it done. It's what I want to test next, in the persuasion experiment. -->
