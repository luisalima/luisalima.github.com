---
layout: post
title: "Disabling nagging logs in rails"
date: 2012-12-13 10:20
comments: true
categories: rails, webrick, 
---

Once upon a time, I was trying to do some meaningful debugging in rails with
<pre><code> logger.debug </pre></code>

and I was being particularly nagged by these annoying messages from Webrick:
<pre><code> WARN Could not determine content-length of response body. Set content-length of the response or set Response#chunked = true [closed]</pre></code>

The way to solve this? I am using 'thin' instead of Webrick as a development server (yeah, I know that there are [patches to solve this in Webrick](https://bugs.ruby-lang.org/attachments/2300/204_304_keep_alive.patch) but I decided to go a bit aggressive instead).

And another thing that nagged me were the asset pipeline messages with the gets for the css, js, images, etc. So one way to shut Sprockets up is given [here](http://stackoverflow.com/questions/6312448/how-to-disable-logging-of-asset-pipeline-sprockets-messages-in-rails-3-1), and just for the record:

<pre><code>
	# place this code in config/initializers/quiet_assets.rb
	if Rails.env.development?
  Rails.application.assets.logger = Logger.new('/dev/null')
  Rails::Rack::Logger.class_eval do
    def call_with_quiet_assets(env)
      previous_level = Rails.logger.level
      Rails.logger.level = Logger::ERROR if env['PATH_INFO'] =~ %r{^/assets/}
      call_without_quiet_assets(env)
    ensure
      Rails.logger.level = previous_level
    end
    alias_method_chain :call, :quiet_assets
  end
end
</pre></code>

Ahhhhh now I can actually see **meaningful** logs in my development log. *whew!*
