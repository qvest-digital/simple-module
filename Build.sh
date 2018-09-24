#!/bin/sh

set -ex

cd "$(dirname "$0")"
coffee -c -b --no-header src/simple-module.coffee
