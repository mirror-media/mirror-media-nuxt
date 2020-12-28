const { API_HOST, API_PORT, API_PROTOCOL } = require('../configs/config')
const { createProxy } = require('./helpers')

module.exports = createProxy(`${API_PROTOCOL}://${API_HOST}:${API_PORT}`)
