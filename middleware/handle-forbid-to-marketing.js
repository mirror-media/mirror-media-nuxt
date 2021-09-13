export default function ({ store, redirect }) {
  const isMarketingMember =
    store.state['membership-subscribe'].basicInfo.type === 'marketing'
  if (!isMarketingMember) {
    redirect('/section/member')
  }
}
