Check1.js
============

Check Once and Be Done
------------------------

If you want to check something about the client, you should only perform that check once.  If you're loading Modernizr or some other library to perform that check,
you should only load those scripts if you need to. Enter *Check1*.

Here's the classic example: you want to check if the client is mobile in order to prevent the mobile device from loading a bunch of additional JPEGs and performing polling,
which is going to slow down the page load and piss people off as their batteries drain away. You have a library for detecting if you're on a mobile device, but the library
itself is non-trivial (eg: the minified `Detect-Mobile` library is still 15k).

Use *Check1*, and you will only load `Detect-Mobile` the very first time. Every other access to the page will use the cached value. This script minifies does to less than 1k,
so you are having significant savings.
