#!/bin/bash

npm install uglify-js -g
uglifyjs -o check1.min.js -m --stats --lint -v -- check1.js
