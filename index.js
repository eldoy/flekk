const weblang = require('weblang')
const waveorb = require('waveorb-client')
const mongodb = require('mongowave')
const extras = require('extras')
const assert = require('assert')

async function setup({ val, run }) {
  // const filters = await $.db('filter').find({ name: { $in: val } })
  // for (const filter of filters) {
  //   await run(filter.data)
  // }
}

let $db = null
async function db({ val }) {
  let { path, query, values, options } = val
  let [model, verb] = path.split('/')
  let args = [query, options]
  if (verb == 'create') args = [values]
  if (verb == 'update') args = [query, values]
  if (verb == 'delete') args = [query]

  if (!$db) $db = mongodb({ name: 'flekk' })
  return await $db(model)[verb](...args)
}

async function test({ val, get }) {
  const name = Object.keys(val)[0]
  const actual = get(name)
  const expected = val[name]
  try {
    assert.deepEqual(actual, expected)
  } catch(e) {
    if (e.code != 'ERR_ASSERTION') throw e
    const error = new Error('Test failed')
    error.data = { actual, expected }
    throw error
  }
}

async function api({ val, state }) {
  console.log(val, state)
  const url = `http://localhost:${process.env.WAVEORB_PORT || '5061'}`
  const client = waveorb(url)
  const result = await api({
    action: 'project/create'
  })
}

module.exports = async function flekk(code) {

  const runner = weblang({
    vars: {},
    ext: {
      setup,
      db,
      test,
      api
    },
    pipes: {}
  })

  return runner(code)
}