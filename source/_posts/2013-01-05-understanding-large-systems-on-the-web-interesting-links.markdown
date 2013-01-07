---
layout: post
title: "Understanding large systems on the web - interesting links"
date: 2013-01-05 15:58
comments: true
categories: web nosql sql mobile
---

Back when I was in undergrad, web programming was something considered to be a tad boring, unchallenging and chaotic. How things have changed during my PhD :-) I assume, largely thanks to Google and Apple, the advent of smartphones and mobile. But I digress, yet again.

[Martin Fowler](http://martinfowler.com/), the father of software patterns, has [an amazing introduction to nosql](http://martinfowler.com/articles/nosql-intro.pdf) (or, rather, "polyglot persistence") which should remind us of why we have nosql systems: to facilitate horizontal scaling. That means that so many startups that are using nosql just because it's fashionable should probably just use a traditional sql model and follow the "Premature optimization is the root of all evil" motto by Knuth.

And now jumping from backend to frontend, he also has another amazing overview of [developing software for multiple mobile devices](http://martinfowler.com/articles/multiMobile/). The most obvious downside to writing multiple native apps is the cost of building several copies of the same application and then, especially, maintaining them. In my case, I started learning iOS programming some time ago, but didn't pursue it actively at the time, and am now wondering whether learning multiple platforms is a good idea, or whether I should go with a cross-platform toolkit. The overview has a list of the problems of going down that road. The solution is again... mobile web apps:

"Don't try to make a web app work like a native app. This is the path to the Uncanny Valley. Instead focus on making it a usable web app, building on the familiarity of how the web works on devices."

In the end, the slideshow provides a nice algorithmic way to determine whether you should go the native route, the mobile web app route, or something in between, depending on whether the app is part of your core product or just a side channel to reach more customers. Highly recommended!


