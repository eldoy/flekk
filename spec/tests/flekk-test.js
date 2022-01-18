const flekk = require('../../index.js')

/* GENERAL *
 **********/

it('should run weblang', async ({ t }) => {
  let state = await flekk([
    '$hello: 1'
  ].join('\n'))
  t.ok(state.vars.hello == 1)
})


/* TEST *
 *******/

it('should test pass string', async ({ t }) => {
  let state = await flekk([
    '$hello: hello',
    'test:',
    '  $hello: hello'
  ].join('\n'))
  t.ok(state.vars.hello == 'hello')
})

it('should test fail string', async ({ t }) => {
  let state = null
  try {
    state = await flekk([
      '$hello: world',
      'test:',
      '  $hello: bye'
    ].join('\n'))
  } catch(e) {
    t.ok(e.data.actual == 'world')
    t.ok(e.data.expected == 'bye')
    t.ok(e.message == 'Test failed')
  }
  t.ok(state === null)
})

it('should test pass integer', async ({ t }) => {
  let state = await flekk([
    '$hello: 1',
    'test:',
    '  $hello: 1'
  ].join('\n'))
  t.ok(state.vars.hello == 1)
})

it('should test fail integer', async ({ t }) => {
  let state = null
  try {
    state = await flekk([
      '$hello: 1',
      'test:',
      '  $hello: 2'
    ].join('\n'))
  } catch(e) {
    t.ok(e.data.actual == 1)
    t.ok(e.data.expected == 2)
    t.ok(e.message == 'Test failed')
  }
  t.ok(state === null)
})

it('should test pass array', async ({ t }) => {
  let state = await flekk([
    '$hello:',
    '  - 1',
    '  - 2',
    'test:',
    '  $hello:',
    '    - 1',
    '    - 2'
  ].join('\n'))
  t.ok(state.vars.hello[0] == 1)
  t.ok(state.vars.hello[1] == 2)
})

it('should test fail array', async ({ t }) => {
  let state = null
  try {
    state = await flekk([
      '$hello:',
      '  - 1',
      '  - 2',
      'test:',
      '  $hello:',
      '    - 2',
      '    - 3'
    ].join('\n'))
  } catch(e) {
    t.ok(e.data.actual[0] == 1)
    t.ok(e.data.actual[1] == 2)
    t.ok(e.data.expected[0] == 2)
    t.ok(e.data.expected[1] == 3)
    t.ok(e.message == 'Test failed')
  }
  t.ok(state === null)
})

it('should test pass object', async ({ t }) => {
  let state = await flekk([
    '$hello:',
    '  name: hello',
    '  email: hello@example.com',
    'test:',
    '  $hello:',
    '    name: hello',
    '    email: hello@example.com'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'hello')
  t.ok(state.vars.hello.email == 'hello@example.com')
})

it('should test fail object', async ({ t }) => {
  let state = null
  try {
    state = await flekk([
      '$hello:',
      '  name: hello',
      '  email: hello@example.com',
      'test:',
      '  $hello:',
      '    name: bye',
      '    email: bye@example.com'
    ].join('\n'))
  } catch(e) {
    t.ok(e.data.actual.name == 'hello')
    t.ok(e.data.actual.email == 'hello@example.com')
    t.ok(e.data.expected.name == 'bye')
    t.ok(e.data.expected.email == 'bye@example.com')
    t.ok(e.message == 'Test failed')
  }
  t.ok(state === null)
})

/* API *
*******/

/* DB *
*******/

/* SETUP *
*******/
