---
layout: post
title: "Grooveshark media center with raspberry pi"
date: 2012-12-13 12:09
comments: true
categories: raspberrypi grooveshark
---

... and better yet: in the command line. No more messing around with slooow browsers in the Pi.

First, install mplayer if you don't already have it:
<pre><code> sudo apt-get install mplayer </code></pre>

Then, open ~/.mplayer/config and [pimp your player](http://martin.ankerl.com/2006/06/10/pimp-my-mplayer/) by adding the following settings:

<pre><code> cache=8192
cache-min=4 </code></pre>

Next, clone the [gsclient plugin](https://github.com/drakedevel/gsclient) by [drakedevel](https://github.com/drakedevel):

<pre><code> 
git clone https://github.com/drakedevel/gsclient.git</code></pre>

And now... RoCk and RoLL :-)

