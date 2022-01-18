const fpath = require('path')
const weblang = require('weblang')
const waveorb = require('waveorb-client')
const connection = require('mongowave')
const extras = require('extras')
const assert = require('assert')

const url = `http://localhost:${process.env.WAVEORB_PORT || '5061'}`
const client = waveorb(url)

module.exports = function flekk(opt = {}) {
  const path = opt.path || 'test'
  let $db = null
  const tests = []
  const setups = []
  let files = extras.tree(path)
  let root = fpath.join(process.cwd(), path)

  for (const file of files) {
    const data = extras.read(file)
    const name = file
      .replace(root, '')
      .replace(/-(test|setup)\.yml$/, '')
      .slice(1)

    const node = { file, data, name }

    if (file.endsWith('-test.yml')) {
      tests.push(node)
    } else if (file.endsWith('-setup.yml')) {
      setups.push(node)
    }
  }

  async function setup({ val, run, state }) {
    if (typeof val == 'string') val = [val]
    for (const name of val) {
      const s = setups.find(x => x.name == name)
      if (s) await run(s.data)
    }
  }

  async function db({ val }) {
    let { action, query, values, options } = val
    let [model, verb] = action.split('/')
    let args = [query, options]
    if (verb == 'create') args = [values]
    if (verb == 'update') args = [query, values]
    if (verb == 'delete') args = [query]

    // TODO: Need to get the name from config file
    if (!$db) $db = await connection({ name: 'flekk-test' })
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

  async function api({ val }) {
    return await client(val)
  }

  const runner = weblang({
    vars: {},
    pipes: {},
    ext: {
      setup,
      db,
      test,
      api
    }
  })

  return async function(match) {
    const results = []
    for (const t of tests) {
      if (!match || t.name.includes(match)) {
        const obj = Object.assign({}, t)
        obj.state = await runner(t.data)
        results.push(obj)
        if ($db) await $db.drop()
      }
    }
    return results
  }
}
