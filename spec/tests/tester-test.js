const flekk = require('../../index.js')
const opt = { quiet: true }

it('should test pass string', async ({ t }) => {
  let result = await flekk(opt)('test2')
  t.ok(result[0].state.vars.hello == 'hello')
})

it('should test fail string', async ({ t }) => {
  let result = null
  try {
    result = await flekk(opt)('test3')
  } catch(e) {
    t.ok(e.data.got == 'world')
    t.ok(e.data.spec == 'bye')
    t.ok(e.message == 'Test failed')
  }
  t.ok(result === null)
})

it('should test pass integer', async ({ t }) => {
  let result = await flekk(opt)('test4')
  t.ok(result[0].state.vars.hello == 1)
})

it('should test fail integer', async ({ t }) => {
  let result = null
  try {
    result = await flekk(opt)('test5')
  } catch(e) {
    t.ok(e.data.got == 1)
    t.ok(e.data.spec == 2)
    t.ok(e.message == 'Test failed')
  }
  t.ok(result === null)
})

it('should test pass array', async ({ t }) => {
  let result = await flekk(opt)('test6')
  t.ok(result[0].state.vars.hello[0] == 1)
  t.ok(result[0].state.vars.hello[1] == 2)
})

it('should test fail array', async ({ t }) => {
  let result = null
  try {
    result = await flekk(opt)('test7')
  } catch(e) {
    t.ok(e.data.got[0] == 1)
    t.ok(e.data.got[1] == 2)
    t.ok(e.data.spec[0] == 2)
    t.ok(e.data.spec[1] == 3)
    t.ok(e.message == 'Test failed')
  }
  t.ok(result === null)
})

it('should test pass object', async ({ t }) => {
  let result = await flekk(opt)('test8')
  t.ok(result[0].state.vars.hello.name == 'hello')
  t.ok(result[0].state.vars.hello.email == 'hello@example.com')
})

it('should test fail object', async ({ t }) => {
  let result = null
  try {
    result = await flekk(opt)('test9')
  } catch(e) {
    t.ok(e.data.got.name == 'hello')
    t.ok(e.data.got.email == 'hello@example.com')
    t.ok(e.data.spec.name == 'bye')
    t.ok(e.data.spec.email == 'bye@example.com')
    t.ok(e.message == 'Test failed')
  }
  t.ok(result === null)
})

it('should test with var values', async ({ t }) => {
  let result = await flekk(opt)('test16')
  t.ok(result[0].state.vars.hello.name == 'hello')
  t.ok(result[0].state.vars.bye.name == 'hello')
})