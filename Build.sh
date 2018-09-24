#!/bin/sh

set -ex

cd "$(dirname "$0")"
coffee -c --no-header src/simple-module.coffee
