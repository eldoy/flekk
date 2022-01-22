const flekk = require('../../index.js')
const opt = { quiet: true }

it('should run weblang', async ({ t }) => {
  let result = await flekk(opt)('test1')
  t.ok(result[0].state.vars.hello == 1)
})