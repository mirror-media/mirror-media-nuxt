// this is aliased in webpack config based on server/client build
import { camelizeKeys } from 'humps'
import _ from 'lodash'
import qs from 'qs'
import { getHost } from '../util/comm'
import { CATEGORY, SECTION, TAG, TOPIC } from '../constants/index'

const superagent = require('superagent')
const _host = getHost()

function _buildQuery(params = {}) {
  let query = {}
  const whitelist = [
    'where',
    'embedded',
    'max_results',
    'page',
    'sort',
    'related',
    'clean',
    'clientInfo',
    'id',
    'keyword',
    'offset',
  ]
  whitelist.forEach((ele) => {
    if (Object.prototype.hasOwnProperty.call(params, ele)) {
      if (ele === 'where' || ele === 'embedded') {
        query[ele] = JSON.stringify(params[ele])
      } else if (ele === 'id') {
        query[ele] =
          typeof params[ele] === 'string' ? params[ele] : params[ele].join(',')
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

const debugFetch = require('debug')('FETCH')
function _doFetch(url) {
  debugFetch('PROMISE SUPERAGENT ONINE.', url)
  return superagent
    .get(url)
    .then((res) => camelizeKeys(res.body))
    .catch((err) => Promise.reject(err))
}

function _logClient(params = {}) {
  require('debug')('user-behavior-log')(
    'Prepare to send user behavior log to server, data: ',
    params
  )
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/tracking`
  url = `${url}?${query}`
  return _doFetch(url)
}

function _setupWhereInParam(key, value, params = {}) {
  params = params || {}
  value = Array.isArray(value) ? value : [value]
  const where = {}
  if (value.length > 0) {
    _.merge(where, params.where, {
      [key]: {
        $in: value,
      },
    })
  }
  params.where = where
  return params
}

function loadActivities(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/activities`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadArticles(params = {}, preview) {
  const query = _buildQuery(params)
  let url = !preview ? `${_host}/api/v2/getposts` : `${_host}/api/v2/drafts`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadArticlesGroupedList() {
  const apiHost = `${_host}/api/v2/grouped`
  return _doFetch(apiHost)
}

function loadArticlesPopList() {
  const url = `${_host}/api/v2/poplist`
  return _doFetch(url)
}

function loadArticlesByUuid(uuid = '', type = '', params = {}) {
  switch (type) {
    case SECTION:
      params = _setupWhereInParam('sections', [uuid], params)
      break
    case CATEGORY:
      params = _setupWhereInParam('categories', [uuid], params)
      break
    case TAG:
      params = _setupWhereInParam('tags', [uuid], params)
      break
    case TOPIC:
      params = _setupWhereInParam('topics', [uuid], params)
      break
    default:
      return Promise.resolve()
  }
  params.related && (params.useMetaEndpoint = true)
  params.sort = params.sort || '-publishedDate'
  let url = params.useMetaEndpoint
    ? `${_host}/api/v2/getmeta`
    : `${_host}/api/v2/getlist`
  const query = _buildQuery(params)
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadAudios(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/audios`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadCommonData(endpoints = []) {
  const mapped = _.map(endpoints, (n) => {
    return 'endpoint=' + n
  })
  const comboParams = mapped.join('&')
  let url = `${_host}/api/v2/combo?`
  url = url + comboParams
  return _doFetch(url)
}

function loadContacts(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/contacts`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadEditorChoice() {
  const url = `${_host}/api/v2/combo?endpoint=choices`
  return _doFetch(url)
}

function loadEvent(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/event`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadExternals(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/externals`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadFlashNews(params = {}) {
  const query = _buildQuery(params)
  const url = `${_host}/api/v2/posts?${query}`
  return _doFetch(url)
}

function loadImages(uuid = '', type = '', params = {}) {
  switch (type) {
    case SECTION:
      params = _setupWhereInParam('sections', [uuid], params)
      break
    case CATEGORY:
      params = _setupWhereInParam('categories', [uuid], params)
      break
    case TAG:
      params = _setupWhereInParam('tags', [uuid], params)
      break
    case TOPIC:
      params = _setupWhereInParam('topics', [uuid], params)
      break
    default:
      return Promise.resolve()
  }

  const query = _buildQuery(params)
  let url = `${_host}/api/v2/images`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadImagesById(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/images`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadImage(uuid = '') {
  const url = `${_host}/api/v2/images/${uuid}`
  return _doFetch(url)
}

function loadLatestArticle(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/getlist`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadNodes(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/nodes`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadOathPlaylist({ id, params }) {
  let url = `${_host}/api/v2/playlistng/${id}`
  if (params) {
    const query = _buildQuery(params)
    url = `${url}?${query}`
  }
  return _doFetch(url)
}

function loadOathVideo({ id, params }) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/video/${id}`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadOathVideoByPlaylist({ id, params }) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/video/playlist/${id}`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadPartners(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/partners`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadSearch(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/search`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadSectionList() {
  const url = `${_host}/api/v2/combo?endpoint=sections`
  return _doFetch(url)
}

function loadTag(slug = '') {
  const url = `${_host}/api/v2/tags/${slug}`
  return _doFetch(url)
}

function loadTimeline(slug = '') {
  const url = `${_host}/api/v2/timeline/${slug}`
  return _doFetch(url)
}

function loadTopic(params = {}) {
  const query = _buildQuery(params)
  let url = `${_host}/api/v2/topics`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadYoutubePlaylist(limit = 12, pageToken = '') {
  const url = `${_host}/api/v2/playlist?maxResults=${limit}&pageToken=${pageToken}`
  return _doFetch(url)
}

function loadWatch(name) {
  const query = _buildQuery({
    where: { name },
    max_results: 1,
    related: 'full',
  })
  return _doFetch(`${_host}/api/v2/watches?${query}`)
}

export function logClient(params = {}) {
  return _logClient(params)
}

export function fetchActivities(params = {}) {
  return loadActivities(params)
}

export function fetchArticles(params = {}, preview) {
  return loadArticles(params, preview)
}

export function fetchArticlesByUuid(
  uuid = '',
  type = '',
  params = {},
  isOnlyMeta = true
) {
  return loadArticlesByUuid(uuid, type, params, isOnlyMeta)
}

export function fetchArticlesGroupedList(params = {}) {
  return loadArticlesGroupedList(params)
}

export function fetchArticlesPopList(params = {}) {
  return loadArticlesPopList(params)
}

export function fetchAudios(params = {}) {
  return loadAudios(params)
}

export function fetchCommonData(endpoints = []) {
  return Promise.all([loadCommonData(endpoints)]).then((data) => {
    const commonData = {}
    _.map(Object.keys(_.get(data[0], ['endpoints'])), (e) => {
      commonData[e] = _.get(data[0], ['endpoints', e])
      if (e === 'sections') {
        _.forEach(_.get(data[0], ['endpoints', e, 'items']), (s) => {
          _.forEach(s.categories, (c) => {
            _.set(commonData, ['categories', c.name], c)
          })
        })
      }
    })
    return commonData
  })
}

export function fetchContacts(params = {}) {
  return loadContacts(params)
}

export function fetchEditorChoice() {
  return loadEditorChoice()
}

export function fetchEvent(params = {}) {
  return loadEvent(params)
}

export function fetchExternals(params = {}) {
  return loadExternals(params)
}

export function fetchFlashNews(params = {}) {
  return loadFlashNews(params)
}

export function fetchImage(uuid = '') {
  return loadImage(uuid)
}

export function fetchImages(uuid = '', type = '', params = {}) {
  return loadImages(uuid, type, params)
}

export function fetchImagesById(params = {}) {
  return loadImagesById(params)
}

export function fetchLatestArticle(params = {}) {
  return loadLatestArticle(params)
}

export function fetchNodes(params = {}) {
  return loadNodes(params)
}

export function fetchOathPlaylist({ id = '', params }) {
  return loadOathPlaylist({ id, params })
}

export function fetchOathVideo({ id = '', params = {} }) {
  return loadOathVideo({ id, params })
}

export function fetchOathVideoByPlaylist({ id = '', params = {} }) {
  return loadOathVideoByPlaylist({ id, params })
}

export function fetchPartners(params = {}) {
  return loadPartners(params)
}

export function fetchSearch(params = {}) {
  return loadSearch(params)
}

export function fetchSectionList() {
  return loadSectionList()
}

export function fetchTag(slug = '') {
  return loadTag(slug)
}

export function fetchTimeline(slug = '') {
  return loadTimeline(slug)
}

export function fetchTopic(params = {}) {
  return loadTopic(params)
}

export function fetchYoutubePlaylist(limit = {}, pageToken = '') {
  return loadYoutubePlaylist(limit, pageToken)
}

export function fetchWatch(name) {
  return loadWatch(name)
}
