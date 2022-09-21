/**
 * Client Side Only!
 * Get cookie object by key and translate into query string together
 * with other query string object.
 * @param {string} cookieKey
 * @param {{}} otherObject
 * @returns {string} queryString
 */
export function queryStringFromCookieObject(cookieKey, otherObject = {}) {
  const queryObject = { ...otherObject, ...getCookieObject(cookieKey) }
  return objectToQueryString(queryObject)
}

/**
 * turn queryObject key value pair into query string format
 * @param {{}} object
 * @returns {string} queryString
 */
export function objectToQueryString(object) {
  if (!Object.keys(object).length) {
    return ''
  }

  const queryString =
    '?' +
    Object.entries(object)
      .map((keyValArr) => keyValArr.join('='))
      .join('&')
  return queryString
}

/**
 * turn query string into object format
 * @param {string} queryString
 * @returns {{}} queryObject
 */
export function queryStringToObject(queryString) {
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

/**
 * Client Side Only!
 * Get cookie by key and process the key value string to object.
 * return null if object can't be generated
 * @param {string} key
 * @returns {{}?} cookieObject
 */
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

/**
 * Return utm related object from all queries
 * @param {{}} query
 * @returns {{}}
 */
export function utmObjectFromQuery(query) {
  const utmObjs = {}
  Object.keys(query)
    .filter((key) => key.includes('utm'))
    .forEach((key) => (utmObjs[key] = query[key]))
  return utmObjs
}
