#!/bin/sh

set -ex

cd "$(dirname "$0")"
coffee -c spec/simple-module-spec.coffee
mocha --require spec/helpers.js spec/simple-module-spec.js
rm spec/simple-module-spec.js
