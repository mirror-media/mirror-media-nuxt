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
const trackingCampaignKeyword = 'member'
export const trackingSeconds = 24 * 60 * 60

export default function (req, res, next) {
  if (
    req.method === 'GET' &&
    (req.path === '/' || pageName.includes(req.path.split('/')[1]))
  ) {
    let cookieUtm
    if (req.cookies.utm) {
      try {
        cookieUtm = JSON.parse(req.cookies.utm)
      } catch (error) {
        cookieUtm = null
      }
    }

    const urlHasTrakingCampainKeyword =
      !!req.query.utm_campaign &&
      req.query.utm_campaign?.toLowerCase().includes(trackingCampaignKeyword)

    if (urlHasTrakingCampainKeyword) {
      const utmObj = utmObjectFromQuery(req.query)

      // store cookie if not exist or update cookie if new campaign detected
      if (!cookieUtm || cookieUtm.utm_campaign !== req.query.utm_campaign) {
        res.cookie('utm', JSON.stringify(utmObj), {
          maxAge: trackingSeconds,
        })
      }
    } else if (cookieUtm && !cookieUtm.terminated) {
      /*
       * append utm params and redirect if cookieUtm exists and is not terminated
       * redo string to object and object to string to avoid duplicate query strings
       * produced by sign_in url cache mechanism
       */
      res.redirect(
        req.path +
          objectToQueryString(
            queryStringToObject(
              objectToQueryString({ ...req.query, ...cookieUtm })
            )
          )
      )
    }
  }

  next()
}

export function queryStringFromCookieObject(cookieKey, otherObject = {}) {
  const queryObject = { ...otherObject, ...getCookieObject(cookieKey) }
  return objectToQueryString(queryObject)
}

export function objectToQueryString(object) {
  if (!Object.keys(object).length) {
    return ''
  }

  let queryString = '?'
  Object.entries(object).forEach(([key, value], i) => {
    const query = `${key}=${value}`
    const end = i === Object.keys(object).length - 1 ? '' : '&'
    queryString += query + end
  })
  return queryString
}

function queryStringToObject(queryString) {
  if (!queryString) {
    return {}
  }

  const queryObject = queryString
    .substring(1)
    .split('&')
    .reduce((queryObj, query) => {
      const [key, value] = query.split('=')
      queryObj[key] = value
      return queryObj
    }, {})

  return queryObject
}
export function getCookieObject(key) {
  if (!key || !document.cookie.length) {
    return null
  }

  const cookieString = document.cookie
    .split('; ')
    .filter((cookieStr) => cookieStr.includes(key))[0]
  try {
    const returnObj = JSON.parse(decodeURIComponent(cookieString.split('=')[1]))
    return returnObj
  } catch (error) {
    return null
  }
}
function utmObjectFromQuery(query) {
  const utmObjs = {}
  Object.keys(query)
    .filter((key) => key.includes('utm'))
    .forEach((key) => (utmObjs[key] = query[key]))
  return utmObjs
}
