---
layout: post
title: "How I test part III: Why rspec?"
date: 2012-12-20 16:48
comments: true
categories: rspec testing rails TDD
---

Why RSpec? That is a good question. My main reason for using RSpec right now is because I want to have a testing + documentation + TODO bundle, all in one, like a shampoo:

* testing -- ok, RSpec does make things a tad more complicated for testing. I believe that testing actually makes you learn more about what you code, and RSpec, being a DSL, can make things esoteric enough that sometimes you don't know exactly what you're testing (I confess that I like Test::Unit more because it's simpler for developers to read -- assert that this gives this result). But, on the other hand, you have shoulda! :-)
* documentation -- the exact same thing that makes testing a bit more esoteric, makes documentation a piece of cake. You want to know how something works? Just read the tests. And RSpec does make that side of testing much clearer.
* TODO -- yup, that's right. If you have features that you want to implement later on, just add a "pending" spec with the description of what you want to do. Of course that you can do that in Test::Unit as well, but it's not as beautiful and immediate as in RSpec.

Of course that I'm really just beginning and I might change my mind eventually. [Even the creator of Rails argues against RSPec](http://www.rubyinside.com/dhh-offended-by-rspec-debate-4610.html), and there are quite a few arguments against it (if you missed the link, here's an [excellent blog post on that](http://objectreload.com/articles/2010/09/thoughts-on-testing-part-1.html)).

By the way, I'm abiding by this rule from the last post:

"- Keep things flat — deeply nested contexts are ugly as they hinder readability of your test cases. Split your tests up into different files if they’re getting too long."

I was trying to make things DRY in the tests, and then I thought... why bother, exactly? It's better if they are more readable, for the sake of documentation as stated above. Amen, brothers.

Why not Cucumber for request specs?
-----------------------------------

All the reasons are in this [excellent post](http://epimetrics.com/entries/3129).
