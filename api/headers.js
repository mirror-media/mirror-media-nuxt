const { NO_CACHE_HEADERS } = require('./constant')

module.exports = function (req, res, next) {
  const hostname = req.hostname
  console.info('[header] hostname', hostname, 'req.url', req.url)
  if (hostname.match(/dev.mirrormedia.mg/gs)) {
    console.info('[header] set no cache', hostname, 'req.url', req.url)
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
    if (req.url.match(/^\/(api|story|video|app)\//gs)) {
      res.set('cache-control', 'public, max-age=600')
    }
    return next()
  }
  next()
}
