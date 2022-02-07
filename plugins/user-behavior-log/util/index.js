import dayjs from 'dayjs'
import getBrowserInfo from './browser'
import getClientOsInfo from './client-os'
import {
  getElementDataUserBehaviorDescription,
  getAlinkHref,
  truncate,
} from './util'
import getWindowSizeInfo from './window-size'
import getElementInnerText from './inner-text'
import getClientId from './client-id'
import getSessionId from './session-id'
import getRref from './rref'
import isInApp from './is-in-app-browser'
import { API_PATH_FRONTEND } from '~/configs/config'

export function createUserBehaviorLog({ target = {} } = {}) {
  return {
    browser: getBrowserInfo(),
    'is-in-app-browser': isInApp(window.navigator.userAgent),

    'client-os': getClientOsInfo(),

    'curr-url': window.location.href,
    datetime: dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),

    'redirect-to': getAlinkHref(target),
    referrer: document.referrer,
    rref: getRref(target),
    'target-tag-name': target.tagName,
    'target-tag-class': target.className,
    'target-tag-id': target.id,
    'target-data-user-behavior-description': getElementDataUserBehaviorDescription(
      target
    ),
    'target-text': truncate(getElementInnerText(target), 100),

    'target-window-size': getWindowSizeInfo(),

    'client-id': getClientId(),
    'current-runtime-id': getClientId(),
    'current-runtime-start': dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
    'session-id': getSessionId(),
  }
}

export function sendLog(log) {
  const blob = new Blob([JSON.stringify({ clientInfo: log })], {
    type: 'application/json; charset=UTF-8',
  })
  navigator.sendBeacon(`/${API_PATH_FRONTEND}/tracking`, blob)
}

export function isScrollToBottom() {
  const totalPageHeight = document.body.scrollHeight
  const scrollPoint = window.scrollY + window.innerHeight
  return scrollPoint >= totalPageHeight
}
