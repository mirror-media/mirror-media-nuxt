export function shouldBypassAuthInAppWebview({ app } = {}) {
  if (!app) {
    return false
  }

  // workaround of bypass the auth, in the iOS in-app browser environment
  return process.server && app.$ua.browser() === 'Webview'
}

export function shouldIdentifyMarketingByEmail(store) {
  const isVerified = store.state.membership.userEmailVerified
  const email = store.state.membership.userEmail
  return isVerified && isEmailDomainMirrorMedia(email)
}

function isEmailDomainMirrorMedia(email) {
  return [
    'mnews.tw',
    'mnews.com.tw',
    'mirrormedia.mg',
    'mirrorfiction.com',
  ].some(function checkEmailDomain(domain) {
    return email.endsWith(`@${domain}`)
  })
}
