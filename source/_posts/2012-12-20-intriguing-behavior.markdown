---
layout: post
title: "Intriguing behavior: validating presence of a boolean field"
date: 2012-12-20 20:15
comments: true
categories: rails testing intriguing
---

So, for those who don't know it (I just discovered about it), if you want to validate the presence of a boolean field, you can't do it with validates_presence_of.

So, suppose that we have a model like

<pre><code>
# == Schema Information
# Table name: Bla
#  test       :boolean
class Bla < ActiveRecord::Base
  attr_accessible :test
</code></pre>


For example, if I had used validates_presence_of :test in the example above, it would have failed miserably because false.blank? is true -- so in practice, we could have never set bla.test to false, since it would make the validation fail ([more details here](http://apidock.com/rails/ActiveModel/Validations/ClassMethods/validates_presence_of)).

So I set out to try this out:

<pre><code>
validates_inclusion_of :test, :in => [true, false]
</code></pre>

and test it like this:
<pre><code>
it {should_not allow_value("bla").for(:completed)}
</code></pre>

and it still failed miserably.

Now I was puzzled... So I tried this one out:

{% gist 4348179 bla.rb %}

I was thinking that at some point the test attribute would be set to "bla", but since the field is a boolean, inserting other values will always evaluate to false. So we don't have to go to all this trouble: this way we can validate the presence, but we never need to validate whether the value itself is valid. More about this [here](http://stackoverflow.com/questions/5170008/rails-validating-inclusion-of-a-boolean-fails-tests/5171074#5171074). Living and learning!
