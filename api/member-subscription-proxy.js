const {
  API_PROTOCOL,
  API_MEMBER_SUBSCRIPTION_GATEWAY,
} = require('../configs/config')
const { createProxy } = require('./helpers')

module.exports = createProxy(
  `${API_PROTOCOL}://${API_MEMBER_SUBSCRIPTION_GATEWAY}`,
  3000
)
