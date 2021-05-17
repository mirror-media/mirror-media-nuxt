import { shouldBypassAuthInAppWebview } from './utils'

export default function ({ req, app, store, redirect }) {
  if (shouldBypassAuthInAppWebview({ app })) {
    return
  }
  const signInProvider = store.state.membership.userSignInInfo.sign_in_provider
  if (signInProvider !== 'emailLink' && signInProvider !== 'password') {
    const from = req.url
    const query = from ? `?destination=${from}` : ''
    redirect(`/login${query}`)
  }
}
