Check1.js
============

Use Case #1: Check Once and Be Done
------------------------------------

If you want to check something about the client, you should only perform that check once.  If you're loading Modernizr or some other library to perform that check,
you should only load those scripts a single time for a given user agent, and save
yourself the overhead every other time. Enter *Check1*.

Here's the classic example: you want to check if the client is mobile in order to prevent the mobile device from loading a bunch of additional JPEGs and performing polling.
You have a library for detecting if you're on a mobile device, but the library
itself is non-trivial (eg: the minified `Detect-Mobile.js` library is still 36k).

Use *Check1*, and you will only load that library the very first time a given browser
hits the host. Every other access to the page will use the cached value.
This script minifies to less than 1k in size, so you are having significant savings in JavaScript processing load compared to bringing down and parsing that library every
time. Even better, you're not having to actually
execute the detection code each time the page loads: you're just loading the data from the browser's memory forever after that initial detection attempt.

Use Case #2: One-And-Done JS/API Calls
---------------------------------------

Another great use for *Check1* is performing one-time API calls. If you have data that
very rarely changes, you can use *Check1* to cache the result of that API call for you,
preventing unnecessary round-trips.

Say, for instance, that you want to ping an API whenever there is a unique visitor
to your website, and they get back a unique user token so that you can track their
subsequent API calls. You can have *Check1* make the call to get that unique user token,
and then it will cache it forever for this user. Different users of the browsers or
dropping into a privacy-enhanced mode will end up fetching their own API keys, which
is exactly the behavior you want!

Or say that you have monthly deals or seasonal offerings. You can have *Check1* retrieve
those and generate the relevant DOM content. That DOM content will then be cached
forever. To enable an automatic refresh, add the month or the season into the key
you provide *Check1*.  New month or new season? New key.
New key means a new fetch of the data. This is exactly the behavior you want.

<sup>(Don't worry, your old values will be purged from the user's cache
whenever their browser needs to make space.)</sup>

Compatibility
-----------------

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


*Usage with Explicit Variable (Check1 Classic)*
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

*Usage with Implicit Variable (New Check1)*
```html
<html>
  <head>
    <script src="check1.js"></script>
    <script>
      Check1(
        "isMobile",
        "https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.3.1/mobile-detect.js",
        function() {
          var md = new MobileDetect(window.navigator.userAgent);
          return !!md.mobile();
        }
      );
    </script>  <!-- IMPORTANT: Needs to be its own script tag. -->
    <!-- All subsequent JS can use "Check1.isMobile" to access the result -->
    ...
```
<sub>Available as of 1.1.0</sub>

Usage
--------

```javascript
Check1(
  key, // string name of the location where we will cache the result (prepended with "Check1\t")
  src, // string url of JS file to load if we need to check (may be `null` if you don't want to load anything)
  resultCheck, // the no-argument function that performs the result check, run after the JS file is loaded
  resultCallback // the optional one-argument function passed the result of the check, whether or not is was performed on this page load
)
```

The result of `resultCheck()` (hereafter, `result`) will be cached into the key `"Check1\t" + user_agent + "\t" + key`, either in `localStorage` or `document.cookies`.
The `resultCallback(result)` call is guaranteed to be completed before any subsequent `<script>` tags are executed.  It may or may not
be executed before the `Check1(...)` call resolves.

<sub>(Yes, I'm [releasing Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony#posts). It'll be okay, I promise. I put Zalgo in a cage.)</sub>

If you do not pass in a `resultCallback`, the default callback is equivalent to this:

```javascript
function(result) {
  window[key] = result;
}
```
