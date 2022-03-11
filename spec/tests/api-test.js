const flekk = require('../../index.js')
const opt = { quiet: true, exact: true }

it('should work with api', async ({ t }) => {
  let result = await flekk(opt)('test11')
  t.ok(result[0].state.vars.result.hello == 'world')
})
