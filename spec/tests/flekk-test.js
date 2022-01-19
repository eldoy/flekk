const flekk = require('../../index.js')
const opt = { quiet: true }

/* GENERAL *
***********/

it('should run weblang', async ({ t }) => {
  let result = await flekk(opt)('test1')
  t.ok(result[0].state.vars.hello == 1)
})


/* TEST *
********/

it('should test pass string', async ({ t }) => {
  let result = await flekk(opt)('test2')
  t.ok(result[0].state.vars.hello == 'hello')
})

it('should test fail string', async ({ t }) => {
  let result = null
  try {
    result = await flekk(opt)('test3')
  } catch(e) {
    t.ok(e.data.actual == 'world')
    t.ok(e.data.expected == 'bye')
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
    t.ok(e.data.actual == 1)
    t.ok(e.data.expected == 2)
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
    t.ok(e.data.actual[0] == 1)
    t.ok(e.data.actual[1] == 2)
    t.ok(e.data.expected[0] == 2)
    t.ok(e.data.expected[1] == 3)
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
    t.ok(e.data.actual.name == 'hello')
    t.ok(e.data.actual.email == 'hello@example.com')
    t.ok(e.data.expected.name == 'bye')
    t.ok(e.data.expected.email == 'bye@example.com')
    t.ok(e.message == 'Test failed')
  }
  t.ok(result === null)
})

/* DB *
*******/

it('should work with db', async ({ t }) => {
  let result = await flekk(opt)('test10')
  t.ok(result[0].state.vars.result.id != null)
  t.ok(result[0].state.vars.result.name == 'hello')
})


/* API *
*******/

it('should work with api', async ({ t }) => {
  let result = await flekk(opt)('test11')
  t.ok(result[0].state.vars.result.hello == 'world')
})


/* SETUP *
*********/

it('should work with setup', async ({ t }) => {
  let result = await flekk(opt)('test12')
  t.ok(result[0].state.vars.session.token == '1234')
})