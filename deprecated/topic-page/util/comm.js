import _ from 'lodash'
import Bowser from 'bowser'
import Cookie from 'vue-cookie'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'
import uuidv4 from 'uuid/v4'
import { SITE_DOMAIN, SITE_URL, SITE_PROJ_URL } from '../constants'
import dayjs from '~/utils/dayjs'

const debug = require('debug')('CLIENT:comm')

export function getArticleReadTime(paragraphs = []) {
  // deprecated
  const REGEX_ONLY_CHINESE = /[\u4E00-\u9FFF]+/g
  const REGEX_NOT_EN_AND_NUMBER = /([^A-Za-z0-9])/g

  const WPM_ENGLISH = 265
  const WPM_CHINESE = 250

  const textContents = Array.isArray(paragraphs) ? paragraphs : []
  const textContentsFiltered = textContents
    .filter((paragraph) => paragraph.type === 'unstyled')
    .filter((paragraph) => paragraph.content[0].trim())
    .map((paragraph) => paragraph.content[0])

  let min = 0
  if (textContentsFiltered.length > 0) {
    const combined = textContentsFiltered.join(' ')
    const countChinese = combined.match(REGEX_ONLY_CHINESE).join('').length
    const countEnglishAndNumber = combined
      .replace(REGEX_ONLY_CHINESE, ' ')
      .replace(REGEX_NOT_EN_AND_NUMBER, ' ')
      .split(' ')
      .filter((word) => word).length
    const readTime = Math.round(
      countChinese / WPM_CHINESE + countEnglishAndNumber / WPM_ENGLISH
    )
    min = readTime > 0 ? readTime : 1
  }
  return min
}

export function getAuthor(article, option = '', delimiter = '｜') {
  const writers =
    _.get(article, ['writers', 'length'], 0) > 0
      ? `文${delimiter}` +
        _.map(article.writers, (n) => {
          return (
            '<a href="' +
            getAuthorHref(n) +
            '" id="author-' +
            n.id +
            '">' +
            _.get(n, ['name'], null) +
            '</a>'
          )
        }).join('、')
      : ''
  const photographers =
    _.get(article, ['photographers', 'length'], 0) > 0
      ? `<br>攝影${delimiter}` +
        _.map(article.photographers, (n) => {
          return _.get(n, ['name'], null)
        }).join('、')
      : ''
  const designers =
    _.get(article, ['designers', 'length'], 0) > 0
      ? `<br>設計${delimiter}` +
        _.map(article.designers, (n) => {
          return _.get(n, ['name'], null)
        }).join('、')
      : ''
  const engineers =
    _.get(article, ['engineers', 'length'], 0) > 0
      ? `<br>工程${delimiter}` +
        _.map(article.engineers, (n) => {
          return _.get(n, ['name'], null)
        }).join('、')
      : ''
  const external = '<br>' + _.get(article, 'extendByline', '')
  switch (option) {
    case 'writers':
      return writers
    default:
      return writers + photographers + designers + engineers + external
  }
}

export function getAuthorHref(author = {}) {
  return '/author/' + author.id
}

export function getBrief(article, count = 30, allowedTags = []) {
  const metaBrief = _.get(article, 'brief')
  let brief = _.isString(metaBrief)
    ? metaBrief
    : _.get(article, 'brief.html') || _.get(article, ['ogDescription']) || ''
  brief = sanitizeHtml(brief, { allowedTags })
  return truncate(brief, count)
}

export function getHref(relAritlcle = {}, isAppPage = false) {
  const { name, partner, style = '', slug } = relAritlcle

  if (partner) {
    return `/external/${name}`
  }

  switch (style) {
    case 'campaign':
      return `/campaigns/${slug}/index.html`
    case 'projects':
      return `/projects/${slug}/index.html`
    default:
      /*
       * if (_.split(href, '/')[1] === 'topic') {
       *   return href
       * } else {
       */
      return isAppPage ? `/app/${slug}/` : `/story/${slug}/`

    // }
  }
}

export function getHrefFull(relAritlcle = {}, isAppPage = false) {
  const { style = '', slug } = relAritlcle
  switch (style) {
    case 'campaign':
      return `${SITE_URL}/campaigns/${slug}/index.html`
    case 'projects':
      return `${SITE_URL}/projects/${slug}/index.html`
    case 'readr':
      return `${SITE_PROJ_URL}/project/${slug}`
    default:
      /*
       * if (_.split(href, '/')[1] === 'topic') {
       *   return href
       * } else {
       */
      return isAppPage
        ? `${SITE_URL}/app/${slug}/`
        : `${SITE_URL}/story/${slug}/`

    // }
  }
}

export function getImage(article, size) {
  if (article.partner) {
    return article.thumb
  }

  let image

  if (!article) {
    return '/deprecated/topic-page/assets/mirrormedia/notImage.png'
  }

  if (article.heroImage) {
    debug('get heroimage')
    image = article.heroImage.image
      ? _.get(article, ['heroImage', 'image', 'resizedTargets'])
      : _.get(article, 'heroImage')
  } else if (article.ogImage) {
    debug('get ogImage')
    image = _.get(article, ['ogImage', 'image', 'resizedTargets'])
  } else if (
    article.heroVideo &&
    article.heroVideo.coverPhoto &&
    article.heroVideo.coverPhoto.image
  ) {
    debug('get heroVideo img')
    image = _.get(article, [
      'heroVideo',
      'coverPhoto',
      'image',
      'resizedTargets',
    ])
  }
  switch (size) {
    case 'desktop':
      return _.get(
        image,
        ['desktop', 'url'],
        '/deprecated/topic-page/assets/mirrormedia/notImage.png'
      )
    case 'mobile':
      return _.get(
        image,
        ['mobile', 'url'],
        '/deprecated/topic-page/assets/mirrormedia/notImage.png'
      )
    case 'tablet':
      return _.get(
        image,
        ['tablet', 'url'],
        '/deprecated/topic-page/assets/mirrormedia/notImage.png'
      )
    case 'tiny':
      return _.get(
        image,
        ['tiny', 'url'],
        '/deprecated/topic-page/assets/mirrormedia/notImage.png'
      )
    default:
      return _.get(
        image,
        ['desktop', 'url'],
        '/deprecated/topic-page/assets/mirrormedia/notImage.png'
      )
  }
}

export function getSection(article) {
  switch (_.get(article, ['style'])) {
    case 'article':
      return _.get(article, 'sections[0].name') || ''
    case 'projects':
      return 'projects'
    default:
      return 'other'
  }
}

export function shareLine({ title, route }) {
  window.open(
    `https://line.naver.jp/R/msg/text/?${encodeURIComponent(
      title
    )}%0D%0A${encodeURIComponent(SITE_URL + route)}`
  )
}

export function shareFacebook({ route, shared }) {
  window.open(`https://www.facebook.com/share.php?u=${SITE_URL}${route}`)
  shared && shared()
}

export function getTruncatedVal(oVal, count) {
  // considered deprecated
  return truncate(oVal, count)
}

export function getValue(o = {}, p = [], d = '') {
  // considered deprecated
  return _.get(o, p, d)
}

export function getHost() {
  const browser = typeof window !== 'undefined'
  if (browser) {
    return `//${location.host}`
  } else {
    const host = process.env.HOST || 'localhost'
    const port = parseInt(process.env.PORT) || 3000
    return `${host}:${port}`
  }
}

export function lockJS() {
  if (process.env.VUE_ENV === 'client') {
    document.oncontextmenu = function () {
      return false
    }
    document.onkeydown = function (event) {
      if (event.keyCode === 67) {
        return false
      }
    }
    document.ondragstart = function () {
      return false
    }
    document.onselectstart = function () {
      return false
    }
  }
}

export function unLockJS() {
  if (process.env.VUE_ENV === 'client') {
    document.oncontextmenu = function () {
      return true
    }
    document.onkeydown = function (event) {
      if (event.keyCode === 67) {
        return true
      }
    }
    document.ondragstart = function () {
      return true
    }
    document.onselectstart = function () {
      return true
    }
  }
}

export function consoleLogOnDev({ msg }) {
  if (currEnv() === 'dev') {
    console.log(msg)
  }
}

export function currEnv() {
  if (process.env.VUE_ENV === 'client') {
    if (
      location.host.indexOf(SITE_DOMAIN) === 0 ||
      location.host.indexOf(`www.${SITE_DOMAIN}`) === 0 ||
      location.host.indexOf(`m.${SITE_DOMAIN}`) === 0
    ) {
      return 'prod'
    } else {
      return 'dev'
    }
  }
}

export function enableScroll() {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', preventDefault, false)
  }
  window.onmousewheel = document.onmousewheel = null
  window.onwheel = null
  window.ontouchmove = null
  document.onkeydown = null
}
function preventDefault(e) {
  e = e || window.event
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.returnValue = false
}

/*
 *  constructing and sending req to api to log client's behaviors through following functions:
 *    getClientOS()
 *    mmLog()
 *    _isAlinkDescendant()
 *    _normalizeLog()
 */

export function getClientOS() {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = null

  if (macosPlatforms.includes(platform)) {
    os = 'Mac OS'
  } else if (iosPlatforms.includes(platform)) {
    os = 'iOS'
  } else if (windowsPlatforms.includes(platform)) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }
  return os
}

export function mmLog({
  category,
  eventType,
  target,
  description,
  referrer,
  ...rest
}) {
  return _normalizeLog({
    category,
    eventType,
    target,
    description,
    referrer,
    ...rest,
  })
}

export function sendGaClickEvent(eventCategory, eventLabel) {
  this.$ga &&
    this.$ga.event({
      eventCategory,
      eventAction: 'click',
      eventLabel,
    })
}

export function isEleFixed(ele) {
  let node = ele

  while (node !== null && node !== undefined && node !== document) {
    const position = node.currentStyle
      ? node.currentStyle.position
      : window.getComputedStyle(node, null).position
    if (position === 'fixed') {
      return true
    }
    node = node.parentNode
  }
  return false
}

export function isEleShown(ele) {
  let node = ele

  while (node !== null && node !== undefined && node !== document) {
    const display = node.currentStyle
      ? node.currentStyle.display
      : window.getComputedStyle(node, null).display
    if (display === 'none') {
      return false
    }
    node = node.parentNode
  }
  return true
}

export function isDescendant(child, { classname = 'none' }) {
  // deprecated
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node.className && node.className.includes(classname)) {
      return true
    }
    node = node.parentNode
  }
  return false
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

function _normalizeLog({
  eventType = 'click',
  category = '',
  target = {},
  description = '',
  referrer,
  ...rest
}) {
  return new Promise((resolve) => {
    const targ = target

    const clientOs = getClientOS()
    const innerText = targ.textContent
      ? sanitizeHtml(targ.textContent, { allowedTags: [''] })
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
        name: clientOs,
        version: browser.os.osversion,
      },
      'client-os-name': clientOs,
      'client-os-version': browser.os.osversion,

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

export function setMmCookie() {
  const uuid = uuidv4()
  Cookie.set('mmid', uuid, { expires: 10 * 365 * 24 + 'h' })
  return uuid
}

export function insertMicroAd({ adId, currEnv, vm }) {
  if (process.env.VUE_ENV === 'client' && !vm.microAdLoded) {
    const _lgyLw = document.createElement('script')
    _lgyLw.onload = () => {
      currEnv === 'dev' && console.log('microad', adId, 'loaded')
      vm.microAdLoded = true
    }
    _lgyLw.type = 'text/javascript'
    _lgyLw.charset = 'UTF-8'
    _lgyLw.async = true
    _lgyLw.src =
      (document.location.protocol === 'https:' ? 'https://' : 'http://') +
      `nt.compass-fit.jp/lift_widget.js?adspot_id=${adId}`
    const _lgyLw0 = document.getElementsByTagName('script')[0]
    _lgyLw0.parentNode.insertBefore(_lgyLw, _lgyLw0)
  }
}

export function insertPopInAdScript() {
  if (process.env.VUE_ENV === 'client') {
    const hasScript = document.querySelector('#js-pop-in')
    if (!hasScript) {
      const pa = document.createElement('script')
      pa.id = 'js-pop-in'
      pa.type = 'text/javascript'
      pa.charset = 'utf-8'
      pa.async = true
      pa.src =
        window.location.protocol + '//api.popin.cc/searchbox/mirrormedia_tw.js'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(pa, s)
    }
  }
}

/*
 * Vpon ad is abandoned 20180810 BY KC
 * export function insertVponAdSDK ({ isVponSDKLoaded = false }) {
 *   if (process.env.VUE_ENV === 'client' && isVponSDKLoaded === false) {
 *     const script = document.createElement('script')
 *     script.type = 'text/javascript'
 *     script.src = '//m.vpon.com/sdk/vpadn-sdk.js'
 *     document.body.appendChild(script)
 *   }
 *   return true
 * }
 */

export function trim(str) {
  // considered deprecated
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls
  }
  ele.className = trim(ele.className)
}

export function hasClass(ele, cls) {
  if (ele.className) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  } else {
    ele.className = cls
    return true
  }
}

export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
  ele.className = trim(ele.className)
}

/*
 * Vpon ad is abandoned 20180810 BY KC
 * export function vponHtml () {
 *   const mode = _.get(VPON_CONFIG, [ 'vpon_ad_test' ], '1')
 *   const key = _.get(VPON_CONFIG, [ 'vpon_ad_licensy_key' ], '')
 *   const format = _.get(VPON_CONFIG, [ 'vpon_ad_format' ], 'mi')
 *   const debug = _.get(VPON_CONFIG, [ 'debug' ], true)
 *   return `<vpon vpon_ad_test="${mode}" vpon_ad_licensy_key="${key}" vpon_ad_format="${format}" debug="${debug}"></vpon>`
 * }
 */

export function updateCookie({ currEnv }) {
  return new Promise((resolve) => {
    const cookie = Cookie.get('visited')
    if (currEnv === 'prod' && !cookie) {
      // Cookie.set('visited', 'true', { expires: '3m' })
    }
    resolve(cookie === 'true')
  })
}

export function sendAdCoverGA(label) {
  window &&
    window.ga &&
    window.ga('send', 'event', 'mobile-ad', 'visible', label, {
      location: document.location.href,
      nonInteraction: true,
    })
}

export function extractSlugFromReferrer(referrer = '') {
  const filteredReferrer = referrer
    .replace(/^https?:\/\//, '')
    .replace(/\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|[\]/\\]*$/, '')
  const referrerArr = filteredReferrer.split('/')
  if (
    (referrerArr[0].includes(SITE_DOMAIN) ||
      referrerArr[0].includes('localhost')) &&
    referrerArr[1] === 'story'
  ) {
    return referrerArr[2]
  } else {
    return 'N/A'
  }
}

export function checkMob() {
  let check = false
  if (typeof navigator !== 'undefined') {
    ;(function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
          a.substr(0, 4)
        )
      )
        check = true
    })(navigator.userAgent || navigator.vendor || window.opera)
  }
  return check
}

export function debounce(fn, wait) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, wait)
  }
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  const mq = function (query) {
    return window.matchMedia(query).matches
  }
  if ('ontouchstart' in window || window.DocumentTouch) {
    // && document instanceof DocumentTouch
    return true
  }
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}
