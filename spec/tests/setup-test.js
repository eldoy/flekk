const flekk = require('../../index.js')
const opt = { quiet: true, exact: true }

it('should work with single setup', async ({ t }) => {
  let result = await flekk(opt)('test12')
  t.ok(result[0].state.vars.session.token == '1234')
})

it('should work with multiple setups', async ({ t }) => {
  let result = await flekk(opt)('test13')
  t.ok(result[0].state.vars.session.token == '1234')
  t.ok(result[0].state.vars.dev == 'world')
})