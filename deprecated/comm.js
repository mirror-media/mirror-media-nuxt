/**
 * 注意：
 * 此份檔案絕大部分是直接從舊專案 plate-vue 搬過來，並未重構，內容也可能有錯
 * 未來若想使用相關功能，請找可信賴並有持續在維護的第三方套件
 */

function getClientOS() {
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

function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls
  }

  ele.className = trim(ele.className)
}

function hasClass(ele, cls) {
  if (ele.className) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  } else {
    ele.className = cls
    return true
  }
}

function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

export { getClientOS, addClass }
