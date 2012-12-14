---
layout: post
title: "Controlling a Rapberry Pi via VNC without keyboard"
date: 2012-12-14 09:45
comments: true
categories: raspberrypi vnc ssh
---
I don't have a USB keyboard, so my only option for controlling my Raspberry Pi is via SSH. That turned out to work quite well, since the customized image of Debian provided by Raspberry Pi ([2012-10-28-wheezy-raspbian.img](http://www.raspberrypi.org/downloads)) already has ssh enabled by default. It suffices to discover the IP address that was assigned by the router, and connect :-)

(By the way, for those with Mac OS, the command line instructions [here](http://elinux.org/RPi_Easy_SD_Card_Setup#Copying_an_image_to_the_SD_Card_in_Mac_OS_X_.28command_line.29)) are very nice and comprehensive.

So now on to the cool stuff... Initally I had installed TightVNC, but could not connect to the same session as being displayed via HDMI (which is console 0). I don't know whether that's possible with TightVNC, but I sort of got tired of trying. So [here are the steps to make it work](http://www.raspberrypi.org/phpBB3/viewtopic.php?p=108862#p108862), which basically consist of installing x11vnc instead of TightVNC and having your desktop manager autostart it:


<pre><code>
sudo apt-get install x11vnc
11vnc -storepasswd

# to create the autostart entry, do:

cd .config
mkdir autostart
cd autostart
nano x11vnc.desktop

# paste following text:

[Desktop Entry]
Encoding=UTF-8
Type=Application
Name=X11VNC
Comment=
Exec=x11vnc -forever -usepw -display :0 -ultrafilexfer
StartupNotify=false
Terminal=false
Hidden=false

</code></pre>

... aaand it works :-) For more details [check the original link](http://www.raspberrypi.org/phpBB3/viewtopic.php?p=108862#p108862).