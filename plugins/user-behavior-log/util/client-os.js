import Bowser from 'bowser'

export default function getClientOsInfo() {
  const browser = Bowser.parse(window.navigator.userAgent)
  return {
    name: browser.os.name,
    version: browser.os.version,
  }
}
