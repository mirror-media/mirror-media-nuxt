export default function ({ req, store, redirect }) {
  const signInProvider = store.state.membership.userSignInInfo.sign_in_provider
  if (signInProvider !== 'emailLink' && signInProvider !== 'password') {
    const from = req.url
    const query = from ? `?destination=${from}` : ''
    redirect(`/login${query}`)
  }
}
