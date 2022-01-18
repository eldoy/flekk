const { serve } = require('waveorb')

module.exports = async function() {

  // Start web server
  await serve()

  return {}
}
