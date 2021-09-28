import { shouldIdentifyMarketingByEmail } from './utils'

export default function ({ store, redirect }) {
  const isMarketingMember =
    store.state['membership-subscribe'].basicInfo.type === 'marketing' ||
    shouldIdentifyMarketingByEmail(store)
  if (isMarketingMember) {
    redirect('/marketing')
  }
}
