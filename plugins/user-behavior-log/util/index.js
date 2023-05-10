import isEmpty from 'lodash/isEmpty'
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
import dayjs from '~/utils/dayjs'
import { API_PATH_FRONTEND } from '~/configs/config'
const _ = { isEmpty }

export function createUserBehaviorLog({ target = {}, ...props } = {}) {
  return {
    browser: getBrowserInfo(),
    'is-in-app-browser': isInApp(window.navigator.userAgent),
    'user-agent': window.navigator.userAgent,

    'client-os': getClientOsInfo(),

    'curr-url': window.location.href,
    datetime: dayjs.utc(Date.now()).utcOffset(8).format('YYYY.MM.DD HH:mm:ss'),

    'redirect-to': getAlinkHref(target),
    referrer: document.referrer,
    rref: getRref(target),
    'target-tag-name': target.tagName,
    'target-tag-class': target.className,
    'target-tag-id': target.id,
    'target-data-user-behavior-description':
      getElementDataUserBehaviorDescription(target),
    'target-text': truncate(getElementInnerText(target), 100),

    'target-window-size': getWindowSizeInfo(),

    'client-id': getClientId(),
    'current-runtime-start': dayjs
      .utc(Date.now())
      .utcOffset(8)
      .format('YYYY.MM.DD HH:mm:ss'),
    'session-id': getSessionId(),

    ...props,
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

export function premiumStoryInfoForLogger(context) {
  if (_.isEmpty(context?.store?.state?.['premium-story']?.story)) {
    return { story: {} }
  } else {
    const {
      heroImage: {
        image: { resizedTargets, ...remainImageInfo },
        ...remainHeroImageInfo
      },
      links,
      engineers,
      relateds,
      ...remainStoryInfo
    } = context?.store?.state?.['premium-story']?.story

    return {
      story: {
        heroImage: {
          image: { ...remainImageInfo },
          ...remainHeroImageInfo,
        },
        ...remainStoryInfo,
      },
    }
  }
}

export function getFormattedPageType(routeName) {
  switch (routeName) {
    case 'index':
      return 'index'

    case 'story-slug':
    case 'pre-story-slug':
      return 'story'

    case 'topic-id':
      return 'topic'

    case 'video-id':
      return 'video'

    case 'premium-slug':
      return 'premium-story'

    case 'section-name':
    case 'premiumsection-name':
    case 'section-member':
    case 'section-videohub':
    case 'section-topic':
      return 'section'

    case 'category-name':
    case 'category-marketing':
    case 'video_category-name':
      return 'category'

    default:
      return 'other'
  }
}
