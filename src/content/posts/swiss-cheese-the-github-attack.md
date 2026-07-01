---
title: "The nx breach in swiss cheese slices: when every layer fails at once"
pubDatetime: 2026-05-22T12:00:00.000Z
description: "A four-party supply-chain chain that ended in GitHub's internal repos was a swiss cheese event. Every layer had a hole. Where does the fix live?"
kind: essay
tags: ["ai-security", "supply-chain", "sandbox", "security", "dev-stack"]
---

On May 18, a malicious version of the Nx Console VS Code extension was 
live on the Microsoft marketplace for somewhere between 11 and 18 minutes. 

By May 19, GitHub had announced unauthorised access to internal repositories. 
By May 20, GitHub's CISO had named that particular extension as the entry point. 
The attacker claims ~3,800 internal repos; GitHub calls that "directionally 
consistent" with its investigation, which is still open.

What makes this incident unusually teachable isn't its impressive reach, but
rather that you can see every layer that failed, and each one is owned by a different party.
It is a classic swiss cheese problem, and I believe we will see more and more
of these.

## The chain and its repercussions

The story starts before the nx extension. The same threat group that compromised the
extension, TeamPCP, had earlier compromised the TanStack project.
In that attack, they scraped an nx contributor's GitHub token. 
Same campaign also hit OpenAI, Mistral, and Grafana. 
So the weapon that breached GitHub was actually forged two supply-chain hops upstream, 
in an attack on a project unrelated to either nx or GitHub.

With that token, the attacker posed as a legitimate Nx maintainer, pushed 
an orphan commit to `nrwl/nx`, and published version 18.95.0 to the VS
Code Marketplace at 12:30 UTC. nx's CEO has since confirmed publicly that
the upload happened *without manual approval from other admins*. 
Their newly introduced fix in the wake of this attack is to require two admins to approve any release.

The malicious build then propagated to every machine
running auto-update, with no gate and no cooldown between publish and distribution.
The extension ran on the GitHub employee's machine, scraped its resident credentials,
and whatever those credentials reached was exfiltrated.

![The nx → GitHub breach as a swiss-cheese chain, by party. Each slice is a different party's layer with its own hole; the dashed layer is inference.](/diagrams/nx-github-swiss-cheese.svg)

## What's confirmed and what is mine

The chain above is sourced from GitHub's blog and [CISA's alert](https://www.cisa.gov/news-events/alerts/2026/05/28/supply-chain-compromises-impact-nx-console-and-github-repositories), the [nrwl GHSA advisory](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w), [Narwhal's post-incident report](https://nx.dev/blog/nx-console-v18-95-0-postmortem), and the [Sophos](https://www.sophos.com/en-us/blog/github-internal-repositories-breached) / [OX](https://www.ox.security/blog/teampcp-strikes-again-how-a-trojan-vs-code-extension-brought-down-github/) / [Rescana](https://www.rescana.com/post/github-internal-repositories-breached-via-compromised-nx-console-vs-code-extension-2026-supply-chain-cybersecurity-incid) write-ups.

Two things in the diagram are not stated by any of them, and I want to flag them.

One: I've drawn "creds on a single employee machine reached internal repos" 
as a failure of access design. It's possible that the credentials had
legitimately broad reach because of the employee's role, but I wonder
whether the token's scope was too broad. The true question is:
how much should a single workstation be able to reach?

Two: the 3,800 figure is the attacker's claim, but GitHub calls
directionally consistent. 

## The Swiss cheese is the point

James Reason's model says that complex systems don't fail from just a single hole,
but rather, when independent layers have holes that transiently line up. 

Most cybersecurity disclosures expose one layer.

This incident is a good learning lesson rare because all of the layers are visible at once, 
and each is owned by a different party who could close it independently of all the others:

- The contributor's token was scrapeable and long-lived;
- nx's publishing process accepted single-credential releases;
- The Marketplace accepted the push and propagated it instantly;
- The user's machine ran auto-update with a credential surface that mattered;
- The organisation's access design allowed one workstation to reach a lot.

If we were to knock out any single layer, the chain would have broken:

- nx removing single-credential publish breaks it. 
- Marketplace requiring signed provenance breaks it. 
- A cooldown window in the Marketplace publishing process breaks it.
- Short-lived scoped credentials on the machine break it. 
- Reducing standing blast radius breaks it.

So there is no "the" fix.

## Who actually owns the fix

The first reaction to incidents like this is *"just turn off auto-update"*
(also known as not using _@latest_ in packages).

But this pushes the problem onto the party with the least leverage.

The controls that would have *prevented* the malicious artifact 
from ever being trusted live with the publisher 
(multi-party release approval, which nx did, post-incident) 
and with the platform (signed builds, provenance attestation, 
scoped/short-lived publish tokens, OIDC publishing instead of
long-lived tokens). These are the brakes.

The control the individual developer owns is
narrower: reduce what's on the machine to lose. 
Scope credentials, expire them, make them useless off-box, 
don't hold standing production access. That's the seatbelt.

Both matter, and I've written about it: security is something that
we do in depth, and there is no single measure that will allow our systems to be safer.
But framing the seatbelt as the fix is
how we end up with years of "developers should be
more careful" while the same incident repeats with different logos. 

## And the link back

I wrote that [a broken sandbox is worse than no sandbox](/notes/broken-sandbox-is-worse-than-no-sandbox/),
and a trust boundary you don't control can't be your only one. 

This is the same argument with a different cast: a publishing pipeline 
you don't control, on a marketplace you don't control, on a machine 
that auto-executes both. The dev workstation should always be inherently low-trust; 
its job is to run untrusted things.

The question cannot be _just_ about defending the workstation harder. 
We own the responsibility at all levels of the stack. Let's request it.
