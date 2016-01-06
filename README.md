Check1.js
============

Check Once and Be Done
------------------------

If you want to check something about the client, you should only perform that check once.  If you're loading Modernizr or some other library to perform that check,
you should only load those scripts if you need to. Enter *Check1*.

Here's the classic example: you want to check if the client is mobile in order to prevent the mobile device from loading a bunch of additional JPEGs and performing polling,
which is going to slow down the page load and piss people off as their batteries drain away. You have a library for detecting if you're on a mobile device, but the library
itself is non-trivial (eg: the minified `Detect-Mobile` library is still 15k).

Use *Check1*, and you will only load `Detect-Mobile` the very first time. Every other access to the page will use the cached value. This script minifies to about 1000
characters, so you are having significant savings in JavaScript processing load over bringing down `Detect-Mobile` every time. Even better, you're not having to actually
execute the detection code each time the page loads: you're just loading the data from the browser's memory forever after that initial detection attempt.

Compatible with IE 7 and above, and everything else.

How It Works
--------------

You pass in a key, a URL to a JS file, the code to perform the check, and what to do with the result. The library determines if there is a value under that key
by looking into `localStorage` (if available) and into `document.cookies` if not. If that value was previously set, it goes right into the result handling callback.
If not, it tacks a new script tag into the head, and when that script tag is done loading, it will call back to the check and the result handling callback.  In
either case, the result is stashed back into the available storage for future reference.

You can see it in action in `demo.html`. Set breakpoints to your heart's content.

Synopsis
---------

```html
<html>
  <head>
    <script src="check1.js"></script>
    <script>
      var isMobile;
      Check1(
        "isMobile",
        "https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.3.1/mobile-detect.js",
        function() {
          var md = new MobileDetect(window.navigator.userAgent);
          return !!md.mobile();
        },
        function(result) {
          isMobile = result;
        }
      );
    </script>  <!-- IMPORTANT: Needs to be its own script tag. -->
    ...
```

Usage
--------

```javascript
Check1(
  key, // string name of the location where we will cache the result (prepended with "Check1\t")
  src, // string url of JS file to load if we need to check (may be `null` if you don't want to load anything)
  resultCheck, // the no-argument function that performs the result check, run after the JS file is loaded
  resultCallback // the one-argument function passed the result of the check, whether or not is was performed on this page load
)
```

The result of `resultCheck()` (hereafter, `result`) will be cached into the key `"Check1\t" + key`, either in `localStorage` or `document.cookies`.
The `resultCallback(result)` call is guaranteed to be completed before any subsequent `<script>` tags are executed.  It may or may not
be executed before the `Check1(...)` call resolves.

<sub>(Yes, I'm [releasing Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony#posts). It'll be okay, I promise. I put Zalgo in a cage.)</sub>
