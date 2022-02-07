import { ENV } from '~/configs/config'

export function shouldFeatureToggleOnlyOnDev() {
  return ENV === 'local' || ENV === 'dev'
}
