export function getAlinkHref(eventTarget) {
  if (!eventTarget) {
    return undefined
  }
  if (eventTarget.tagName === 'A') {
    return eventTarget.href
  }

  return getAlinkHref(eventTarget.parentNode)
}

export function isElementAlink(eventTarget) {
  if (!eventTarget) {
    return false
  }
  if (eventTarget.tagName === 'A') {
    return true
  }
  return isElementAlink(eventTarget.parentNode)
}
