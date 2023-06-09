import * as firebaseAdmin from 'firebase-admin'
import { shouldBypassAuthInAppWebview } from './utils'

export default async function ({ req, store, app, redirect }) {
  if (shouldBypassAuthInAppWebview({ app })) {
    return
  }

  let token = store.state.membership.userToken
  let email = store.state.membership.userEmail

  if (!token || !email) {
    /*
     * In some suitation, there is no userToken data in Vuex store,
     * so we need to fallback to use firebase-admin with authorization header to retrieve user data
     */

    try {
      const authToken = req?.headers?.authorization?.split(' ')[1]

      if (authToken) {
        const user = await firebaseAdmin.auth().verifyIdToken(authToken)

        token = token ?? authToken
        email = email ?? user?.email
      }
    } catch (err) {
      console.error(err)
    }
  }

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
