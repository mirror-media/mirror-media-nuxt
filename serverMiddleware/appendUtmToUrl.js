const pageName = [
  'author',
  'category',
  'external',
  'externals',
  'magazine',
  'papermag',
  'pre',
  'premium',
  'premiumcategory',
  'premiumsection',
  'profile',
  'search',
  'section',
  'story',
  'subscribe',
  'tag',
  'topic',
  'video',
  'video_category',
  'cancelMembership',
  'email-verify',
  'finishSignUp',
  'login',
  'marketing',
  'recoverPassword',
  'service-rule',
  'updatePassword',
  'verify-success',
]

export default function (req, res, next) {
  // return next()
  if (
    req.method === 'GET' &&
    (req.path === '/' || pageName.includes(req.path.split('/')[1]))
  ) {
    let cookieUtm
    if (req.cookies.utm) {
      console.log(req.cookies.utm, typeof req.cookies.utm)
      cookieUtm = JSON.parse(req.cookies.utm)
    }
    console.log(
      `newMiddle called, path='${req.path}', utm_campaign='${req.query.utm_campaign}, c_utm_campaign='${cookieUtm?.utm_campaign}'`
    )

    // 1. check url query contains member utm
    const urlHasMemberCampaign =
      !!req.query.utm_campaign &&
      req.query.utm_campaign.toLowerCase().includes('member')

    // 2. check cookies contains member utm
    const cookieHasMemberCampaign = cookieUtm

    if (urlHasMemberCampaign) {
      const utmObj = utmObjectFromQuery(req.query)
      if (!cookieHasMemberCampaign) {
        console.log('set cookie')
        res.cookie('utm', JSON.stringify(utmObj), {
          maxAge: 24 * 60 * 60 * 1000,
        })
      } else if (
        cookieHasMemberCampaign.utm_campaign !== req.query.utm_campaign
      ) {
        console.log('update cookie')
        res.cookie('utm', JSON.stringify(utmObj), {
          maxAge: 24 * 60 * 60 * 1000,
        })
      }
    } else if (cookieHasMemberCampaign) {
      console.log(
        'redirect with utm url params',
        req.path +
          objectToQueryString({ ...req.query, ...cookieHasMemberCampaign })
      )

      res.redirect(
        req.path +
          objectToQueryString({ ...req.query, ...cookieHasMemberCampaign })
      )
    }
  }

  next()
}

function objectToQueryString(object) {
  let queryString = '?'
  Object.entries(object).forEach(([key, value], i) => {
    const query = `${key}=${value}`
    const end = i === Object.keys(object).length - 1 ? '' : '&'
    queryString += query + end
  })
  return queryString
}

function utmObjectFromQuery(query) {
  const utmObjs = {}
  Object.keys(query)
    .filter((key) => key.includes('utm'))
    .forEach((key) => (utmObjs[key] = query[key]))
  return utmObjs
}
