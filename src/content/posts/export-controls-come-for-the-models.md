---
title: "Export controls come for the models"
pubDatetime: 2026-06-13T09:00:00.000Z
description: "Anthropic's Claude Fable 5 was disabled to comply with a US export-control directive barring foreign nationals. As always, this hits defenders hardest; some lessons from history and my take on it."
kind: essay
draft: false
tags: ["ai-security", "ai-policy", "export-controls", "coding-agents"]
---

For those shocked by the Fable 5 suspension: a bit of history, and why I saw this coming.

Anthropic shipped Claude Fable 5 (and Mythos 5) on June 9. Three days later, on June 12,
a US government export-control directive ordered access cut off for any foreign national, _anywhere_, 
including Anthropic's own staff (have no idea how they're going to be able to comply on that front).
In order to comply, Anthropic had to disable the models entirely, naturally without a warning.
I was developing a security tool and it was cut off mid-task (although Opus is still
signing commits as if it is Fable).

This wasn't Anthropic's call, and there's precedent. 
So a little bit of history: the export of strong cryptography 
from the United States was effectively constrained for years.
It began with the Cold War, and some restrictions still exist today 
(you can read about it on 
[Wikipedia](https://en.wikipedia.org/wiki/Export_of_cryptography_from_the_United_States)). 
We're watching the same machinery, this time pointed at AI models.

I'll admit a bias: I was (perhaps a bit too much) in awe of Fable 5,
and how it methodically assisted me with secure architecture that Opus 4.8 
and Codex 5.5 struggled with. Its security capabilities are amazing; losing access stung.

Ironically, the stated trigger was a reported jailbreak. Anthropic says 
it only surfaced a handful of already-known vulnerabilities. 

But my problem is the criterion: banning a model by the nationality 
of whoever might use it is a blunt instrument, and it hits defenders hardest.
We are already starting to see the consequences of "vibe coding" 
and of attackers leveraging AI, and adoption of this tech isn't even widespread yet.

As defenders of an internet that powers a lot of the economy and our 
communication these days, we need all the advanced tools we can get. 
I don't have a solution other than the one I've been advocating:
invest in [model and harness diversity](/notes/my-current-stack/). And I hope the rest of the
world wakes up.
