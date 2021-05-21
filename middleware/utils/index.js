export function shouldBypassAuthInAppWebview({ app } = {}) {
  if (!app) {
    return false
  }

  // workaround of bypass the auth, in the iOS in-app browser environment
  return process.server && app.$ua.browser() === 'Webview'
}
