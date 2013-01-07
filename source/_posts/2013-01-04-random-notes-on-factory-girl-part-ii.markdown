---
layout: post
title: "Random notes on Factory Girl Part II"
date: 2013-01-04 20:25
comments: true
categories: factory_girl testing rspec rails
---

More random/tutorialish aspects of my usage of the FactoryGirl gem. I do advise you to read their [getting started guide](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md#associations), it helps a lot. This is more of a reference of the things I found most useful. If you have any questions/corrections/observations, let me know in the comments.

FactoryGirl and Polymorphic named associations
----------------------------------------------

If you have polymorphic associations with different names, here's how to go about it in factories:

<pre><code> factory :category, aliases: [:category_one, :category_two] </code></pre>

There are other approaches to this problem [here](http://stackoverflow.com/questions/7747945/factorygirl-and-polymorphic-associations), but I find this one to be the simplest and so far it hasn't gotten me into trouble (perhaps yet :-) ).

Attributes_for
--------------

This is probably very obvious, but I find it useful to use attributes_for from FactoryGirl to build the valid attributes for use in controller specs.

<pre><code> def valid_attributes
    FactoryGirl.attributes_for(:my_model)
	end
</code></pre>

One thing that is useful to know is that attributes_for ignores associations, and thus does not include attributes that are related to associations even if you have an association in the factory. [Here is a post at stackoverflow](http://stackoverflow.com/questions/10290286/factorygirl-why-does-attributes-for-omit-some-attributes) that provides you with the foreign keys in the attributes if you need them.

Has_and_belongs_to_many associations
------------------------------------

I'm just adding this for my own reference. It's in the [FactoryGirl getting started wiki](https://github.com/thoughtbot/factory_girl/wiki/Usage).

<pre><code> FactoryGirl.define do
  factory :person do
    first_name { 'James' }
    books {
      Array(5..10).sample.times.map do
        FactoryGirl.create(:book) # optionally add traits: FactoryGirl.create(:book, :book_description)
      end
    }
  end
end
</code></pre>

There is more in FactoryGirl associations [here](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md#associations).

DRYing up: Traits
-----------------

I just discovered traits, which are ways to add state to a factory (read: create factories whose attributes have different values without having to go through aliases). I am [shamelessly copying Thoughtbot's example](http://robots.thoughtbot.com/post/23673635798/remove-duplication-with-factorygirls-traits) because I think it's the clearest one to have here for your reference:

<pre><code> FactoryGirl.define do
  factory :todo_item do
    name 'Pick up a gallon of milk'

    trait :completed do
      complete true
    end

    trait :not_completed do
      complete false
    end
  end
end
</code></pre>

DRYing up: inheritance
----------------------

Something that I wasn't making much use of -- you can nest factories, which allows you to create multiple factories for the same class without repeating common attributes:

<pre><code>
factory :user do
	name "testing"

  factory :super_user do
    super_powers true
  end
end
</code></pre>

Tracking factories
------------------

I followed the advice [here](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md#activesupport-instrumentation) to track factories. I think it's useful to know how factories are being used.

If you want to go really in depth...
------------------------------------

You have a [very nice post on code reading of the factorygirl gem here](http://www.arailsdemo.com/posts/39). You can even learn something about how to do cool stuff in ruby/rails like:

<pre><code> def set(attribute, value)
    @instance.send(:"#{attribute}=", value)
  end
</code></pre>

And that's all, folks (for now...)!