Introduce
=========

Mobile Web Application for Mixers

This mobile web application available at <http://introduce.solutions/app/> is designed to allow individuals to introduce themselves to one another at a mixer.

It is the first (potentially) useful application built upon the MEAN framework that was developed and documented in the hellomean - hellomean6 and hellochanel "hello world" applications. 

_simple-outh2_

While the hellomeanX applications used the simple-oauth2 package to authenticate against LinkedIn, turns out that some anomolies with LinkedIn's OAuth2 implementation end up producing erratic behaviour when using the package.  The solution was simply to stop using the package and use the Node.js https functionality to perform the same function.

_channel_

While the hellochannel application used the Google Channel Service to do the push messaging, ended up writing a separate web service running on a separate port (channelservice.js) that consists of a simple Node.js application, i.e., no Express, no databases, etc. 

This change was primerily done because of a mistake in the use of Node.js' http feature that was causing what appeared to be random latency. Thinking the problem was withe Google Channel Service, wrote up a replacement.  Turns out that the problem persisted and ended up fixing the bug in the use of the http feature.  

Ended up sticking with channelservice.js as it gives one more control of the operation of the push messaging.
