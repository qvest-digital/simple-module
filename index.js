'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var fs = require('fs');
var path = require('path');

var handlebars = require('handlebars');
var objectMerge = require('object-merge');
var is = require('annois');
var zip = require('annozip');


var UMD = function UMD(code, options) {
    if(!code) {
        throw new Error('Missing code to convert!');
    }

    EventEmitter.call(this);
    this.code = code;
    this.options = options || {};

    this.template = this.loadTemplate(this.options.template);
};

inherits(UMD, EventEmitter);

UMD.prototype.loadTemplate = function loadTemplate(filepath) {
    var tplPath,
        exists = fs.existsSync;

    if (filepath) {
        if (exists(filepath)) {
            tplPath = filepath;
        }
        else {
            tplPath = path.join(__dirname, 'templates', filepath + '.hbs');

            if (!exists(tplPath)) {
                tplPath = path.join(__dirname, 'templates', filepath);

                if (!exists(tplPath)) {
                    this.emit('error', 'Cannot find template file "' + filepath + '".');
                    return;
                }
            }
        }
    }
    else {
        tplPath = path.join(__dirname, 'templates', 'umd.hbs');
    }

    try {
        return handlebars.compile(fs.readFileSync(tplPath, 'utf-8'));
    }
    catch (e) {
        this.emit('error', e.message);
    }
};

UMD.prototype.generate = function generate() {
    var options = this.options,
        code = this.code,
        ctx = objectMerge({}, options);

    var depsOptions = objectMerge(
        getDependencyDefaults(this.options.globalAlias),
        convertDependencyArrays(options.deps) || {}
    );

    var defaultDeps = depsOptions['default'].items;
    var deps = defaultDeps ? defaultDeps || defaultDeps.items || [] : [];
    var dependency, dependencyType, items, prefix, separator, suffix;

    for (dependencyType in depsOptions) {
        dependency = depsOptions[dependencyType];
        items = dependency.items || defaultDeps || [];
        prefix = dependency.prefix || '';
        separator = dependency.separator || ', ';
        suffix = dependency.suffix || '';
        ctx[dependencyType + 'Dependencies'] = {
            normal: items,
            wrapped: items.map(UMD.wrap(prefix, suffix)).join(separator),
        };
    }

    ctx.dependencies = deps.join(', ');

    ctx.code = code;

    return this.template(ctx);
};

function convertDependencyArrays(deps) {
    if(!deps) {
        return;
    }

    return zip.toObject(zip(deps).map(function(pair) {
        if(is.array(pair[1])) {
            return [pair[0], {
                items: pair[1]
            }];
        }

        return pair;
    }));
}

function getDependencyDefaults(globalAlias) {
    return {
        'default': {
            items: null,
        },
        amd: {
            items: null,
            prefix: '\"',
            separator: ',',
            suffix: '\"',
        },
        cjs: {
            items: null,
            prefix: 'require(\"',
            separator: ',',
            suffix: '\")',
        },
        global: {
            items: null,
            prefix: globalAlias? globalAlias + '.': '\"',
            separator: ',',
            suffix: '\"',
        }
    };
}

UMD.wrap = function wrap(pre, post) {
    pre = pre || '';
    post = post || '';

    return function (v) {
        return pre + v + post;
    };
};

module.exports = function(code, options) {
    var u = new UMD(code, options);

    return u.generate();
};
