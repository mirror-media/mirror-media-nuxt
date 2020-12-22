const { SALEOR_HOST } = require('../configs/config')
const { createProxy } = require('./helpers')

module.exports = createProxy(`http://${SALEOR_HOST}`)
