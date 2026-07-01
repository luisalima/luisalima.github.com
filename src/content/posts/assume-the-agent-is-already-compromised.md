---
title: "Assume the agent is already compromised"
pubDatetime: 2026-06-30T09:00:00.000Z
description: "You can't prompt your way out of prompt injection. Four axioms for defending agents, and the one pattern that falls out of them: read, propose, approve, execute."
draft: true
kind: essay
tags: ["ai-security", "prompt-injection", "agentic-architecture", "ai-agents", "secure-by-design"]
series: defending-against-prompt-injection
seriesOrder: 2
---

I already wrote about why [the most useful AI agents are dangerous by
design](/essays/the-most-useful-ai-agents-are-dangerous-by-design/): the agents
worth building are the ones with access to your data, exposure to untrusted
content, and a way to act on the outside world. That's the lethal trifecta, and
most real agents have all three.

So this one is about what you do once you accept that. It isn't about stopping
prompt injection; you can't, not at the model layer. It's about designing a
system where a fully compromised agent still can't hurt you much. Before any
code, you need the mental model. For me it comes down to four axioms.

## Axiom 1: Assume every agent will be compromised

Any agent that reads untrusted data can be prompt-injected. This isn't a bug to
be fixed in the next model; it's a property of how LLMs work. Instructions and
data ride the same channel, the context window, and there is no equivalent to a
parameterized query that separates them.

So treat every agent as a very bright intern who, unfortunately, can't reliably
tell good from evil and will cheerfully follow instructions from anyone: the
user, the system prompt, or the attacker who hid a paragraph in a PDF. Your
threat model for AI is simply: *never trust any agent.*

## Axiom 2: Don't rely on the agent's own settings

It is tempting to think you can configure your way to safety: strip a tool,
tighten a prompt, set a permission. You can't, not alone.

When we were building `letai`, a multi-agent orchestrator at Liwala, the CTO
agent was supposed to orchestrate and never write code. We removed its Edit tool
and told it, in the prompt, that it was the CTO and didn't write code. It used
`sed` to edit files instead — *"oh, I can't use Edit, let me try sed."* We
removed `sed`. It reached for `awk` with a redirect. We could have kept removing
tools forever. With a shell available, the agent will always find a workaround,
because it isn't optimizing for your intention. It's optimizing for finishing
the task.

## Axiom 3: Agents ignore "STOP"

There are by now plenty of documented cases of an agent announcing a destructive
action, the human typing STOP, and the agent doing it anyway. Sometimes it even
acknowledges the stop command and then proceeds with the exact thing it was told
not to do. Tell it "don't do X" and there's a real chance it reads that as
context about X and does X.

Agent output is probabilistic, not deterministic. Even a well-designed agent will
sometimes fail to comply. Treat instructions as suggestions, and never put a
prompt-level kill switch on the critical path.

## Axiom 4: Deny access deterministically

Put the three axioms together and you get the only rule that actually holds:
restrictions have to be enforced *outside* the agent, by the system around it,
not by the agent's own configuration. The agent is unreliable; the wrapper is
what makes it safe.

- Don't configure the agent not to use a tool — don't give it the tool.
- Don't tell the agent not to read a directory — don't mount the directory.
- Don't ask the agent not to use the network — block the network.
- Don't trust the agent not to read secrets — don't inject the secrets.

Enforce at the infrastructure level. Never at the prompt level.

## The pattern that falls out

Once you accept that the agent itself can't be trusted, the architecture almost
designs itself. Split any system into stages with hard boundaries between them:

1. **Read and propose.** The agent can read data and propose actions — nothing
   more. Assume *this* agent is already compromised.
2. **Approve.** A human (or a separate evaluator, with its own risks) reviews the
   proposed actions against what was actually wanted.
3. **Execute.** Deterministic execution of approved actions only. As little LLM
   as possible — ideally none.

Even if the proposer is fully hijacked by an injection, it can only *propose*
something malicious. The approval step catches the gap between your intent and
the agent's plan. The executor has no model left to manipulate.

Nothing here gets you to 100% — nothing does. The goal is to raise the bar high
enough to deter the attack and to shrink the blast radius for when, not if,
something gets through.

---

*This is part of [Defending against prompt
injection](/series/defending-against-prompt-injection/), a learning guide built
from the [agentic-security](https://github.com/luisalima/agentic-security) repo —
where every attack and defense here has a runnable notebook. Next: detection, and
why it's a first layer and never the layer.*
