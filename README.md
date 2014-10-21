Introduce
=========

Mobile Web Application for Mixers

This mobile web application available at <http://introduce.solutions/app/> is designed to allow individuals to introduce themselves to one another at a mixer.

It is the first (potentially) useful application built upon the MEAN framework that was developed and documented in the hellomean - hellomean6 and hellochanel "hello world" applications. 

_simple-outh2_

While the hellomeanX applications used the simple-oauth2 package to authenticate against LinkedIn, turns out that some anomolies with LinkedIn's OAuth2 implementation end up producing erratic behaviour when using the package.  The solution was simply to stop using the package and use the Node.js https functionality to perform the same function.

_channel_

This application has been rewritten multiple times to with different strategies for doing real-time messaging.

The first strategy was to use Google Channel Service which required writing a small Java applicaiton on Google App Engine.

In an effort to get away from Google App Engine, wrote a replacement Node.js COMET (long-polling) service.

Finally, learned that Socket.IO was a common Node.js real-time engine that greatly simplified ths application.
