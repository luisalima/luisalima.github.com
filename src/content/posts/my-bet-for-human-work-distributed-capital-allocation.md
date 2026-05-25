---
title: "My bet for human work: distributed allocation"
pubDatetime: 2026-05-25T12:30:00.000Z
description: "After automation, the so-called 'human residue' will no longer be management, but rather deciding, at the task level, where to point agent spend."
kind: essay
tags: ["ai-agents", "coding-agents", "ai-autonomy", "human-in-the-loop", "ai-governance"]
---

I changed my mind on what comes "after" AI automation. I used to think it would be (agent) management, but now I think it'll be **distributed allocation** and **safe conditions**.

This is a thinking snapshot on the (current) evolution of AI, from the perspective of a software person, argued out loud against Claude — which brought up some compelling counter-arguments, a few of which are quoted below.

## Starting from "After Automation"

It started when I read [Dan Shipper's article, "After Automation"](https://every.to/p/after-automation). Shipper's argument is that AI progress creates more work for humans, not less.

In short, his thesis is that AI commoditizes yesterday's competence → output floods → sameness → demand for difference → demand for experts.

_"More work for humans, not less."_

At the core of his thesis, is a frame/framer formulation. Essentially, a benchmark freezes a problem into a measurable frame; the model climbs it; the human is the framer who supplies the next frame. The AI model catches the frame, never the framer.

Shipper shows the frame exists and currently comes from a human, but I didn't see a compelling argument for why framing needs _more_ humans, rather than _less_. "There's always a frame above" doesn't establish value or headcount.

## Why I agree with Shipper, intuitively

Intuitively, I 100% agree with Shipper.

I've argued before that [there is no one-size-fits-all with AI](https://luisalima.com/notes/early-is-when-defaults-get-set/), just like there is no one-size-fits-all with humans, and products, and that is why companies hire software engineers to adapt to their own unique situations, they don't just buy SaaS and call it a day. More software meant more need for software engineers, which created more frameworks, more tools, which created a need for more software engineers, even before AI.

We can argue that SaaS and higher-level programming languages and frameworks made expert work cheaper. Ruby on Rails, React.js, and all of those web frameworks made it much faster to create webapps. That is a simple pre-AI example of what is said in the article:

_"This is the paradox we started with: Making expert work cheaper does not simply replace experts. It creates more situations where expert judgment is needed."_

And after AI, I feel like I have _more_ work rather than less, especially since December 2025, which is when there was a big leap in the capability of coding agents. You'd think that we, as technical people, would have less work, because the AI would just take care of it, but the fact is that finishing tasks faster increases the space of exploration for the next tasks, and we suddenly can consider projects and tasks that we would have never considered before. And with more AI, we are creating more knowledge, more papers, more studies, more technical explorations, that we have to learn and to keep up with.

Like Shipper argues, _"And some use AI to do bigger, more interesting, work than they could've done without it."_

## The test case: Mythos

Mythos is the strongest test case I know for Shipper's thesis, and I think it cuts against him on the agency point.

A model that autonomously discovers thousands of previously unknown vulnerabilities, at a scale no previous model demonstrated, is not just "yesterday's competence made cheap". Shipper's argument needs all model output to be commoditized recombination; Mythos finding a 27-year-old OpenBSD bug looks like frame-climbing producing something the framer didn't already know.

This is the point Claude pressed hardest when I argued it through (working from after its training cutoff, since Mythos postdates it) — and I think it's right.

Even having watched the Anthropic Engineering team talk about Mythos, and how it independently got to its first exploit during a researcher's lunch, my instinct was still "you need the framer, because you still need to steer the model."

I don't think that instinct survives the details. The scaffold prompt is, supposedly, essentially "Please find a security vulnerability in this program", which is far less framing than Shipper's GDPval or Senior Engineer examples. Almost all the vulnerabilities were found without human intervention after that initial prompt, and engineers with no formal security training got complete working exploits overnight.

## Going beyond the agency talk

So suppose the framer's edge is indeed thin. Suppose agents get true "agency", and are not merely executing goals handed to them by humans.

Do we need more, or fewer, humans doing the work in that scenario? One can argue we get "agent managers" and no longer need humans managing agents.

I think the argument is missing a point, and that point is capital. In such a world (which, given how bad humans are at estimating exponential progress, may be closer than we think), agents can manage themselves, and produce anything we (and they) can imagine.

But agents, in general, don't have money (I know that some people give a budget to their OpenClaw, but I have yet to see that happen for a company).

So I thought that maybe the durable human residue is **capital allocation at the task level**: deciding where to point the agent, whether the spend is economically sound, and what the expected value of the run is given an uncertain hit rate.

Take Mythos. A single OpenBSD-class finding cost ~$50 on the *winning* run, but ~$20k across the thousand runs that produced it, and Anthropic notes the cheap number "only makes sense with full hindsight." There is no way to predict in advance which run hits.

**So this becomes an investment-thesis problem, not a steering problem.** You're sizing a portfolio of bets with uncertain payoff. And this thesis survives full autonomy: even a perfectly autonomous agent has no reason of its own to bet a large sum on a specific task, especially when the payoff profile is closer to venture capital than to a bond.

You could argue this applies to Mythos-class vulnerability research, and that software creation is more predictable. I don't think so, for a few reasons:

- Two technical ones. Even with humans, software creation is probabilistic, not deterministic. We spent decades trying to predict how long software projects take and how much they cost. It's 2026 and we are still not good at it, which is why Agile and its relatives still exist. And even if we suddenly had an accurate way to predict what a piece of software costs to produce, we have no accurate way to predict what it costs to point Mythos or another model at it and fix every newfound vulnerability before it ships.
- One economic one. No one has a crystal ball, so we don't know whether the bet on a particular feature, bug, or product will pay off. There is just no way to know in advance.

## The objection I had to answer: wouldn't this mean fewer humans?

Here is the strongest objection Claude pressed me with. Capital allocation is the most _concentration-prone_ function in an economy. A few people at a fund move billions. So if the human residue collapses to "decide where to point capital," that's a job for thousands, not the millions of jobs eventually automated.

That would make the refined thesis true while contradicting Shipper's headline: more _valuable_ work for _fewer_ humans. It's a real objection, and I had to answer it.

## My answer: allocation lives at the task altitude

The objection assumes allocation at the VC altitude, which is top of the hierarchy. But the Mythos economics don't live there, they live at the task altitude.

A human knows better whether a refactor on a supporting system is worth $1k of agent spend. And more importantly, someone has to _own_ the call on that $1k, and make a compelling case for it (to another human). These decisions happen hundreds of times a day inside a single product organization, and they cannot be centralized, because the context needed to make each call is, rightly, distributed.

Right now, many jobs are already agent-like: software engineers get their task board from product managers, who get theirs from business folks, who get theirs from the aggregate of end customers. Some humans in the chain carry financial decisions ("should we hire an engineer to own this API?"), but we don't usually think in terms of cost _per task_. I believe we now will.

You could argue models will get better and cheaper, making this argument moot. If that happens (and I'm not sure it will — better models will always cost more, and we will always want access to the better ones), then we'll be choosing what to spend _time_ on instead, which is essentially the same problem but in a different currency.

So the C-level decision now distributes.

## But couldn't you automate the per-task decision?

The per-task allocation decision _looks_ automatable. "Is this run worth $2k given EV" is a calculation, and if we have the _entire_ context of the _entire_ company encoded in such a way that agents can find it, we can solve the problem. So in theory you could build a meta-agent that does the allocation triage.

But that now runs into **ownership**. An agent can _score_ a bet; it cannot _own the consequence_ of whether, and how much, the task matters here, now, to this particular business. Framer-not-frame, but now on the allocation layer. The scoring may be cheap, but the ownership of being wrong is not.

## There is more to it than money

I still find Shipper's argument compelling, perhaps because I'm a human and not an agent. And since I work at the intersection of product, software, and security, I'm heavily discounting, in this piece, the part where the human creates the conditions for the agent to work safely and accurately. Anthropic had to hire contractors to validate Mythos findings, because fewer than 1% get patched and humans are the bottleneck. The reason Mythos is gated is that the safe-conditions layer doesn't yet exist at the scale the capability demands. But I'm biased, since I work in the field, so here I'll just say I hope we reach an equilibrium, and save that argument for another day.

## How we'll know? Watch who holds the budget

This is a thought exercise, a braindump off a very well-written article. But we may already be seeing early signs, though I'd read them carefully, because the reporting is thin: a single Verge/Information sourcing chain, only days old, so I would still treat it as a single data point. [Microsoft has reportedly begun cancelling most of its direct Claude Code licenses](https://finance.yahoo.com/sectors/technology/articles/microsoft-reports-exposing-ai-real-165636598.html). Uber's CTO told The Information the company burned through its entire 2026 AI coding tools budget in four months.

This is the natural consequence of optimizing for the wrong metric. [Token maxxing](https://en.wikipedia.org/wiki/Token_maxxing) culture has been on the rise, and [when a measure becomes a target, it ceases to be a good measure](https://en.wikipedia.org/wiki/Goodhart%27s_law). The token maxxing entry already carries this critique, that workers maximize whatever metric management rewards, inflating cost and burnout without real output.

## Distributed ownership of capital allocation

Maybe the prescription can be the bet I opened with: the scarce, durable, human job is _distributed ownership of the spend_. The decision of what's worth pointing an agent at, owned at the task level by the person with the context to make it, and accountable for being wrong.

That's the frame that might survive the best agents of all.

And the clearest way we'll know whether the prediction is right is simple: watch whether agent-spend budget authority pushes _down_ to individual contributors, or whether it stays gated at the top.
