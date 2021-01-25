export default async function ({ req, store, app, redirect }) {
  if (process.server && app.$ua.browser() === 'Webview') {
    return
  }
  const token = store.state.membership.userToken
  const email = store.state.membership.userEmail
  try {
    const response = await app.$fetchTokenState(token)

    const tokenState = response.tokenState ?? ''
    if (!tokenState.startsWith('OK')) {
      console.log(
        `[authenticate] ${req.url} with token: ${token}, email: ${email} is not OK, redirect to login page`
      )
      redirect('/login')
    }
  } catch (e) {
    console.log(
      `[authenticate] ${req.url} with token: ${token}, email: ${email} encounter error`
    )
    console.error(e)
  }
}
