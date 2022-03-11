const flekk = require('../../index.js')
const opt = { quiet: true, exact: true }

it('should work with db', async ({ t }) => {
  let result = await flekk(opt)('test10')
  t.ok(result[0].state.vars.result.id != null)
  t.ok(result[0].state.vars.result.name == 'hello')
})
