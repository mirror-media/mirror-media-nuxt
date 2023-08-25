import { camelizeKeys } from 'humps'
import _ from 'lodash'
import axios from 'axios'
import qs from 'qs'
import {
  getUserFirebaseId,
  getFirebaseToken,
  getMemberDetailData,
  getMemberServiceRuleStatus,
  setMemberServiceRuleStatusToTrue,
  cancelMemberSubscription,
  getMemberType,
  getPaymentDataOfSubscription,
  getMemberOneTimeSubscriptions,
  getMemberOneTimeSubscriptionsK6,
  getSubscriptionPayments,
  getMemberShipStatus,
  getPremiumMemberSubscriptionInfo,
  updateSubscriptionFromMonthToYear,
  isMemberPaidSubscriptionWithMobile,
  updateSubscriptionNote,
} from '~/utils/memberSubscription'

import { ENV, API_PATH_FRONTEND } from '~/configs/config.js'

const baseUrl = process.browser
  ? `//${location.host}/`
  : 'http://localhost:3000/'

function isPureObject(params) {
  return _.isObject(params) && !Array.isArray(params)
}

function snakeCase(text) {
  const doNotTransform = ['isAudioSiteOnly', 'isFeatured', 'eventType']

  if (doNotTransform.includes(text)) {
    return text
  }
  return _.snakeCase(text)
}

async function fetchApiData(url, fromMembershipGateway = false, token) {
  const urlFetched = fromMembershipGateway
    ? `${baseUrl}${API_PATH_FRONTEND}/membership/v0${url}`
    : `${baseUrl}${API_PATH_FRONTEND}${url}`
  const requestConfig =
    fromMembershipGateway && token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null

  let res = {}

  try {
    res = (await axios.get(urlFetched, requestConfig)) || {}
  } catch (err) {
    const { statusText = 'Internal Server Error', status = 500 } =
      err.response || {}

    throw new FetchError({
      message: statusText,
      statusCode: status,
      url: urlFetched,
    })
  }

  const data = camelizeKeys(fromMembershipGateway ? res?.data?.data : res?.data)
  const hasData =
    data.items?.length > 0 ||
    Object.keys(data.endpoints || {}).length > 0 ||
    data.hits?.total?.value > 0 || // properties response by /search api
    (url.startsWith('/tags') && data.id) ||
    (url.startsWith('/topics') && data.id)

  if (hasData) {
    return fromMembershipGateway
      ? { ...data, tokenState: res?.data?.tokenState }
      : data
  }
}

export function buildParams(params = {}) {
  const firstTier = [
    'endpoint',
    'maxResults',
    'page',
    'sort',
    'clean',
    'related',
    'keyword',

    // queries used by /search api
    'keywords',
    'section',
  ]

  if (isPureObject(params) && Object.keys(params).length > 0) {
    const paramsKey = Object.keys(params)

    if (paramsKey.includes('endpoint')) {
      return Array.isArray(params.endpoint)
        ? `?${params.endpoint
            .map((endpoint) => `endpoint=${endpoint}`)
            .join('&')}`
        : `?endpoint=${params.endpoint}`
    }

    const queryParams = {}

    paramsKey.forEach((param) => {
      if (firstTier.some((key) => key === param)) {
        queryParams[snakeCase(param)] = params[param]
      } else if (param === '$or') {
        // handle _.snakeCase filter $ character
        _.set(queryParams, 'where.$or', params[param])
      } else if (param === 'id' && Array.isArray(params[param])) {
        // handle id with array type need convert to tr-project-rest format _id.$in
        _.set(queryParams, 'where._id.$in', params[param])
      } else if (param === 'id') {
        // handle id need convert to tr-project-rest format _id
        _.set(queryParams, 'where._id', params[param])
      } else if (Array.isArray(params[param])) {
        _.set(queryParams, `where.${snakeCase(param)}.$in`, params[param])
      } else if (param === 'magazineType') {
        _.set(queryParams, `where.type.$in`, [params[param]])
      } else {
        _.set(queryParams, `where.${snakeCase(param)}`, params[param])
      }
    })

    if (queryParams.where) {
      queryParams.where = JSON.stringify(queryParams.where)
    }
    return `?${qs.stringify(queryParams)}`
  }
  return ''
}

export function buildYoutubeParams(params = {}) {
  if (isPureObject(params) && Object.keys(params).length > 0) {
    const queryParams = Object.keys(params)
      .map((key) => {
        if (Array.isArray(params[key])) {
          return params[key].map((value) => `${key}=${value}`).join('&')
        }
        return `${key}=${params[key]}`
      })
      .join('&')
    return `?${queryParams}`
  }
  return ''
}

async function fetchGcsData(filename) {
  let apiUrl

  try {
    let data

    if (ENV === 'prod' || !process.browser) {
      // not set timeout to prevent exceed timeout at client side,
      apiUrl = `https://statics.mirrormedia.mg/json/${filename}.json`
      ;({ data = {} } = await axios.get(apiUrl))
    } else {
      // 由於 CORS 的問題，不能直接在 browser 端打 api（除了生產環境），而是必須透過前端 server 去打
      apiUrl = `${baseUrl}${API_PATH_FRONTEND}/gcs/${filename}`
      ;({ data = {} } = await axios.get(apiUrl))
    }

    return camelizeKeys(data)
  } catch (err) {
    const { statusText = 'Internal Server Error', status = 500 } =
      err.response || {}

    throw new FetchError({
      message: statusText,
      statusCode: status,
      url: apiUrl,
    })
  }
}

async function fetchGcsGroupData(filename) {
  let apiUrl

  try {
    let data

    const isStagingOrProd = ENV === 'prod' || ENV === 'staging'
    const path = isStagingOrProd ? 'json' : 'dev'

    if (ENV === 'prod' || !process.browser) {
      // not set timeout to prevent exceed timeout at client side,
      apiUrl = `https://statics.mirrormedia.mg/${path}/${filename}.json`
      ;({ data = {} } = await axios.get(apiUrl))
    } else {
      // 由於 CORS 的問題，不能直接在 browser 端打 api（除了生產環境），而是必須透過前端 server 去打
      apiUrl = `${baseUrl}${API_PATH_FRONTEND}/grouped-gcs/${filename}`
      ;({ data = {} } = await axios.get(apiUrl))
    }

    return camelizeKeys(data)
  } catch (err) {
    const { statusText = 'Internal Server Error', status = 500 } =
      err.response || {}

    throw new FetchError({
      message: statusText,
      statusCode: status,
      url: apiUrl,
    })
  }
}

class FetchError extends Error {
  constructor({ message = 'Not Found', statusCode = 404, url }) {
    super(`${message}; statusCode=${statusCode}, url=${url}`)

    Error.captureStackTrace?.(this, FetchError)

    this.name = 'FetchError'
    this.statusCode = statusCode
    this.url = url
  }
}

export default (context, inject) => {
  inject('fetchActivities', (params) =>
    fetchApiData(`/activities${buildParams(params)}`)
  )

  inject('fetchCombo', (params) => fetchApiData(`/combo${buildParams(params)}`))

  inject('fetchContacts', (params) =>
    fetchApiData(`/contacts${buildParams(params)}`)
  )

  inject('fetchEvent', (params) => fetchApiData(`/event${buildParams(params)}`))

  inject('fetchExternals', (params) => {
    return fetchApiData(`/externals${buildParams(params)}`)
  })

  inject('fetchImages', (params) =>
    fetchApiData(`/images${buildParams(params)}`)
  )

  inject('fetchList', (params) =>
    fetchApiData(`/getlist${buildParams(params)}`)
  )

  inject('fetchNodes', (params) => fetchApiData(`/nodes${buildParams(params)}`))

  inject('fetchPartners', (params) =>
    fetchApiData(`/partners${buildParams(params)}`)
  )

  /*
   * inject('fetchPosts', (params) =>
   *   fetchApiData(`/getposts${buildParams(params)}`)
   * )
   */
  inject('fetchPostsFromMembershipGateway', (params, token) =>
    fetchApiData(`/getposts${buildParams(params)}`, true, token)
  )
  inject('fetchStoryFromMembershipGateway', (params) =>
    fetchApiData(`/story${buildParams(params)}`, true, null)
  )

  /*
   * In order to reduce the duplicated requests below in story/premium page
   * 1. fetchStoryFromMembershipGateway request in handle-story-premium-redirect middleware
   * 2. fetchStoryFromMembershipGateway request in fetch() hook in premium/_slug.vue and story/_slug.vue
   * We use hashmap to store the story data
   */
  inject('fetchStoryFromMembershipGatewayMap', new Map())
  inject('fetchStoryFromMembershipGateway', async (params) => {
    const map = context.app.$fetchStoryFromMembershipGatewayMap
    const paramsString = buildParams(params)
    if (map.has(paramsString)) {
      return map.get(paramsString)
    } else {
      const data = await fetchApiData(`/story${paramsString}`, true, null)
      map.set(paramsString, data)
      return data
    }
  })

  inject('fetchDrafts', (params) =>
    fetchApiData(`/drafts${buildParams(params)}`)
  )

  inject('fetchSearch', (params) =>
    fetchApiData(`/search${buildParams(params)}`)
  )

  inject('fetchTag', (id) => fetchApiData(`/tags/${id}`))
  inject('fetchTags', (params) => fetchApiData(`/tags${buildParams(params)}`))

  inject('fetchTimeline', (id) => fetchApiData(`/timeline/${id}`))

  inject('fetchTopics', (params) =>
    fetchApiData(`/topics${buildParams(params)}`)
  )
  inject('fetchTopic', (id) => fetchApiData(`/topics/${id}`))

  inject('fetchWatches', (params) =>
    fetchApiData(`/watches${buildParams(params)}`)
  )

  inject('fetchYoutubeChannels', (params) =>
    fetchApiData(`/youtube/channels${buildYoutubeParams(params)}`)
  )

  inject('fetchYoutubePlaylistItems', (params) =>
    fetchApiData(`/youtube/playlistItems${buildYoutubeParams(params)}`)
  )

  inject('fetchYoutubeSearch', (params) =>
    fetchApiData(`/youtube/search${buildYoutubeParams(params)}`)
  )

  inject('fetchYoutubeVideos', (params) =>
    fetchApiData(`/youtube/videos${buildYoutubeParams(params)}`)
  )

  inject('fetchMagazines', (params) =>
    fetchApiData(`/magazines${buildParams(params)}`)
  )

  inject('fetchGrouped', () => fetchGcsData('grouped'))

  inject('fetchGroupedWithExternal', (filename) => fetchGcsGroupData(filename))

  inject('fetchPopular', () => fetchGcsData('popularlist'))

  inject('fetchHeadersNew', () => fetchGcsData('headers_new'))
  inject('fetchMemberSections', () => fetchGcsData('member_sections'))

  inject('fetchMemberSectionsArticles', () =>
    fetchGcsData('membersections_articles')
  )

  inject('fetchTokenState', async (token) => {
    const urlFetched = `${baseUrl}${API_PATH_FRONTEND}/membership/v1/tokenState`
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.get(urlFetched, requestConfig)
      return camelizeKeys(res.data)
    } catch (err) {
      const { statusText = 'Internal Server Error', status = 500 } =
        err.response || {}

      throw new FetchError({
        message: statusText,
        statusCode: status,
        url: urlFetched,
      })
    }
  })

  inject('getMemberDetailData', async () => {
    return await getMemberDetailData(context)
  })
  inject('getMemberServiceRuleStatus', async () => {
    return await getMemberServiceRuleStatus(context)
  })
  inject('setMemberServiceRuleStatusToTrue', async () => {
    return await setMemberServiceRuleStatusToTrue(context)
  })
  inject('cancelMemberSubscription', async (reason) => {
    return await cancelMemberSubscription(context, reason)
  })
  inject('getMemberType', async () => {
    return await getMemberType(context)
  })
  inject('getPaymentDataOfSubscription', async (gateWayPayload) => {
    return await getPaymentDataOfSubscription(context, gateWayPayload)
  })
  inject('getMemberOneTimeSubscriptions', async (gateWayPayload) => {
    return await getMemberOneTimeSubscriptions(context, gateWayPayload)
  })
  inject('getMemberOneTimeSubscriptionsK6', async (gateWayPayload) => {
    return await getMemberOneTimeSubscriptionsK6(context, gateWayPayload)
  })
  inject('getSubscriptionPayments', async (gateWayPayload) => {
    return await getSubscriptionPayments(context, gateWayPayload)
  })
  inject('getMemberShipStatus', async (memberShipStatusName) => {
    return await getMemberShipStatus(context, memberShipStatusName)
  })
  inject('getPremiumMemberSubscriptionInfo', async (gateWayPayload) => {
    return await getPremiumMemberSubscriptionInfo(context, gateWayPayload)
  })
  inject('updateSubscriptionFromMonthToYear', async (subscriptionId) => {
    return await updateSubscriptionFromMonthToYear(context, subscriptionId)
  })
  inject('updateSubscriptionNote', async (subscriptionId, note) => {
    return await updateSubscriptionNote(context, subscriptionId, note)
  })
  inject('isMemberPaidSubscriptionWithMobile', async () => {
    return await isMemberPaidSubscriptionWithMobile(context)
  })
  inject('getUserFirebaseId', () => {
    return getUserFirebaseId(context)
  })
  inject('getFirebaseToken', () => {
    return getFirebaseToken(context)
  })
}
