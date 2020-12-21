const { PREVIEW_QUERY, ENV } = require('../configs/config')

module.exports = function handleHeaders(req, res, next) {
  const { hostname, url } = req

  if (
    ['local', 'dev'].includes(ENV) ||
    /keystone/gs.test(hostname) ||
    /^\/(video_category|externals)\//gs.test(url) ||
    new RegExp(PREVIEW_QUERY, 'gs').test(url)
  ) {
    res.setHeader('Cache-Control', 'no-store')

    return next()
  }

  const isDefaultListingPages = /^\/(section|category|topic|search|author|tag)\//gs.test(
    url
  )
  if (isDefaultListingPages) {
    res.setHeader('Cache-Control', `private, max-age=${60 * 5}`)

    return next()
  }

  res.setHeader('Cache-Control', `private, max-age=${60 * 10}`)

  return next()
}
