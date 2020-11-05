import { camelizeKeys } from 'humps'
import _ from 'lodash'
import axios from 'axios'
import qs from 'qs'

import { ENV, API_TIMEOUT, DOMAIN_NAME } from '~/configs/config.js'

const baseUrl = process.browser
  ? `//${location.host}/`
  : process.env._AXIOS_BASE_URL_

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

async function fetchAPIData(url) {
  try {
    const res = await axios.get(`${baseUrl}api${url}`)
    const data = camelizeKeys(res.data)
    const hasData =
      (data.items && data.items.length > 0) ||
      (data.endpoints && Object.keys(data.endpoints).length > 0) ||
      (data.hits && data.hits.total > 0) || // properties responsed by /search api
      (url.startsWith('/tags') && data.id)

    if (hasData) {
      return data
    }

    throw new FetchError('Not Found', 404)
  } catch (err) {
    const massage = err.massage || err
    const code = err.code || 500
    throw new FetchError(massage, code, url)
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
      apiUrl = `https://${DOMAIN_NAME}/json/${filename}.json`
      ;({ data = {} } = await axios.get(apiUrl, { timeout: API_TIMEOUT }))
    } else {
      // 由於 CORS 的問題，不能直接在 browser 端打 api（除了生產環境），而是必須透過前端 server 去打
      apiUrl = `${baseUrl}api/gcs/${filename}`
      ;({ data = {} } = await axios.get(apiUrl))
    }

    return camelizeKeys(data)
  } catch (err) {
    const message = err.response?.statusText ?? 'Not Found'
    const code = err.response?.status ?? 404

    throw new FetchError(message, code, apiUrl)
  }
}

class FetchError extends Error {
  constructor(message = 'Not Found', code = 404, url) {
    const errorMessage = `${message}, url: ${url}`
    super(errorMessage)
    this.name = this.constructor.name
    this.code = code
  }
}

export default (context, inject) => {
  inject('fetchActivities', (params) =>
    fetchAPIData(`/activities${buildParams(params)}`)
  )

  inject('fetchCombo', (params) => fetchAPIData(`/combo${buildParams(params)}`))

  inject('fetchContacts', (params) =>
    fetchAPIData(`/contacts${buildParams(params)}`)
  )

  inject('fetchCulturePosts', (params, isPreview = false) => {
    let endpoint = 'cultureposts'
    if (isPreview) {
      endpoint = 'culturepreview'
    }
    return fetchAPIData(`/${endpoint}${buildParams(params)}`)
  })

  inject('fetchEvent', (params) => fetchAPIData(`/event${buildParams(params)}`))

  inject('fetchExternals', (params) =>
    fetchAPIData(`/externals${buildParams(params)}`)
  )

  inject('fetchImages', (params) =>
    fetchAPIData(`/images${buildParams(params)}`)
  )

  inject('fetchList', (params) =>
    fetchAPIData(`/getlist${buildParams(params)}`)
  )

  inject('fetchNodes', (params) => fetchAPIData(`/nodes${buildParams(params)}`))

  inject('fetchPartners', (params) =>
    fetchAPIData(`/partners${buildParams(params)}`)
  )

  inject('fetchPosts', (params) =>
    fetchAPIData(`/getposts${buildParams(params)}`)
  )

  inject('fetchSearch', (params) =>
    fetchAPIData(`/search${buildParams(params)}`)
  )

  inject('fetchTag', (id) => fetchAPIData(`/tags/${id}`))

  inject('fetchTimeline', (id) => fetchAPIData(`/timeline/${id}`))

  inject('fetchTopics', (params) =>
    fetchAPIData(`/topics${buildParams(params)}`)
  )

  inject('fetchWatches', (params) =>
    fetchAPIData(`/watches${buildParams(params)}`)
  )

  inject('fetchYoutubeChannels', (params) =>
    fetchAPIData(`/youtube/channels${buildYoutubeParams(params)}`)
  )

  inject('fetchYoutubePlaylistItems', (params) =>
    fetchAPIData(`/youtube/playlistItems${buildYoutubeParams(params)}`)
  )

  inject('fetchYoutubeSearch', (params) =>
    fetchAPIData(`/youtube/search${buildYoutubeParams(params)}`)
  )

  inject('fetchYoutubeVideos', (params) =>
    fetchAPIData(`/youtube/videos${buildYoutubeParams(params)}`)
  )

  inject('fetchGrouped', () => fetchGcsData('grouped'))

  inject('fetchPopular', () => fetchGcsData('popularlist'))
}
