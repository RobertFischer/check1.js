#!/bin/bash

# Strict Mode
set -euo pipefail
IFS=$'\n\t'

echo
echo "Ensuring we have and are up-to-date with uglify.js"
npm install uglify-js -g

echo
echo "Performing minification"
echo "    (Ignore warnings about [gs]etLocalStorage and [gs]etCookieValue)"
uglifyjs -o check1.min.js -m --stats --lint -v -- check1.js

echo
echo "Calculating size savings"
ORG_LEN=`wc -c check1.js`
NEW_LEN=`wc -c check1.min.js`
echo "Original file length: $ORG_LEN"
echo "Minified file length: $NEW_LEN"

