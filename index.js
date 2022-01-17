// const weblang = require('weblang')
// const client = require('waveorb-client')
// const mongodb = require('mongowave')
// const tools = require('extras')
// const loader = require('conficurse')

// const tests = loader.load('spec')

// console.log(tests)

// async function setup({ val, run }) {
//   // const filters = await $.db('filter').find({ name: { $in: val } })
//   // for (const filter of filters) {
//   //   await run(filter.data)
//   // }
// }

// async function db({ val, state }) {
//   let { path } = val
//   let [model, verb] = path.split('/')
//   let { query, values, options } = state.vars
//   let args = [query, options]
//   if (verb == 'create') args = [values]
//   if (verb == 'update') args = [query, values]
//   if (verb == 'delete') args = [query]
//   return await $db(model)[verb](...args)
// }

// async function test({ val, state }) {
//   console.log(val, state)
// }

// async function api({ val, state }) {
//   console.log(val, state)
// }

// async function run() {
//   console.log('Running it')
//   const runner = await weblang({
//     vars: {},
//     ext: {
//       setup,
//       db,
//       test,
//       api
//     },
//     pipes: {}
//   })
// }

// run()

// module.exports = async function run() {

// }
module.exports = async function flekk() {
  console.log('FLEKKING IT')
}