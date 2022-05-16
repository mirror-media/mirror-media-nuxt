export default function ({ req, store, redirect }) {
  if (store.state.membership.emailVerifyFeatureToggle === 'on') {
    return
  }
  const isServicesRuleAgree = store.state['membership-subscribe'].basicInfo.tos
  if (!isServicesRuleAgree) {
    const from = req.url
    const query = from ? `?destination=${encodeURIComponent(from)}` : ''
    redirect(`/service-rule${query}`)
  }
}
