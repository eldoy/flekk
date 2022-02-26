const flekk = require('../../index.js')
const opt = { quiet: true }

it('should work with single config', async ({ t }) => {
  let result = await flekk(opt)('test14')
  t.ok(result[0].config.hello == 'app')
  t.ok(result[0].config.port == 5061)
})

it('should work with multiple configs', async ({ t }) => {
  let result = await flekk(opt)('test15')
  t.ok(result[0].config.hello == 'remote')
  t.ok(result[0].config.port == 5061)
})