import { shouldBypassAuthInAppWebview } from './utils'

export default async function ({ req, store, app, redirect }) {
  if (shouldBypassAuthInAppWebview({ app })) {
    return
  }
  const token = store.state.membership.userToken
  const email = store.state.membership.userEmail
  try {
    const response = await app.$fetchTokenState(token)

    const tokenState = response.tokenState ?? ''
    const from = req.url
    if (!tokenState.startsWith('OK')) {
      console.log(
        `[authenticate] ${from} with token: ${token}, email: ${email} is not OK, redirect to login page`
      )
      const query = from ? `?destination=${encodeURIComponent(from)}` : ''
      redirect(`/login${query}`)
    }
  } catch (e) {
    console.log(
      `[authenticate] ${req.url} with token: ${token}, email: ${email} encounter error`
    )
    console.error(e)
  }
}
