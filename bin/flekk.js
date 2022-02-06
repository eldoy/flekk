#!/usr/bin/env node
const { inspect } = require('extras')
const flekk = require('../index.js')

const match = process.argv[2]

async function run() {
  try {
    await flekk({ timer: true })(match)
  } catch(e) {
    if (e.data) {
      console.log(`\n$${e.data.setter} wants:\n`)
      inspect(e.data.spec, { depth: 20 })
      console.log('\nbut got:\n')
      inspect(e.data.got, { depth: 20 })
    } else {
      throw e
    }
  }
  process.exit(0)
}
run()
