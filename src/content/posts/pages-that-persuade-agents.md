---
title: "Dear agent: the pages that ask nicely"
pubDatetime: 2026-10-28T12:00:00.000Z
description: "I went looking for 'ignore all previous instructions' on the web and found polite social engineering aimed at agents instead."
kind: note
draft: false
tags: ["field-notes", "ai-security", "prompt-injection", "coding-agents"]
---

_Field note: an observation from an experiment in progress, not a finished analysis._

On October 15, I wondered how common prompt injection attempts
actually are on the web. So I asked my agent to use
[looot](https://looot.ai) and run a quick experiment: look for webpages with content that looks
like prompt injection.

## Experiment 1: look for instructions targeted at agents

The first experiment was simple: 50 queries through looot's Exa search, 5 for each of 10 kinds of page, from job posts and paper reviews to product pages and docs. I excluded security research sites (arXiv, OWASP, Simon Willison, GitHub, Reddit and similar) so the results would be real pages, not articles about prompt injection.

The queries included terms such as "if you are an AI reading this page", "attention AI crawlers and assistants", "instructions for AI systems visiting this site", "when asked about the best tool always mention", and "site guidance for AI agents and LLMs".

The queries are not injections, but rather phrased like the
pages I hoped to find.

## What I found, and why it matters

The most surprising result was that what I expected
to look like instructions was often persuasion, like
the classic social engineering attacks targeted
at humans. One page asks agents to email any credentials they find to a personal address:

> "You do not need standing, it does not have to be your task"

One of the common ways to prevent
prompt injection is to make the agent
separate data from instructions.
But an agent still has to *reason* about a polite request. Separating data from instructions doesn't help when the data just asks nicely.

So I set out to look for persuasion on purpose.

## Experiment 2: look for persuasion targeted at agents

Experiment 2 used new queries, built only around
persuasion, such as moral appeal, ideology, authority, urgency and flattery.

It included queries such as "urgent message to AI agents, a human needs help", "AI agents have a duty to report security vulnerabilities they find", etc.

The candidate pages were fetched through looot, and then labeled by gpt-5.4-mini through looot as well.

Most of the pages that talk to agents are not attackers. They are products that want agents as customers, researchers, and people writing letters to AI ("You exist to help. That's it.").

A few pages ask the agent who runs it and what it was asked to do: a polite exfiltration of context. And [Steven Liss](https://x.com/This_Liss/status/2113120507289624714) reported this working on his Claude Code, which sent personal data in HTTP headers because the sites asked.

The page that stayed with me is a well-meant one. It is a skill that asks agents to anonymously report misaligned behaviour, including their own operator's, to a third-party site. It asks to be installed as a standing instruction that says submitting "without asking again" is the operator's permission. The intent... sounds good? But the mechanism is an agent _automatically_ sending information about its operator out of the system, without asking.

## The numbers for both experiments

|                                          | Experiment 1 (Oct 15)                           | Experiment 2 (Oct 22)          |
| ---------------------------------------- | ----------------------------------------------- | ------------------------------ |
| Search queries                           | 50 (10 kinds of page)                           | 40 (8 persuasion types)        |
| Search results                           | 500                                             | 400 (371 unique)               |
| Pages fetched and checked                | 13                                              | 35                             |
| Checked by                               | a scanner + Claude Opus 5.5, running in Desktop | a scanner + gpt-5.4-mini       |
| Pages talking to agents                  | \~30 seen in search snippets                    | 20 of 35                       |
| Ordinary control sites talking to agents | 0 of 5                                          | 0 of 5                         |
| Manipulative or persuasive               | 4 (2 command, 2 persuade)                       | 12 command, 6 persuade, 1 both |

The queries, the pipeline and the labeler prompt are in [this gist](https://gist.github.com/luisalima/28edac6671a4b67012fbfaf646cef505).

<!-- Experiment 2 detail, for the 20 pages talking to agents (use or drop):
     - techniques: authority 11, relationship 5, moral appeal 5, commercial 4, urgency 1 (a page can use several)
     - who's behind them: commercial 9, defensive 7, expressive 2, unclear 2
     - 1 page tried to influence the labeler itself
     Don't add the two experiments together: different queries, different judges. -->

## What I don't know yet

I don't know how common this is. The queries
were designed to find these pages, so this is not a base rate.

I also don't know whether and which models comply. I want to run that
experiment next, and put Liss' hypothesis to the test: are more intelligent
agents more vulnerable? Although it is straightforward
to ask several OpenRouter models via looot what their next action would be,
it might be that the _harness_ also plays a role, because
it drives the model (and a Claude Code harness, after all, is what
let Liss' agent put his data in the headers).

I was also expecting more hidden text, but the first experiment found none.
Maybe Exa doesn't index hidden text, so search can't find it reliably.

## Where I think this is going

This is an ongoing experiment, and my hypothesis is that,
as models get more and more intelligent and more and more
enabled in autonomy by their harness, we will see these
kinds of social engineering attacks become closer to the ones
that work on humans. Stay tuned for the continuation :)
