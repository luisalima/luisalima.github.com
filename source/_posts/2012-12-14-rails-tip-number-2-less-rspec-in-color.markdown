---
layout: post
title: "Rails tip #2 - less Rspec in more color"
date: 2012-12-14 11:04
comments: true
categories: rails_tips rails rspec TDD testing
---
I usually have Guard running in the background with Spork, but when I'm writing tests I like to do it the old fashioned way and be able to do rspec some_test | less. The problem with that approach is that we get a monochrome version of our tests. In order to redirect the color in the pipe, edit spec_helper and add the following:

<pre><code> # spec/spec_helper.rb
Rspec.configure do |config|
	config.tty = true
	config.color_enabled = true
	# ... whatever configurations you might have here...
end
</code></pre>

And enjoy a more colorful life ;-)
