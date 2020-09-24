import uuidv4 from 'uuid/v4'
import Cookie from 'vue-cookie'
import Bowser from 'bowser'
import dayjs from 'dayjs'

export function createUserBehaviorLog({
  eventType = 'click',
  category = '',
  target = {},
  description = '',
  referrer,
  ...rest
}) {
  return new Promise((resolve) => {
    const targ = target

    const innerText = targ.textContent
      ? targ.textContent.replace(/<\/?[^>]+(>|$)/g, '')
      : ''
    const isAlinkCheck =
      targ.tagName === 'A'
        ? { isAlink: true, href: targ.href }
        : _isAlinkDescendant(targ)

    const expRelated = /^related/g
    const expRecoommend = /^recommend/g

    const browser = Bowser.parse(window.navigator.userAgent)

    let log = {
      // keep nested and flatten properties for migration
      browser: {
        name: browser.browser.name,
        version: browser.browser.version,
      },
      'browser-name': browser.browser.name,
      'browser-version': browser.browser.version,

      category,
      'client-id': '',

      // keep nested and flatten properties for migration
      'client-os': {
        name: browser.os.name,
        version: browser.os.version,
      },
      'client-os-name': browser.os.name,
      'client-os-version': browser.os.version,

      'curr-url': window.location.href,
      datetime: dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
      description,
      'event-type': eventType,
      'redirect-to': isAlinkCheck.isAlink ? isAlinkCheck.href : undefined,
      referrer: referrer || (isAlinkCheck.isAlink ? location.href : undefined),
      rref: isAlinkCheck.isAlink
        ? expRelated.test(target.id)
          ? 'related'
          : expRecoommend.test(target.id)
          ? 'recommend'
          : undefined
        : undefined,
      'target-tag-name': targ.tagName,
      'target-tag-class': targ.className,
      'target-tag-id': targ.id,
      'target-text': truncate(innerText, 100),

      // keep nested and flatten properties for migration
      'target-window-size': {
        width:
          document.documentElement.clientWidth || document.body.clientWidth,
        height:
          document.documentElement.clientHeight || document.body.clientHeight,
      },
      'target-window-size-width':
        document.documentElement.clientWidth || document.body.clientWidth,
      'target-window-size-height':
        document.documentElement.clientHeight || document.body.clientHeight,
      ...rest,
    }

    const dt = Date.now()
    const mmidCookie = Cookie.get('mmid')
    const mmidCookieSession = Cookie.get('mmid-session')
    const clientId = mmidCookie || setMmCookie()
    const clientIdLog = { 'client-id': clientId }
    const runtimeLog = createCurrentRuntimeLog({ isNewVisitor: !mmidCookie })
    const sessionLog = createSessionLog({ isSameSession: mmidCookieSession })
    log = {
      ...log,
      ...clientIdLog,
      ...runtimeLog,
      ...sessionLog,
    }
    resolve(log)

    function createCurrentRuntimeLog({ isNewVisitor = true }) {
      const runtimeLog = createRuntimeInfo(isNewVisitor)
      return runtimeLog

      function createRuntimeInfo(isNewVisitor = true) {
        if (isNewVisitor) {
          return {
            'current-runtime-id': clientId,
            'current-runtime-start': dayjs(dt).format('YYYY.MM.DD HH:mm:ss'),
          }
        } else {
          if (!window.mmThisRuntimeClientId) {
            storeRuntimeInfo()
          }
          return {
            'current-runtime-id': window.mmThisRuntimeClientId,
            'current-runtime-start': window.mmThisRuntimeDatetimeStart,
          }
        }

        function storeRuntimeInfo({
          id = uuidv4(),
          time = dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
        } = {}) {
          window.mmThisRuntimeClientId = id
          window.mmThisRuntimeDatetimeStart = time
        }
      }
    }

    function createSessionLog({ isSameSession = false } = {}) {
      if (isSameSession) {
        return {
          'session-id': mmidCookieSession,
        }
      } else {
        const uuid = uuidv4()
        Cookie.set('mmid-session', uuid, { expires: '30m' })
        return {
          'session-id': uuid,
        }
      }
    }
  })
}

function _isAlinkDescendant(child) {
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node.tagName === 'A') {
      return { isAlink: true, href: node.href }
    }
    node = node.parentNode
  }
  return { isAlink: false, href: '' }
}

function setMmCookie() {
  const uuid = uuidv4()
  Cookie.set('mmid', uuid, { expires: 10 * 365 * 24 + 'h' })
  return uuid
}

function truncate(text, limit = Infinity) {
  if (text.length <= limit) {
    return text
  }
  return text.substring(0, limit).concat('…')
}
