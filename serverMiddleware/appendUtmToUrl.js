import {
  objectToQueryString,
  queryStringToObject,
  utmObjectFromQuery,
} from '../utils/cookie-query-string-converter'
import { isPageRequesting } from '../utils/detect-page'

const trackingCampaignKeyword = 'member'
export const trackingMilliseconds = 24 * 60 * 60 * 1000

export default function (req, res, next) {
  /*
   * Since this request is sent from Neweb to give the result of the payment,
   * there won't be any utm cookies. We need to grab the utm queries and save them
   * in the res.locals for asyncData to terminate utm cookie.
   */
  if (req.method === 'POST' && req.path === '/subscribe/return') {
    if (req.body.Status === 'SUCCESS' && req.query.utm_campaign) {
      const utmObj = utmObjectFromQuery(req.query)
      res.locals.terminatedUtm = { ...utmObj, terminated: true }
    }
  }
  if (isPageRequesting(req)) {
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
          maxAge: trackingMilliseconds,
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
        })

        // pass utmObj for vuex store to use before cookie created by browser
        res.locals.utm = utmObj
      }
    } else if (cookieUtm && !cookieUtm.terminated) {
      /*
       * append utm params and redirect if cookieUtm exists and is not terminated.
       *
       * When otherObject contains url as url params value and the url holds the same utm
       * params, there will be duplicate url params after one conversion from merged object
       * to query string.
       * So we convert it again back to object to eliminate the possible
       * duplication and then convert it back to query string.
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
