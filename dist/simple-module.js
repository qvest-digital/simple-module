(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(simple-module["jquery"], function (a0) {
      return (root['SimpleModule'] = factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    root['SimpleModule'] = factory(jQuery);
  }
}(this, function ($) {

var SimpleModule,
  slice = [].slice;

SimpleModule = (function() {
  SimpleModule.extend = function(obj) {
    var key, ref, val;
    if (!(obj && typeof obj === 'object')) {
      throw new Error('SimpleModule.extend: param should be an object');
    }
    for (key in obj) {
      val = obj[key];
      if (key !== 'included' && key !== 'extended') {
        this[key] = val;
      }
    }
    return (ref = obj.extended) != null ? ref.call(this) : void 0;
  };

  SimpleModule.include = function(obj) {
    var key, ref, val;
    if (!(obj && typeof obj === 'object')) {
      throw new Error('SimpleModule.include: param should be an object');
    }
    for (key in obj) {
      val = obj[key];
      if (key !== 'included' && key !== 'extended') {
        this.prototype[key] = val;
      }
    }
    return (ref = obj.included) != null ? ref.call(this) : void 0;
  };

  SimpleModule.connect = function(cls) {
    if (!(cls && typeof cls === 'function')) {
      throw new Error('SimpleModule.connect: param should be a function');
    }
    if (!cls.pluginName) {
      throw new Error('SimpleModule.connect: cannot connect plugin without pluginName');
    }
    cls.prototype._connected = true;
    if (!this._connectedClasses) {
      this._connectedClasses = [];
    }
    this._connectedClasses.push(cls);
    return this[cls.pluginName] = cls;
  };

  SimpleModule.prototype.opts = {};

  function SimpleModule(opts) {
    var base, cls, i, instance, instances, len, name;
    this.opts = $.extend({}, this.opts, opts);
    (base = this.constructor)._connectedClasses || (base._connectedClasses = []);
    instances = (function() {
      var i, len, ref, results;
      ref = this.constructor._connectedClasses;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        cls = ref[i];
        name = cls.pluginName.charAt(0).toLowerCase() + cls.pluginName.slice(1);
        if (cls.prototype._connected) {
          cls.prototype._module = this;
        }
        results.push(this[name] = new cls());
      }
      return results;
    }).call(this);
    if (this._connected) {
      this.opts = $.extend({}, this.opts, this._module.opts);
    } else {
      this._init();
      for (i = 0, len = instances.length; i < len; i++) {
        instance = instances[i];
        if (typeof instance._init === "function") {
          instance._init();
        }
      }
    }
    this.trigger('initialized');
  }

  SimpleModule.prototype._init = function() {};

  SimpleModule.prototype.on = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    (ref = $(this)).on.apply(ref, args);
    return this;
  };

  SimpleModule.prototype.off = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    (ref = $(this)).off.apply(ref, args);
    return this;
  };

  SimpleModule.prototype.trigger = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    (ref = $(this)).trigger.apply(ref, args);
    return this;
  };

  SimpleModule.prototype.triggerHandler = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = $(this)).triggerHandler.apply(ref, args);
  };

  SimpleModule.prototype.one = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    (ref = $(this)).one.apply(ref, args);
    return this;
  };

  SimpleModule.prototype._t = function(key) {
    return this.constructor._t(key);
  };

  SimpleModule._t = function(key) {
    var ref;
    return ((ref = this.i18n[this.locale]) != null ? ref[key] : void 0) || '';
  };

  SimpleModule.i18n = {
    'en': {},
    'zh-CN': {}
  };

  SimpleModule.locale = 'en';

  return SimpleModule;

})();
return SimpleModule;

}));
