import { camelizeKeys } from 'humps'
import _ from 'lodash'
import axios from 'axios'
import qs from 'qs'

function snakeCase(text) {
  if (text === 'isAudioSiteOnly') {
    return text
  }
  return _.snakeCase(text)
}

async function axiosGet(url) {
  try {
    const baseUrl = process.browser
      ? `//${location.host}/`
      : process.env._AXIOS_BASE_URL_
    const res = await axios.get(`${baseUrl}api${url}`)
    const data = camelizeKeys(res.data)
    const hasData =
      (data.items && data.items.length > 0) ||
      (data.endpoints && Object.keys(data.endpoints).length > 0)

    if (hasData) {
      return data
    }

    const e = new Error()
    e.massage = 'Not Found'
    e.code = '404'
    throw e
  } catch (error) {
    const e = new Error()
    e.massage = error.massage || error
    e.code = error.code || '500'
    throw e
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

export default ({ app }, inject) => {
  inject('fetchActivities', (params) =>
    axiosGet(`/activities${buildParams(params)}`)
  )

  inject('fetchCombo', (params) => axiosGet(`/combo${buildParams(params)}`))

  inject('fetchContacts', (params) =>
    axiosGet(`/contacts${buildParams(params)}`)
  )

  inject('fetchEvent', (params) => axiosGet(`/event${buildParams(params)}`))

  inject('fetchExternals', (params) =>
    axiosGet(`/externals${buildParams(params)}`)
  )

  inject('fetchImages', (params) => axiosGet(`/images${buildParams(params)}`))

  inject('fetchList', (params) => axiosGet(`/getlist${buildParams(params)}`))

  inject('fetchNodes', (params) => axiosGet(`/nodes${buildParams(params)}`))

  inject('fetchPartners', (params) =>
    axiosGet(`/partners${buildParams(params)}`)
  )

  inject('fetchPoplist', () => axiosGet(`/poplist`))

  inject('fetchPosts', (params) => axiosGet(`/getposts${buildParams(params)}`))

  inject('fetchSearch', (params) => axiosGet(`/search${buildParams(params)}`))

  inject('fetchTag', (id) => axiosGet(`/tags/${id}`))

  inject('fetchTimeline', (id) => axiosGet(`/timeline/${id}`))

  inject('fetchTopics', (params) => axiosGet(`/topics${buildParams(params)}`))

  inject('fetchWatches', (params) => axiosGet(`/watches${buildParams(params)}`))
}
