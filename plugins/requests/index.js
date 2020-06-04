import { camelizeKeys } from 'humps'
import _ from 'lodash'
import axios from 'axios'
import qs from 'qs'

import { API_TIMEOUT, DOMAIN_NAME } from '~/configs/config'

function snakeCase(text) {
  if (text === 'isAudioSiteOnly') {
    return text
  }
  return _.snakeCase(text)
}

async function fetchAPIData(url) {
  try {
    const baseUrl = process.browser
      ? `//${location.host}/`
      : process.env._AXIOS_BASE_URL_
    const res = await axios.get(`${baseUrl}api${url}`)
    const data = camelizeKeys(res.data)
    const hasData =
      (data.items && data.items.length > 0) ||
      (data.endpoints && Object.keys(data.endpoints).length > 0) ||
      // properties responsed by /search api
      (data.hits && data.hits.total > 0)

    if (hasData) {
      return data
    }

    throw new FetchError('Not Found', 404)
  } catch (err) {
    const massage = err.massage || err
    const code = err.code || 500
    throw new FetchError(massage, code)
  }
}

export function buildParams(params = {}) {
  const isPureObject = _.isObject(params) && !Array.isArray(params)
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

  if (isPureObject && Object.keys(params).length > 0) {
    const paramsKey = Object.keys(params)

    if (paramsKey.includes('endpoint')) {
      return _.isArray(params.endpoint)
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

async function fetchGCSData(filename) {
  try {
    const url = `https://${DOMAIN_NAME}/json/${filename}.json`
    const { data } = await axios.get(url, { timeout: API_TIMEOUT })
    return camelizeKeys(data)
  } catch (err) {
    const message = err.response?.statusText ?? 'Not Found'
    const code = err.response?.status ?? 404
    throw new FetchError(message, code)
  }
}

class FetchError extends Error {
  constructor(message = 'Not Found', code = 404) {
    super(message)
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

  inject('fetchGrouped', () => fetchGCSData('groupe'))

  inject('fetchPopularlist', () => fetchGCSData('popularlist'))
}
