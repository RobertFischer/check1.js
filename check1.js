(function(global) {

  // Detect if we have local storage, or if we have to use a cookie
  var storage;
  try {
    var string = "Check1";
    storage = localStorage;
    storage.setItem(string, string);
    storage.remove(string);
  } catch(e) {
    storage = null;
  }

  // Determine our data accessor functions
  var getValue = hasLocalStorage ?
    function getLocalStorageValue(name) {
      return storage.getItem(name); // storage.getItem.bind(storage) requires IE >= 9
    }
    :
    function getCookieValue(name) {
      var result = document.cookie.match('(^|;)\\s*' + encodeURIComponent(name) + '\\s*=\\s*([^;]+)');
      return result ? decodeURIComponent(result.pop()) : result;
    }
  ;

  var setValue = hasLocalStorage ?
    function setLocalStorageValue(name, value) {
      storage.setItem(name, value);
    }
    :
    function setCookieValue(name, value) {
      document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      return value;
    }
  ;

  // Define the main function
  //   key = string name of the location where we will cache the result (prepended with "Check1\t")
  //   src = source of JS file to load if we need to check (may be `null`)
  //   resultCheck = the callback that performs the result check
  //   resultCallback = function passed the result of the script in any case
  global.Check1 = function(key, src, resultCheck, resultCallback) {
    if(!key) throw "Check1 requires a first argument, which is the key where we should store the results";
    if(!resultCheck) throw "Check1 requires a third argument, which is the callback to execute if a check is needed";
    if(!resultCallback) throw "Check1 requires a fourth argument, which is the function that will get the result";

    // Prepend "Check1\t" to the key, just for good measure
    key = "Check1\t" + key;

    // If we have a previous value, just feed that into the result callback and be done.
    var previousValue = getValue(key);
    if(previousValue) {
      resultCallback(JSON.parse(previousValue));
      return;
    }

    // Define how we do our result check
    var doResultCheck = function() {
      var result = resultCheck();
      setValue(key, JSON.stringify(result));
      resultCallback(result);
    };

    // If necessary, load JS (eg: Modernizr, mobile-detect.js) and then call resultCheck/resultCallback
    if(src) {
      // Don't worry, multiple loads of same src will use browser-cached result
      var script = document.createElement("script");
      script.src = src;
      script.onload = doResultCheck;
      document.head.appendChild(script);
    } else {
      // No JS to load; just do the result check immediately
      doResultCheck();
    }

  };

})(this);
