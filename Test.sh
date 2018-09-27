#!/bin/sh

set -ex

cd "$(dirname "$0")"
coffee -c spec/simple-module-spec.coffee
(
	export NODE_PATH=$PWD/external
	cd external/xml-name-validator
	nodejs scripts/generate-grammar.js \
	    <lib/grammar.pegjs >lib/generated-parser.js
)
mocha --require spec/helpers.js spec/simple-module-spec.js
rm spec/simple-module-spec.js
