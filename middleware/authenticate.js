export default async function ({ req, store, app, redirect }) {
  const token = store.state.membership.userToken
  const email = store.state.membership.userEmail
  const from = req.url

  try {
    const response = await app.$fetchTokenState(token)

    const tokenState = response.tokenState ?? ''
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

    const query = from ? `?destination=${encodeURIComponent(from)}` : ''
    redirect(`/login${query}`)
  }
}
