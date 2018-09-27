class SimpleModule

  # Add properties to {SimpleModule} class.
  #
  # @param [Object] obj The properties of {obj} will be copied to {SimpleModule}
  #                     except a property named `extended`, which is a function
  #                     that will be called after copy operation.
  @extend: (obj) ->
    unless obj and typeof obj == 'object'
      throw new Error('SimpleModule.extend: param should be an object')

    for key, val of obj when key not in ['included', 'extended']
      @[key] = val

    obj.extended?.call(@)

  # Add properties to instance of {SimpleModule} class.
  #
  # @param [Hash] obj The properties of {obj} will be copied to prototype of
  #                   {SimpleModule}, except a property named `included`, which
  #                   is a function that will be called after copy operation.
  @include: (obj) ->
    unless obj and typeof obj == 'object'
      throw new Error('SimpleModule.include: param should be an object')

    for key, val of obj when key not in ['included', 'extended']
      @::[key] = val

    obj.included?.call(@)

  @connect: (cls) ->
    unless cls and typeof cls == 'function'
      throw new Error('SimpleModule.connect: param should be a function')

    unless cls.pluginName
      throw new Error('SimpleModule.connect: cannot connect plugin without pluginName')

    # create list of mounted classes if not already created;
    # this must be done in both @connect and the constructor
    # due to the way CoffeeScript’s extend function works
    @_connectedClasses = [] unless @_connectedClasses

    # mark target as having been mounted
    cls::_connected = true
    # store away in our list of mounted classes
    @_connectedClasses.push(cls)
    # make available
    @[cls.pluginName] = cls

  opts: {}

  # Create a new instance of {SimpleModule}
  #
  # @param [Hash] opts The options for initialization.
  #
  # @return The new instance.
  constructor: (opts) ->
    @opts = $.extend {}, @opts, opts

    # create list of mounted classes if not already created;
    # this must be done in both @connect and the constructor
    # due to the way CoffeeScript’s extend function works
    @constructor._connectedClasses ||= []

    # create singleton instances of connected classes
    instances = for cls in @constructor._connectedClasses
      # lowercase first letter of class name
      name = cls.pluginName.charAt(0).toLowerCase() + cls.pluginName.slice(1)
      # store reference to parent module
      cls::_module = @ if cls::_connected
      # add newly created/singleton instance to “this” module
      @[name] = new cls()

    # are we a mounted submodule?
    if @_connected
      # yes; just merge the parent module’s options into ours
      @opts = $.extend {}, @opts, @_module.opts
    else
      # no; call our own initialisator and all mounted submodules’
      @_init()
      instance._init?() for instance in instances

    @trigger 'initialized'

  _init: ->

  on: (args...) ->
    $(@).on args...
    @

  off: (args...) ->
    $(@).off args...
    @

  trigger: (args...) ->
    $(@).trigger(args...)
    @

  triggerHandler: (args...) ->
    $(@).triggerHandler(args...)

  one: (args...) ->
    $(@).one args...
    @

  _t: (key) ->
    @constructor._t key

  @_t: (key) ->
    @i18n[@locale]?[key] || ''

  @i18n:
    'en': {}
    'zh-CN': {}

  @locale: 'en'
