#!/usr/bin/env node
const flekk = require('../index.js')
const { inspect } = require('extras')

const match = process.argv[2]

async function run() {
  console.log(`\n⭐ Starting test suite`)
  console.time('Time elapsed')

  try {
    await flekk()(match)
  } catch(e) {
    inspect(e.data)
  }

  console.log()
  console.timeEnd('Time elapsed')
  process.exit(0)
}
run()
