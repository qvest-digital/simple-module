#!/bin/sh

set -ex

cd "$(dirname "$0")"
coffee -c -m -o dist/ --no-header src/simple-module.coffee
