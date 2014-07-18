Introduce
=========

Mobile Web Application for Mixers

This mobile web application available at <http://introduce.solutions> is designed to allow individuals to introduce themselves to one another at a mixer.

It is the first (potentially) useful application built upon the MEAN framework that was developed and documented in the hellomean - hellomean6 and hellochanel "hello world" applications. 

_simple-outh2_

While the hellomeanX applications used the simple-oauth2 package to authenticate against LinkedIn, turns out that some anomolies with LinkedIn's OAuth2 implementation end up producing erratic behaviour when using the package.  The solution was simply to stop using the package and use the Node.js https functionality to perform the same function.
