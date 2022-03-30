export default function ({ store, redirect }) {
  const isEmailVerified = store.state.membership.userEmailVerified
  if (!isEmailVerified) {
    redirect('/email-verify')
  }
}
