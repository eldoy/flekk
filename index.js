const fpath = require('path')
const weblang = require('weblang')
const waveorb = require('waveorb-client')
const connection = require('mongowave')
const { tree, read, inspect } = require('extras')
const { validate } = require('d8a')
const _ = require('lodash')
const fport = require('fport')

const MATCHER = /[.-](test|setup|config)\.yml$/
const CONFIG = { db: { name: 'flekk-test' } }

module.exports = function flekk(opt = {}) {
  const path = opt.path || 'test'
  let $db = null
  const pool = { config: [], setup: [], test: [] }
  let files = tree(path)
  let root = fpath.join(process.cwd(), path)

  let config = {}
  try {
    config = read(fpath.join(root, 'flekk.config.yml'))
  } catch(e) {}
  config = _.merge(CONFIG, config)
  config.port = process.env.FLEKK_PORT
    || config.port
    || opt.port
    || 5061

  config.url = process.env.FLEKK_URL
    || config.url
    || opt.url
    || 'http://localhost'

  for (const file of files) {
    const match = file.match(MATCHER)
    if (!match) continue
    const data = read(file)
    const name = file
      .replace(root, '')
      .replace(match[0], '')
      .slice(1)
    pool[match[1]].push({ file, data, name })
  }

  const ext = {}

  ext.config = async function({ val, params }) {
    // Apply copy of global config
    params.config = _.merge({}, config)
    if (typeof val == 'string') val = [val]
    for (const name of val) {
      const c = pool.config.find(x => x.name == name)
      params.config = _.merge({}, params.config, c.data)
    }
  }

  ext.setup = async function({ val, run }) {
    if (typeof val == 'string') val = [val]
    for (const name of val) {
      const s = pool.setup.find(x => x.name == name)
      if (s) await run(s.data)
    }
  }

  ext.db = async function({ val }) {
    let { action, query, values, options } = val
    let [model, verb] = action.split('/')
    let args = [query, options]
    if (verb == 'create') args = [values]
    if (verb == 'update') args = [query, values]
    if (verb == 'delete') args = [query]
    return await $db(model)[verb](...args)
  }

  ext.test = async function({ val: spec, setter, get }) {
    const received = get(`$${setter}`)
    const result = await validate(spec, received)
    if (result) {
      const error = new Error('Test failed')
      error.data = { spec, received }
      throw error
    }
    return received
  }

  ext.api = async function({ val }) {
    const { url, port } = config
    const client = waveorb(`${url}:${port}`)
    return await client(val)
  }

  ext.log = function({ key, val, get }) {
    console.log()
    inspect({ [key]: get(val) }, { depth: 20 })
    console.log()
  }

  const runner = weblang({ ext })

  function log(...args) {
    if (!opt.quiet) {
      console.log(...args)
    }
  }

  // Wait for web server
  async function server() {
    const { url, port } = config
    let up, retry = 0, host = url.replace(/https?:\/\//, '')
    while(!up && retry++ <= 50) {
      up = await fport.taken(port, host)
      if (!up) await new Promise(r => setTimeout(r, 250))
    }
    if (!up) {
      console.log('Could not connect to app server... exiting.\n')
      process.exit(0)
    }
  }

  return async function(match) {
    log('\n⭐ Starting test suite\n')
    if (!$db) $db = await connection(config.db)

    await server()

    if (opt.timer) {
      console.time('Time elapsed')
    }

    const results = []
    for (const t of pool.test) {
      if (!match || t.name.includes(match)) {
        const obj = Object.assign({}, t)
        try {
          obj.state = await runner(t.data, obj)
          log(`✅ ${t.name}`)
        } catch(e) {
          log(`❌ ${t.name}`)
          throw e
        }
        results.push(obj)
        if ($db) await $db.drop()
      }
    }

    if (opt.timer) {
      console.log()
      console.timeEnd('Time elapsed')
    }

    return results
  }
}
