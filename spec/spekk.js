const { serve } = require('waveorb')

module.exports = async function() {

  // Wait for web server
  await new Promise(r => setTimeout(r, 500))

  return {}
}
