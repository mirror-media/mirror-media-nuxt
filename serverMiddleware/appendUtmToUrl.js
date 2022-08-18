import {
  objectToQueryString,
  queryStringToObject,
  utmObjectFromQuery,
} from '../utils/cookieQueryStringConverter'

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

    if (
      !!req.query.utm_campaign &&
      typeof req.query.utm_campaign !== 'string'
    ) {
      /*
       * ignore the case when there are more than one utm_campaign cause it's hard to tell what to store in cookie
       * for now there are only two conditions to encounter this corner case:
       *  1. Yser accidentally copy past double utm_campaign (maybe more like a qa's behavior try to test the site).
       *  2. When one member campaign is stored in cookie and user click on other non member campaign, so the utm_campaign will
       *     be added to the url. In this case since we already stored the campaign we care, it will be ok just to ignore it.
       */
      return next()
    }

    const hasTrackingCampaignInUrl =
      !!req.query.utm_campaign &&
      req.query.utm_campaign?.toLowerCase().includes(trackingCampaignKeyword)

    if (hasTrackingCampaignInUrl) {
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
