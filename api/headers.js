const noCacheRule = {
  'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
  pragma: 'no-cache',
}

module.exports = function (req, res, next) {
  const hostname = req.hostname
  if (hostname.match(/dev.mirrormedia.mg/gs)) {
    res.set(noCacheRule)
    return next()
  }

  if (hostname.match(/mirrormedia.mg/gs)) {
    if (
      req.url.match(
        /^\/$|^\/(section|category|topic|externals|search|author|tag)\//gs
      )
    ) {
      res.set(noCacheRule)
    }
    if (req.url.match(/^\/(story|app)\//gs)) {
      res.set('cache-control', 'public, max-age=600')
    }
    return next()
  }
  next()
}
