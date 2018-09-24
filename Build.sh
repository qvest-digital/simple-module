#!/bin/sh

set -ex

cd "$(dirname "$0")"
coffee -c -b --no-header src/simple-module.coffee
sed --posix \
    -e "s!{{#if amdModuleId}}'{{amdModuleId}}', {{/if}}!simple-module!g" \
    -e 's!{{{amdDependencies.wrapped}}}!"jquery"!g' \
    -e 's!{{{amdDependencies.params}}}!a0!g' \
    -e "s!{{#if globalAlias}}root\['{{{globalAlias}}}'\] = {{else}}{{#if objectToExport}}\\(.*\\){{/if}}{{/if}}!\\1!g" \
    -e 's!{{{cjsDependencies.wrapped}}}!require("jquery")!g' \
    -e 's!{{{globalDependencies.normal}}}!jQuery!g' \
    -e 's!{{dependencies}}!$!g' \
    -e 's!{{{objectToExport}}}!SimpleModule!g' \
    -e '/{{{code}}}/r /dev/stdin' \
    -e '/{{/d' \
    build/templates/umd.hbs <src/simple-module.js >dist/simple-module.js
