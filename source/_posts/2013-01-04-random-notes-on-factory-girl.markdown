---
layout: post
title: "Random pseudo-tutorialish notes on Factory Girl, part I"
date: 2013-01-04 18:39
comments: true
categories: factory_girl testing rspec rails
---

The guys at Thoughtbot do an excellent job. I especially love shoulda and high_voltage. I have a love/hate relationship with factory_girl, so I decided to write this post trying to detail some of the ways I've been using it. Maybe it will help someone. Hope it does!

First of all, what is a factory and what do you need it for? Factories are a (healthier) alternative to fixtures, and fixtures are simply a "fixed state" for models, used as baseline for tests. In Rails, fixtures get automatically loaded into the test database before tests are run, and you define them in a YAML file. However, they can become awkward pretty easily, so Factories were created -- frameworks designed to allow a quick creation of fully featured objects for testing.

And now you ask, why don't we just create the object directly before each test? Think required attributes and associations -- if your model has 10 attributes and 5 different associations you might want to have somewhere where you can create valid instances of that model upfront and then reuse them.

So, we have (somewhat) established what factories are for. [Just beware of the downsides of using factories](http://blog.steveklabnik.com/posts/2012-07-14-why-i-don-t-like-factory_girl) (quoting the blog in the link, which is highly recommended):
"A big feature of tests is to give you feedback on your code. Tests and code have a symbiotic relationship. Your tests inform your code. If a test is complicated, your code is complicated. Ultimately, because tests are a client of your code, you can see how easy or hard your code's interfaces are."

Yup, I feel your pain, bro. My latest project has tons of models, polymorphic interfaces, STI's, etc. Ultimately, flexibility creates complexity, and it's better to avoid extra features to keep simplicity. But I digress.

So, how do we use these lil' bastards? :-)

Configuration
-------------

The [Getting started](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md) guide provides what you need. Except... I don't think it's that clear that if you are using Rspec, those lines

<pre><code>
	require 'factory_girl'
	FactoryGirl.find_definitions
</code></pre>

go in the spec_helper.rb file. More precisely, *FactoryGirl.find_definitions* goes inside the *RSpec.configure do |config|* block.

*But:* if you are using Spork, you need to reload Factory definitions at each run, otherwise you get a "factory not registered" error. So, place the following inside the *Spork.each_run do* block:

<pre><code>
	Spork.each_run do
	# ....
		FactoryGirl.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
	  FactoryGirl.find_definitions
	# etc...
</code></pre>

There you go! Everything nicely configured :-) Also, you can use FactoryGirl in rails console! Just use the code [in this post](http://blog.thefrontiergroup.com.au/2011/03/reloading-factory-girl-factories-in-the-rails-3-console/), which I'll shamelessly copy here for posterity and for my own reference:

<pre><code>
    ActionDispatch::Callbacks.after do
      # Reload the factories
      return unless (Rails.env.development? || Rails.env.test?)

      unless FactoryGirl.factories.blank? # first init will load factories, this should only run on subsequent reloads
        FactoryGirl.factories.clear
        FactoryGirl.find_definitions
      end
    end
</code></pre>

You can also just run this code directly in the console. If you do have sequences defined, you'll need to add the following extra:

<pre><code>
FactoryGirl.factories.clear
FactoryGirl.sequences.clear
FactoryGirl.find_definitions
</code></pre>

(and if you are using [traits](http://robots.thoughtbot.com/post/23673635798/remove-duplication-with-factorygirls-traits), apparently you need to add FactoryGirl.traits.clear as well).

In unit testing
---------------

So first things first... You can have a file for testing factories but I'd rather have the test for the validity of the factory in the model test file itself -- this to avoid incurring errors when you are focusing on testing a particular model, all because your factory was ill-defined. So go ahead and test the factory itself:

<pre><code>
	it "has a valid factory" do
		m = FactoryGirl.build(:my_model)
		m.should be_valid
	end
</code></pre>

What do we do if this goes wrong and we can't sort out the error? Go to the console, write

<pre><code>
m = FactoryGirl.build(:my_model)
m.valid?  # duh, it'll be false
m.save    # just to trigger all validations callbacks etc that we might have
m.errors
</code></pre>

And now go ahead and complete your factory with the necessary information. Simple enough, right? The syntax for defining factories is explained pretty well [in the starting guide](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md) so I won't go to the trouble, except for the case when we are using Faker.

With Faker
----------

Faker is a cool gem for... you guessed it, generating fake data. And here's how you do it:

<pre><code>
  factory :company do
    name { Faker::Company.name }
    phone {Faker::PhoneNumber.cell_phone}
  end
</code></pre>

Yup, just a normal block, not too bad.

Sequences
---------

Sequences are used for attributes that must be unique, such as email addresses. You can define sequences "outside" of the factory definition, or inside as a block:

<pre><code>
  sequence :email do |n|
    "test#{n}@example.com"
  end

	factory :user do
		email
    password "password"
    password_confirmation "password"
    phone {Faker::PhoneNumber.cell_phone}
	end
</code></pre>

is the same as:

<pre><code>
	factory :user do
		sequence(:email) { |n| "test#{n}@example.com"}
    password "password"
    password_confirmation "password"
    phone {Faker::PhoneNumber.cell_phone}
	end
</code></pre>

Associations
------------

Associations in factories are simply created by adding the factory name for the association in the other factory block. For example, if my user has_one location:

<pre><code>
	factory :user do
		sequence(:email) { |n| "test#{n}@example.com"}
    password "password"
    password_confirmation "password"
    phone {Faker::PhoneNumber.cell_phone}
    location   # ta-da!
	end
</code></pre>

More detail about associations with FactoryGirl [here](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md#associations).

More about this tomorrow!
