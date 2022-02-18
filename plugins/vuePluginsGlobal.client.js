import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vuelidate from 'vuelidate'
import VueObserveVisibility from 'vue-observe-visibility'
import GptAd from './gpt-ad'

import { GPT_MODE, IS_AD_DISABLE } from '~/configs/config'
import { shouldFeatureToggleOnlyOnDev } from '~/utils/feature-toggle'

export default function ({ store }) {
  Vue.use(VueAwesomeSwiper)

  const isPremiumMember =
    store.state['membership-subscribe'].basicInfo.type ===
      'subscribe_monthly' ||
    store.state['membership-subscribe'].basicInfo.type === 'subscribe_yearly'
  Vue.use(GptAd, {
    adNetwork: '40175602',
    mode: GPT_MODE,
    isAdDisable:
      IS_AD_DISABLE || (shouldFeatureToggleOnlyOnDev() && isPremiumMember),
  })

  Vue.use(Vuelidate)
  Vue.use(VueObserveVisibility)
}
