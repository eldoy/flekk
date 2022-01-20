#!/usr/bin/env node
const { inspect } = require('extras')
const flekk = require('../index.js')

const match = process.argv[2]

async function run() {
  try {
    await flekk({ timer: true })(match)
  } catch(e) {
    console.log('')
    inspect(e.data.spec, { depth: 20 })
    console.log('')
    inspect(e.data.received, { depth: 20 })
  }
  process.exit(0)
}
run()
