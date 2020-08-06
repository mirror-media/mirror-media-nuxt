const { PREVIEW_QUERY } = require('../configs/config')
const { NO_CACHE_HEADERS } = require('./constant')

module.exports = function (req, res, next) {
  const hostname = req.hostname
  const url = req.url

  const regexUrlNoCaching = new RegExp(`${PREVIEW_QUERY}|culturepreview`, 'gs')

  const isNoCaching =
    hostname.match(/dev.mirrormedia.mg|keystone/gs) ||
    url.match(regexUrlNoCaching)

  if (isNoCaching) {
    res.set(NO_CACHE_HEADERS)
    return next()
  }

  if (hostname.match(/mirrormedia.mg/gs)) {
    if (
      url.match(
        /^\/$|^\/(section|category|video_category|topic|externals|search|author|tag)\//gs
      )
    ) {
      res.set(NO_CACHE_HEADERS)
    }
    if (url.match(/^\/(api|story|culture-post|video|app)\//gs)) {
      res.set('cache-control', 'public, max-age=600')
    }
    return next()
  }
  next()
}
