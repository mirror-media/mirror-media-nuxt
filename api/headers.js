const { PREVIEW_QUERY, ENV, API_PATH_FRONTEND } = require('../configs/config')

module.exports = function handleHeaders(req, res, next) {
  const { hostname, url } = req

  if (
    ['local', 'dev'].includes(ENV) ||
    /keystone/gs.test(hostname) ||
    /^\/(video_category|externals)\//gs.test(url) ||
    new RegExp(PREVIEW_QUERY, 'gs').test(url) ||
    // eslint-disable-next-line
    /(login|finishSignUp|profile|cancelMembership|magazine|subscribe|pre\/story)/gs.test(
      url
    ) ||
    // deprecated topic page, due to ads in different device environments
    /topic/gs.test(url) ||
    // membership api paths
    new RegExp(`/${API_PATH_FRONTEND}/membership`, 'gs').test(url) ||
    new RegExp(`/${API_PATH_FRONTEND}/saleor`, 'gs').test(url) ||
    new RegExp(`/${API_PATH_FRONTEND}/member-subscription`, 'gs').test(url) ||
    // member subscribe page paths
    /(subscribe)/gs.test(url) ||
    /(papermag)/gs.test(url)
  ) {
    res.setHeader('Cache-Control', 'no-store')
    return next()
  }

  if (url === '/section/videohub') {
    res.setHeader('Cache-Control', `public, max-age=${60 * 15}`)
    return next()
  }
  // eslint-disable-next-line
  const isDefaultListingPages =
    /^\/(section|category|topic|search|author|tag)\//gs.test(url)
  if (isDefaultListingPages) {
    res.setHeader('Cache-Control', `public, max-age=${60 * 5}`)
    return next()
  }

  res.setHeader('Cache-Control', `public, max-age=${60 * 10}`)

  return next()
}
