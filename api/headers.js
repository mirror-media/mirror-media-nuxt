const { NO_CACHE_HEADERS } = require('./constant')

module.exports = function (req, res, next) {
  const hostname = req.hostname
  if (hostname.match(/dev.mirrormedia.mg/gs)) {
    res.set(NO_CACHE_HEADERS)
    return next()
  }

  if (hostname.match(/mirrormedia.mg/gs)) {
    if (
      req.url.match(
        /^\/$|^\/(section|category|video_category|topic|externals|search|author|tag)\//gs
      )
    ) {
      res.set(NO_CACHE_HEADERS)
    }
    if (req.url.match(/^\/(api|story|culture-post|video|app)\//gs)) {
      res.set('cache-control', 'public, max-age=600')
    }
    return next()
  }
  next()
}
