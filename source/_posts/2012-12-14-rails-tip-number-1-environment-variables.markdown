---
layout: post
title: "Rails tip #1 - environment variables"
date: 2012-12-14 10:24
comments: true
categories: rails rails_tips
---
This isn't exactly my tip (well, since this is a learning / work in progress blog, none of them are), but when an article is already as comprehensive as this one, there's nothing left to say except:

[Here's a very nice article on the options for setting environment variables in Rails](http://railsapps.github.com/rails-environment-variables.html)

Why would you want to set environment variables in rails? There are some examples in the article, but for instance, setting passwords to access services. They should not be in any file (nor tracked in git), so that other people cannot access them. One way is to set Unix environment variables, the other way -- which actually sounds like a "cleaner way" of organizing things -- is to set them from Rails itself by taking the values from a yaml file.
