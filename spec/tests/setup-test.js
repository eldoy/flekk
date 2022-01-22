const flekk = require('../../index.js')
const opt = { quiet: true }

it('should work with setup', async ({ t }) => {
  let result = await flekk(opt)('test12')
  t.ok(result[0].state.vars.session.token == '1234')
})