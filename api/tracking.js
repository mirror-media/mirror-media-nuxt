// This api endpoint is shared with mirror-media iOS/Android app, modify it with breaking changes carefully.
const { isEmpty } = require('lodash')
const { Logging } = require('@google-cloud/logging')
const config = require('../configs/config')
const loggingClient = new Logging({
  projectId: config.GCP_PROJECT_ID,
  keyFilename: config.GCP_KEYFILE,
})

module.exports = function (req, res, next) {
  try {
    res.send({ msg: 'Received.' })
    const query = !isEmpty(req.body) ? req.body : req.query
    const logName = req.query.logName || config.GCP_STACKDRIVER_LOG_NAME
    const log = loggingClient.log(logName)
    const metadata = { resource: { type: 'global' } }
    query.ip = req.clientIp
    const entry = log.entry(metadata, query)
    log.write(entry)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] Client info logging error occurred: ${error}.`)
  }
}
