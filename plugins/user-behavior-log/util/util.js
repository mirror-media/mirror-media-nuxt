export function getAlinkHref(eventTarget) {
  if (!eventTarget) {
    return undefined
  }
  if (eventTarget.tagName === 'A') {
    return eventTarget.href
  }

  return getAlinkHref(eventTarget.parentNode)
}

export function getElementDataUserBehaviorDescription(eventTarget) {
  if (!eventTarget) {
    return undefined
  }

  if (
    Object.prototype.hasOwnProperty.call(
      eventTarget?.dataset ?? {},
      'userBehaviorDescription'
    )
  ) {
    return eventTarget.dataset.userBehaviorDescription
  }
  return getElementDataUserBehaviorDescription(eventTarget.parentNode)
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

export function truncate(text, limit = Infinity) {
  if (text.length <= limit) {
    return text
  }
  return text.substring(0, limit).concat('…')
}
