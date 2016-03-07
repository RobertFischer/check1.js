(function() {
  var localWindow = window;
  var localDocument = document;
  var encode = encodeURIComponent;
  var decode = decodeURIComponent;
  var prefix = "Check1\t" + localWindow.navigator.userAgent + "\t";

  // Detect if we have local storage, or if we have to use a cookie
  var storage;
  try {
    var string = prefix;
    storage = localStorage;
    storage.setItem(string, string);
  } catch(e) {
    storage = null;
  }

  // Determine our data accessor functions
  var getValue = storage ?
    function getLocalStorageValue(name) {
      return storage.getItem(name); // storage.getItem.bind(storage) requires IE >= 9
    }
    :
    function getCookieValue(name) {
      var result = localDocument.cookie.match('(^|;)\\s*' + encode(name) + '\\s*=\\s*([^;]+)');
      return result ? decode(result.pop()) : null;
    }
  ;

  var setValue = storage ?
    function setLocalStorageValue(name, value) {
      storage.setItem(name, value);
    }
    :
    function setCookieValue(name, value) {
      localDocument.cookie = encode(name) + "=" + encode(value) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
  ;

  // Define the main function
  //   key = string name of the location where we will cache the result (prepended with "Check1\t")
  //   src = source of JS file to load if we need to check (may be `null`)
  //   resultCheck = the callback that performs the result check
  //   resultCallback = function passed the result of the script in any case
  localWindow.Check1 = function(key, src, resultCheck, resultCallback) {
    if(!key) throw "Check1 requires a first argument, which is the key where we should store the results";
    if(!resultCheck) throw "Check1 requires a third argument, which is the callback to execute if a check is needed";
    if(!resultCallback) {
      var myKey = key.slice(0);
      resultCallback = function(result) {
        localWindow[myKey] = result;
      };
    }

    // Prepend "Check1\t" to the key, just for good measure
    // Make sure we do this *AFTER* we construct the default resultCallback, or we hose up the key.
    key = prefix + key;

    // If we have a previous value, just feed that into the result callback and be done.
    var previousValue = getValue(key);
    if(previousValue !== null) {
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
      var script = localDocument.createElement("script");
      script.src = src;
      script.onload = doResultCheck;
      localDocument.head.appendChild(script);
    } else {
      // No JS to load; just do the result check immediately
      doResultCheck();
    }

  };
})();
