#!/usr/bin/env node
const { inspect } = require('extras')
const flekk = require('../index.js')

const match = process.argv[2]

async function run() {
  console.log(`\n⭐ Starting test suite`)
  await new Promise(r => setTimeout(r, 1000))
  console.time('Time elapsed')

  try {
    await flekk()(match)
  } catch(e) {
    inspect(e.data, { depth: 20 })
  }

  console.log()
  console.timeEnd('Time elapsed')
  process.exit(0)
}
run()
