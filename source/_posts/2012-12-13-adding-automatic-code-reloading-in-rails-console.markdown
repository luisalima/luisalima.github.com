---
layout: post
title: "Adding automatic code reloading to rails console"
date: 2012-12-13 10:56
comments: true
categories: rails console
---

So I have no idea why the rails console in development mode doesn't already do this, since the whole idea of the console in development mode is for us to mess around and test random stuff in development mode, right? Anyway, I got inspired and helped by [Jkfill](http://jkfill.com/) with his post on [Automatic Code Reloading in Rails Console](http://jkfill.com/2012/12/08/automatic-code-reloading-in-rails-console), so here goes, more for my records than yours since you should follow the instructions in his post. I am using Rails 3.2.9, so I had to copy the code from the [reload! method in the rails console code](https://github.com/rails/rails/blob/master/railties/lib/rails/console/app.rb#L25), which is not exactly the best practice, but it's just for dev mode and it works :-)

<pre><code> if defined?(IRB::Context) && !defined?(Rails::Server) && Rails.env.development?

  class IRB::Context
    def evaluate_with_reloading(line, line_no)

    	ActionDispatch::Reloader.cleanup!
      ActionDispatch::Reloader.prepare!
      evaluate_without_reloading(line, line_no)
    end
    alias_method_chain :evaluate, :reloading
  end

  puts "=> IRB code reloading enabled"
end
</pre></code>

In the meanwhile, shortly browsed the code at [the Rails gihub project](https://github.com/rails) and it's really a nice way to learn more about rails... must do it more often.
