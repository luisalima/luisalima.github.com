---
layout: post
title: "How I test part II - testing models"
date: 2012-12-19 10:17
comments: true
categories: rails testing TDD rails_tips rspec
---

Testing models
--------------

From [rails guides](http://guides.rubyonrails.org/testing.html):

"Ideally, you would like to include a test for everything which could possibly break. It’s a good practice to have at least one test for each of your validations and at least one test for every method in your model."

Which leads me to...

Why I use shoulda
-----------------

I think that the best thing is just to take a peek at [The shoulda cheat sheets](http://cheat.errtheblog.com/s/rspec_shoulda/).

You actually get a guide of what to test by looking at the cheat sheet! It's too bad that it's not up to date (actually I think that the whole site is not up to date -- even the gem doesn't work anymore, which I think is too bad :-( )

Furthermore, it's great for lazy people and it's definitely easier on the eyes. Just check the following example:

{% gist 4339197 shoulda_model.rb %}

Convinced? ;-)

What I test exactly with shoulda
--------------------------------

I go through the whole list of shoulda macros for models, and I just use and abuse them. Since the cheat sheet is not up to date, I created a new one (just for models for now) at:

{% gist 4339490 shoulda_cheat_model.rb %}

Yes, it's a bit tedious. But (1) you make sure that you are actually testing all these details, which is extremely useful when you are constantly refactoring your code, and (2) it's not that slow with the multiple cursors of Sublime Text 2. You just need to have a scaffold.

What I test without shoulda
---------------------------

Apart from model methods, is there that much to test without shoulda? I test:

* Any model methods, extensively
* Callbacks, extremely extensively
* Some validations - but just to make sure I coded them right. See more of this perspective in [Testing model validations in rspec the short and sweet way](http://www.christopherbloom.com/2011/07/12/testing-model-validations-in-rspec-the-short-and-sweet-way/)

... and for now, that's about it.


Regarding generating fake data
------------------------------

Like I mentioned before, I do use FactoryGirl extensively. Maybe that means that [my models are complicated](http://blog.steveklabnik.com/posts/2012-07-14-why-i-don-t-like-factory_girl)? I don't know, but for now, I am sort of using good sense and stuff. Let's see what happens. I do use [Faker](http://faker.rubyforge.org) as well. Come to think about it, will do a post on that eventually.

Random issues in testing models
-------------------------------

When everything seems to be absolutely correct in the models and in the tests and you are still getting unexplainable errors, do restart guard. I already spent several hours messing around with the tests because guard didn't refresh the models. [There are automatic solutions](http://stackoverflow.com/questions/5855587/spork-is-really-great-but-how-can-i-get-it-to-refresh-validations-and-other-cod), but I didn't feel like hacking away the spork/guard configurations again... yet.

Random resources
----------------

* [Everyday Rails: How I learned to test my Rails applications, Part 3: Model specs](http://everydayrails.com/2012/03/19/testing-series-rspec-models-factory-girl.html) - this has a very nice overview of the actual steps required to test models. Now I just cheat using shoulda, but it's very nice and useful to get a 

* [Testing model validations in rspec the short and sweet way](http://www.christopherbloom.com/2011/07/12/testing-model-validations-in-rspec-the-short-and-sweet-way/) - it's a bit outdated, but describes how to test validations in a short way.

***

Again, as I already mentioned, I am a beginner to rails and, consequently, in testing rails, so I might be doing/saying terribly wrong things. Any input is very much appreciated :-)


