const { PREVIEW_QUERY, ENV } = require('../configs/config')

module.exports = function (req, res, next) {
  const hostname = req.hostname
  const url = req.url

  const regexUrlNoCaching = new RegExp(PREVIEW_QUERY, 'gs')

  const isNoCaching =
    ENV === 'dev' ||
    hostname.match(/dev.mirrormedia.mg|keystone/gs) ||
    url.match(regexUrlNoCaching)

  if (isNoCaching) {
    res.set('Cache-Control', 'no-store')
    return next()
  }

  if (url.match(/^\/$|^\/(video_category|externals)\//gs)) {
    res.set('Cache-Control', 'no-store')
  }
  if (url.match(/^\/(api|story|culture-post|video|app)\//gs)) {
    res.set('cache-control', 'public, max-age=600')
  }

  const isDefaultListingPages = url.match(
    /^\/$|^\/(section|category|topic|search|author|tag)\//gs
  )
  if (isDefaultListingPages) {
    res.set('cache-control', `public, max-age=${60 * 5}`)
  }
  return next()
}
