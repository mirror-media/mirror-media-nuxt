export default async function ({ store, app, redirect }) {
  try {
    const response = await app.$fetchTokenState(
      store.state.membership.userToken
    )

    const tokenState = response.tokenState ?? ''
    if (!tokenState.startsWith('OK')) {
      redirect('/login')
    }
  } catch (e) {
    console.error(e)
  }
}
