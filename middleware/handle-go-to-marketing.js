export default function ({ store, redirect }) {
  const isMarketingMember =
    store.state['membership-subscribe'].type === 'marketing'
  if (isMarketingMember) {
    redirect('/marketing')
  }
}
