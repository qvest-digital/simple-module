SimpleModule = require '../dist/simple-module.min.js'

describe 'Simple Module', ->
  class TestModule extends SimpleModule
    opts:
      moduleName: 'Test Module'

  it 'can be inherited from', ->
    testModule = new TestModule()
    expect(testModule instanceof SimpleModule).to.equal(true)

  it 'can be extended by an object', ->
    TestModule.extend
      extendVar: true
    expect(TestModule.extendVar).to.equal(true)

  it 'can include prototype variable', ->
    TestModule.include
      includeVar: true
    testModule = new TestModule()
    expect(testModule.includeVar).to.equal(true)

  it 'can connect other class', ->
    class TestPlugin extends SimpleModule
      @pluginName: 'TestPlugin'
    TestModule.connect TestPlugin
    testModule = new TestModule
    expect(testModule.testPlugin.constructor).to.equal(TestPlugin)
    expect(testModule.testPlugin._connected).to.equal(true)
    expect(testModule.testPlugin._module).to.equal(testModule)
    expect(testModule.testPlugin.opts.moduleName).to.equal('Test Module')

  it 'should translate i18n key', ->
    $.extend TestModule.i18n,
      'zh-CN':
        'hello': '你好，%s!'
      'en':
        'hello': 'Hello, World!'
    testModule = new TestModule()
    expect(testModule._t('hello')).to.equal('Hello, World!')
    expect(TestModule._t('hello')).to.equal('Hello, World!')
