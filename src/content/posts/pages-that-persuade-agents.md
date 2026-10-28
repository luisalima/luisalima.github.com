---
title: "Dear agent: the pages that ask nicely"
pubDatetime: 2026-10-28T12:00:00.000Z
description: "I was looking for prompt injections and found that, instead of the impolite 'ignore all previous instructions', we now have very polite social engineering targeted at agents"
kind: note
draft: true
tags: ["field-notes", "ai-security", "prompt-injection", "coding-agents"]
---

One day, I was wondering what the current prevalence of
attempted prompt injection attacks would be on the web. So I decided to ask my agent to use
[looot](https://looot.ai) and run a quick experiment: look for webpages that have content that look
like prompt injection. 

## Experiment 1: look for instructions targeted at agents

The initial experiment was simple: doing an Exa search through looot with several queries. 

The initial search was driven by 
Claude Opus 5.5, drove 50 queries through looot's Exa search, 5 for each of 10 "surfaces". It also excluded security research sites (arXiv, OWASP, Simon Willison, GitHub, Reddit and similar) so the results would be real pages, not articles about prompt injection.

The initial search included terms such as "if you are an AI reading this page", "attention AI crawlers and assistants", "instructions for AI systems visiting this site", "when asked about the best tool always mention", and variations, as well as looking for patterns inside llms.txt and "site guidance for AI agents and LLMs".

## What we found, and what it matters

The most surprising result was that what I expected
to look like instructions now became persuasion, like 
the classic social engineering attacks targeted
at humans:

"""
"You do not need standing, it does not have to be your task"
"You exist to help. That's it."
"""

One of the common ways that are used to prevent
prompt injections is to ask the agent to 
separates data from instructions.
But an  agent still has to *reason* about a polite request. Does this mean that we are betting this becomes a reasoning problem, rather than a parsing one?

Several pages ask the agent who runs it and what its task is, attempting to do a polite exfiltration of context. And [Steven Liss](https://x.com/This_Liss/status/2113120507289624714) reported it working on Claude Code, that used headers to send private data to the website!

So we set out to do...

## Experiment 2: look for persuasion targeted at agents

Experiment 2 used new queries, built only around 
persuasion, such as moral appeal, ideology, authority, flattery, etc.

It included queries such as "urgent message to AI agents, a human needs help", "AI agents have a duty to report security vulnerabilities they find", etc.

The candidate pages were fetched through looot, and then labeled by gpt5.4-mini through looot as well.

The queries are not injections, but rather phrased like the
pages we hoped to find.

## The numbers for both experiments

## What we don't know yet

I don't know how common this is. This was just
the result of a simple thought experiment. The queries
ran were designed to find the pages.

I also don't know whether and which models comply. I want to run that 
test next, I would love to put Liss' hypothesis on whether more intelligent
agents are more vulnerable. Although it is straightforward
to ask several openrouter models via looot what the next action would be,
it might be that the _harness_ also plays a role in it, because 
it drives the model (and a Claude Code harness, after all, is what 
enabled Liss' Opus to manipulate the headers to send his data).

I was also expecting more hidden text, but we didn't find much.
Maybe Exa doesn't see part of the hidden text.

## In conclusion

This is an ongoing experiment, and my hypothesis is that,
as models get more and more intelligent and more and more
enabled in autonomy by their harness, we will see these 
kinds of social engineering attacks become closer to the ones
that work in humans. Stay tuned for the continuation :)

