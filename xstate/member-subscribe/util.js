import { ENV } from '~/configs/config'

export function isMemberSubscribeFeatureToggled(route) {
  const _route = route.value ?? route
  return (ENV === 'local' || ENV === 'dev') && Boolean(_route.query.ms)
}
