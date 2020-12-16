const {
  API_PROTOCOL,
  API_HOST_MEMBERSHIP_GATEWAY,
  API_PORT_MEMBERSHIP_GATEWAY,
} = require('../configs/config')
const { createProxy } = require('./helpers')

module.exports = createProxy(
  `${API_PROTOCOL}://${API_HOST_MEMBERSHIP_GATEWAY}:${API_PORT_MEMBERSHIP_GATEWAY}/api/v0`
)
