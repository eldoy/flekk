const fpath = require('path')
const weblang = require('weblang')
const waveorb = require('waveorb-client')
const connection = require('mongowave')
const { tree, read } = require('extras')
const assert = require('assert')
const _ = require('lodash')

const CONFIG = {
  db: {
    name: 'flekk-test'
  }
}

module.exports = function flekk(opt = {}) {
  const path = opt.path || 'test'
  let $db = null
  const tests = []
  const setups = []
  let files = tree(path)
  let root = fpath.join(process.cwd(), path)

  let config = {}
  try {
    config = read(fpath.join(root, 'flekk.yml'))
  } catch(e) {}
  config = _.merge(CONFIG, config)

  const port = process.env.FLEKK_PORT
    || config.port
    || opt.port
    || 5061

  const url = process.env.FLEKK_PORT
    || config.url
    || opt.url
    || 'http://localhost'

  const client = waveorb(`${url}:${port}`)

  for (const file of files) {
    const data = read(file)
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

  async function setup({ val, run }) {
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

    if (!$db) $db = await connection(config.db)
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
