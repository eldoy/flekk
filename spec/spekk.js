const { serve } = require('waveorb')
const connection = require('mongowave')

module.exports = async function() {
  const db = await connection({ name: 'flekk-test' })

  // Start web server
  await serve()

  return { db }
}
