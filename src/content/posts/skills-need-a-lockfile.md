---
title: "Skills are just text files. So where's the lockfile?"
pubDatetime: 2026-06-19T08:00:00.000Z
description: "Skill distribution is a mess: no manifest, no version pinning, no lockfile. A skill is a prompt injected into a privileged agent, so it's a supply-chain problem. The boring fix already exists."
kind: essay
draft: false
tags: ["coding-agents", "developer-tooling", "ai-security", "oss"]
---

I already wrote about [how skills are the new agents](/essays/skills-are-the-new-agents/).
And I wrote how the distribution of skills is a mess right now, and the skills universe is 
fragmented.

I was wondering whether there was a package manager for skills, so I searched
and found lots of new proposals on package managers for skills.

The result of my search felt a lot like this...

![xkcd 927, "Standards"](https://imgs.xkcd.com/comics/standards.png)

_[xkcd 927](https://xkcd.com/927/)_

However, in the middle of my search, I found [this post about pixi-skills](https://pavel.pink/blog/pixi-skills/).
The key idea is: agent skills are just markdown files, software has solved
distributing text files, so use a package manager instead of inventing a new one?

The author is right, but pixi means adopting conda in every project, 
and most folks outside of Data Science don't use Conda. 

But if skills are just packages, then what's the *smallest*  thing that **already works**?

## The gap, and the security problem

If you've used agent skills, you've probably installed them the imperative way,
something like `npx skills add owner/repo`. It grabs whatever's on `main` 
right now and copies it into `.claude/skills/`, `.codex/skills`, whatever. 
Or maybe you just git-cloned a skill repo, and then installed it directly. Or maybe you used a cli like Vercel's.

These approaches are quick, but they leave four 
important holes that every package ecosystem closed years ago:

- **No manifest.** Nothing records which skills a project depends on, so there's no "clone and restore."
- **No version pinning.** You're tracking a branch head. Upstream edits change your agent's behavior silently.
- **No lockfile or integrity.** Even a pinned tag can be force-moved.
- **No CI story.** No way to assert "the skills in this build are exactly the ones we reviewed."

That second one matters more than it looks. A skill is a 
*prompt injected into a privileged agent*. This goes beyond reproducibility:
it is a huge supply-chain problem, and skills are not just used by developers.

## What the landscape provides already is not enough

[vercel-labs/skills](https://github.com/vercel-labs/skills) has the ecosystem 
and a directory, but no versioning model. [paks](https://github.com/stakpak/paks)
has the versioning model but builds a whole new registry to get it.
This means that the tool with the reach has no pinning, and the tool with the
pinning has no reach. There are also a gazillion approaches similar to paks.

## The boring answer

We don't need (and don't want!!!) a new file or a new registry. 

`package.json` already sits in lots of repos, tolerates extra fields, 
and npm already pins git dependencies to exact commit SHAs in a lockfile.

That means that the only missing piece is trivial: copy the `SKILL.md` directories into the right agent folders.

So I built [**skills-lock**](https://github.com/luisalima/skills-lock) 
to prove it. It has zero dependencies and supports any git repo as a registry:

```json
{
  "skills": {
    "frontend-design": "anthropics/skills",
    "code-review": "acme/skills#v2.1.0"
  },
  "skillsConfig": { "agents": ["claude-code", "cursor"] }
}
```

```console
$ npx skills-lock install
+ frontend-design  anthropics/skills @ 575462609294  → claude-code, cursor
✓ installed, skills-lock.json written
```

You can commit the lockfile, then teammates and CI run `skills-lock install --frozen` 
and get byte-identical skills, verified by content hash, or a hard failure. 

## Where it's going

skills-lock is on [npm](https://www.npmjs.com/package/skills-lock) and works
today, but it's a proposal more than a product. 

The endgame I actually want isn't another competing tool (that's the [xkcd 927](https://xkcd.com/927/)
trap) It's to have this workflow (manifest in `package.json`, a lockfile, `--frozen` in CI)
getting absorbed into the tool (or tools) that already have the ecosystem. 

I've [opened that conversation](https://github.com/vercel-labs/skills/issues/165) with the maintainers
at Vercel.

If you think skills should be pinnable like every other dependency, come argue about 
it there. And if you want to try it: `npx skills-lock` or `npm i -g skills-lock` to go global.



