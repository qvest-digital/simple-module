# Simple Module (reduced v2.x API)

SimpleModule is a simple base class providing some necessary features to make its subclasses extendable. The front-end UI libraries of the color scheme are built based on this abstract class.

Depends on jQuery 2.0+, supports IE10+, Firefox, Chrome, Safari.

## Features

#### Events

SimpleModule delegates events methods to jQuery object:

```js
let module = new SimpleModule();

// bind namespace event
module.on('customEvent.test', function(data) {
  console.log(data);
});
// equivalent to
$(module).on('customEvent.test', function(data) {
  console.log(data);
});

// trigger a namespace event
module.trigger('customEvent.test', 'test');
// equivalent to
$(module).trigger('customEvent.test', 'test');
```

These event interfaces are implemented by jQuery-based custom events:

* `module.on 'type', callback` binding event

* `module.one 'type', callback` binds the event and automatically unbinds after the first trigger

* `module.off 'type'` unbind event

* `module.trigger 'type', [args]` trigger custom event

* `module.triggerHandler 'type', [args]` triggers a custom event and returns the return value of the last callback

#### Mixins

`SimpleModule.extend` can dynamically add class properties and methods to a component:

```js
var testMixins = {
  classProperty: true,
  classMethod: function() {}
};

SimpleModule.extend(testMixins);
```

`SimpleModule.include` can dynamically add prototype properties and prototype methods to components.

Add instance properties and methods to SimpleModule:

```js
var testMixins = {
  instanceProperty: true,
  instanceMethod: function() {}
};

SimpleModule.include(testMixins);
```

`SimpleModule.connect` can mount plugins and extensions to components.

#### Simple localisation support

The `Module.i18n` object is used to store localised resources (key-value pairs), for example:

```coffee
Module.i18n =
  'de':
    Hello: 'Hallo!'
  'en':
    Hello: 'Hello!'
```

`Module.locale` is used to set the current localisation language, for example:

```coffee
Module.locale = 'zh-CN'
```

`module._t(key)` can be used to get the translation string, for example:

```coffee
@_t('hello') # Hallo
```

SimpleModule only provides the simplest localisation support. Components with more complex internationalisation/localisation requirements should use a full-fledged library instead.
