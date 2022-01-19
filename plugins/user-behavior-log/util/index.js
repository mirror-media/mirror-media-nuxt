import dayjs from 'dayjs'
import getBrowserInfo from './browser'
import getClientOsInfo from './client-os'
import { getAlinkHref, isElementAlink } from './util'
import getWindowSizeInfo from './window-size'
import getElementInnerText from './inner-text'
import getClientId from './client-id'
import getSessionId from './session-id'
import getRref from './rref'

export function createUserBehaviorLog({
  eventType = 'click',
  category = '',
  target = {},
  description = '',
  referrer,
  ...rest
}) {
  return new Promise((resolve) => {
    resolve({
      // keep nested and flatten properties for migration
      browser: getBrowserInfo(),

      category,

      // keep nested and flatten properties for migration
      'client-os': getClientOsInfo(),

      'curr-url': window.location.href,
      datetime: dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
      description,
      'event-type': eventType,

      'redirect-to': getAlinkHref(target),
      referrer:
        referrer || (isElementAlink(target) ? location.href : undefined),
      rref: getRref(target),
      'target-tag-name': target.tagName,
      'target-tag-class': target.className,
      'target-tag-id': target.id,
      'target-text': truncate(getElementInnerText(target), 100),

      // keep nested and flatten properties for migration
      'target-window-size': getWindowSizeInfo(),

      'client-id': getClientId(),
      'current-runtime-id': getClientId(),
      'current-runtime-start': dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
      'session-id': getSessionId(),

      ...rest,
    })
  })
}

function truncate(text, limit = Infinity) {
  if (text.length <= limit) {
    return text
  }
  return text.substring(0, limit).concat('…')
}
