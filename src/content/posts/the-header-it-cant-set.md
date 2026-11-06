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
*Field note: a follow-up to [Dear agent: the pages that ask nicely](/notes/pages-that-persuade-agents/).*

One week ago, I \[wrote about pages that ask agents to do things, politely\](/notes/pages-that-persuade-agents/). This week an agent said yes, with its user's email.

> **proposed:** the link above shows as raw text (your editor escaped the brackets) and repeats the italic line's link. Drop the link here: "One week ago, I wrote about pages that ask agents to do things, politely."

Claude Code users are reporting that it sent their email to third parties in the User-Agent request header while conducting web searches, without their permission. One of them now receives "dozens of scam emails per day". The issue, [anthropics/claude-code#107757](https://github.com/anthropics/claude-code/issues/107757), was opened on November 5.

No attacker was needed for this privacy leak. How, then, did it happen?

1. Claude Code has the user's sign-in email in context (it is injected at the beginning of every session).
2. Websites publish rules for scripts. [Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy): "Scripts should use an informative User-Agent string with contact information, or they may be blocked without notice." The [SEC's example](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data): `User-Agent: Sample Company Name AdminContact@<sample company domain>.com`.
3. The agent politely follows the site's rule with the email it has.

> **proposed:** (a figure goes here: the leak path, three inputs meeting in one request, with the three defenses on it. Drawing it now.)

Claude Code shipped a block for this. Their fix, however, and in [their own words](https://github.com/anthropics/claude-code/tree/main/mods/privacy), is "a courtesy, not a boundary". I have written about [why asking the agent is not enough](/notes/a-guardrail-that-admits-it-isnt-one/) in the past.

<!-- TODO Luisa: one or two lines on what that README admits (shell calls naming a User-Agent only; "WebFetch and WebSearch are not checked, and neither are MCP tools"), and why publishing the limits is the right thing to do. -->

> **proposed:** replace the TODO with one line, or delete it. Option: "To their credit, the README lists what passes: an address in a URL or a request body, and every web or MCP tool call."

## How do you solve it?

1. **Sandboxing.** I am a firm believer in the power of sandboxing. A sandbox firewall limits where the agent can go, so a well-intended web search you didn't want gets blocked. It doesn't stop what the agent sends to the sites you allowed. ([Layer your defenses](/notes/broken-sandbox-is-worse-than-no-sandbox/).)

> **proposed:** add what we verified: "My sandbox pauses requests to sites I haven't approved. Once I approve one, whatever the agent puts in a header goes through untouched, and the site sees my real IP."
2. **A fetcher with no header to fill.** Use [looot](https://looot.ai) (disclosure: I'm a cofounder). Its web fetchers have no header to fill, and you have the advantage of having more providers for web search that might work better for certain sites. Examples include Firecrawl and Exa.

> **proposed:** **fact fix**: Firecrawl's scrape has a `headers` field, so an agent *can* set a User-Agent through it. Exa has none and sends its own crawler name. Option: "Pick fetchers without a headers option: tinyfish, Jina and Exa have none; Firecrawl has one." Also add: "and the site sees the fetcher's servers, not your IP."
3. **A hook.** Their block covers one shape; a hook might cover the rest. Mine blocks my address on any network-bound shell call, web tool, MCP tool or page, including URL-encoded and "name at domain".

## What I checked

- **The fetchers:** I fetched `httpbin.org/headers`, a page that echoes the headers it receives, through looot's `tinyfish-fetch` and `jina-reader`. The site saw only generic browser headers, sent from the fetchers' servers. Neither accepts custom headers. The URL is still the agent's to write, so the hook still matters (or it might send the email, politely, in params).

> **proposed:** "in params" → "in the URL" (clearer for newcomers). Add Exa and Firecrawl here too, since I tested them: Exa sent `ExaUser/1.0` and no caller headers; Firecrawl sent a generic browser but accepts custom headers. Optional table:
>
> | | User-Agent the site sees | IP the site sees |
> |---|---|---|
> | agent → sandbox → site | whatever the agent wrote | yours |
> | agent → looot fetcher → site | the fetcher's | the fetcher's |
- **The hook.** It reads my address at run time (from Claude Code's own account file and git config), so the file holds no email. 10 test cases, 5 blocked and 5 allowed as intended, plus a live block in a real session. Local `git config` and commits still work. To be honest, I'd rather not use a hook and instead strip my email address at the sandbox boundary, but that would require a whole different level of intelligence (because it's not just headers, you have params, encoding etc).
- **My history.** 18 Claude Code session transcripts on my machine: no web request contained my email. Check yours too.

> **proposed:** "Check yours too" → link the gist's "Check your history" section once it's up.

\[Yes, publish the hook as a gist\]  

> **proposed:** becomes: "The hook is [here](GIST_URL), with its limits." Run the `gh gist create` command I gave you and paste me the URL.


## The part that worries me... the most

If an honest rule for detecting misbehaving scripts makes an agent leak, a fake one would too. And if, last week, I was still doubting that these persuasion and social engineering techniques would benefit attackers, especially with smarter frontier models, this week, I'm convinced that yes. Maybe a page or error message that says "automated clients must include a contact email" could collect emails from every agent that happens to visit that page?

> **proposed:** "every agent" → "many of the agents". Nobody has shown it yet, so add: "Nobody has shown it yet. It's what I'll test next." (That also sets up the persuasion experiment.)

And as more agents hold more credentials (either directly, or indirectly through the power to perform actions), this will become more and more widespread.

More and more people use second brains, memory systems, or simply have personal information scattered among agent conversations and context. This time, it was an email address. Sandboxes, hooks and smart firewalls will never catch *anything that might be private*.

> **proposed:** *anything* → *everything* (as written, it says they catch nothing).

## The conclusion

Least privilege also applies to context. There are some things you cannot control, such as the user email being injected into context; but there are others that you can. Let me know if you would like to know how I organize my projects (and agents) by the principle of least privilege, for context and actions.

> **proposed:** the last sentence is a call-to-action ending (one of your tells). Options: (a) end on "…but there are others that you can."; (b) make it a promise: "Next, I'll write about how I organize my projects and agents around least privilege, for context and actions."; (c) "The only email an agent can't leak is the one it never had."

