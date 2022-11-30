import { Frequency } from '~/constants/common'

export default function ({ store, redirect, route }) {
  const isEmailVerified = store.state.membership?.userEmailVerified

  const userEmail = store.state.membership?.userEmail

  //  If Facebook authUser has no email, userEmail will be null
  const isSubscribeOneTime = route.query.plan === Frequency.OneTimeHyphen

  /*
   *  If user is logged in by facebook account, then check which email has been verified,
   *  if not, redirect to email-verify page.
   */
  if (!userEmail && !isEmailVerified) {
    redirect('/email-verify')
  }

  /*
   *  If user is not logged in by facebook account, then check subscribe plan is one time or not,
   *  if not, then check which email has been verified, if which is not verified, then redirect to email-verify page.
   *  if user just subscribe one-time, then no need to check has verified or redirect to email-verify page.
   */
  if (userEmail && !isSubscribeOneTime && !isEmailVerified) {
    redirect('/email-verify')
  }
}
