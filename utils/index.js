// Example: [0, -0, 0n, '', null, undefined, NaN].filter(isTruthy) will return []
function isTruthy(val) {
  return val
}

// Example: removePrefix('/section/news', '/section/') will return 'news'
function removePrefix(str = '', prefix = '') {
  return str.slice(prefix.length)
}

export { isTruthy, removePrefix }
