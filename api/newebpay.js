const axios = require('axios')
const NewebPay = require('@mirrormedia/newebpay-node')
const {
  NEWEBPAY_KEY,
  NEWEBPAY_IV,
  ENV,
  DOMAIN_NAME,
  API_PROTOCOL,
  API_HOST_MEMBERSHIP_GATEWAY,
  API_PORT_MEMBERSHIP_GATEWAY,
  API_TIMEOUT,
} = require('../configs/config')
const {
  buildMembershipTradeInfo,
  TradeInfoValidationError,
} = require('./newebpay-helpers')

const RETURN_URL =
  ENV === 'local'
    ? 'http://localhost:3000/subscribe/return'
    : `https://${DOMAIN_NAME}/subscribe/return`

const TOKEN_STATE_URL = `${API_PROTOCOL}://${API_HOST_MEMBERSHIP_GATEWAY}:${API_PORT_MEMBERSHIP_GATEWAY}/api/v1/tokenState`

/*
 * 只有登入中的會員可以產生 TradeInfo / TradeSha。
 * 沿用 authenticate middleware 的判斷：apigateway tokenState 以 OK 開頭才算有效。
 */
async function isMemberTokenValid(authorization) {
  if (
    typeof authorization !== 'string' ||
    !/^Bearer \S+$/.test(authorization)
  ) {
    return false
  }
  try {
    const { data } = await axios.get(TOKEN_STATE_URL, {
      headers: { Authorization: authorization },
      timeout: API_TIMEOUT,
    })
    return (
      typeof data?.tokenState === 'string' && data.tokenState.startsWith('OK')
    )
  } catch (e) {
    return false
  }
}

function log(severity, message, extra = {}) {
  console.log(JSON.stringify({ severity, message, ...extra }))
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ status: 'error', message: 'method not allowed' })
    return
  }

  if (!(await isMemberTokenValid(req.headers?.authorization))) {
    res.status(401).send({ status: 'error', message: 'unauthorized' })
    return
  }

  let tradeInfo
  try {
    tradeInfo = buildMembershipTradeInfo(req.body, { returnUrl: RETURN_URL })
  } catch (e) {
    if (!(e instanceof TradeInfoValidationError)) throw e
    log('WARNING', `newebpay/v1 rejected tradeInfo: ${e.message}`, {
      email: req.body?.Email,
    })
    res.status(400).send({ status: 'error', message: e.message })
    return
  }

  try {
    const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(tradeInfo)
    res.send(encryptPostData)
  } catch (e) {
    log('ERROR', `newebpay/v1 encrypt error: ${e.message}`, {
      email: tradeInfo.Email,
    })
    res.status(500).send({ status: 'error', message: 'encrypt failed' })
  }
}
