import Bowser from 'bowser'

export default function getBrowserInfo() {
  const browser = Bowser.parse(window.navigator.userAgent)
  return {
    name: browser.browser.name,
    version: browser.browser.version,
  }
}
