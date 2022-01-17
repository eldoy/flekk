const { i18n, loader, actions, locales } = require('waveorb')
const db = require('configdb')
const flekk = require('../../index.js')

/* SET *
 *******/

it('should set string variable', async ({ t }) => {
  const app = await loader({ path: 'spec/app', locales })
  console.log()
  const $ = {
    app,
    params: {
      action: 'project/create'
    },
    t: i18n.t({ locales })
  }

  let result = await actions($)

  console.log({ result })

  t.ok(result.hello == 'world')

  // let result
  // try {
  //   result = await actions($)
  // } catch (e) {
  //   // expect(e.data.error.message).toBe('validation error')
  //   // expect(e.data.query.name).toEqual([ 'minimum length is 5' ])
  //   // expect(e.data.query.key).toEqual([ 'must be one of 7, 8' ])
  // }
  // // expect(result).toBeUndefined()

  // $.params.query.name = 'hello'
  // $.params.query.key = 7

  // result = await actions($)
  // // expect(result.hello).toBe('bye')
  // // t.ok(state.vars.hello == 'world')
})
