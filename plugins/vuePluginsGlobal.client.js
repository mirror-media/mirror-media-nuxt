import Vue from 'vue'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vuelidate from 'vuelidate'
import VueObserveVisibility from 'vue-observe-visibility'
import GptAd from './gpt-ad'
import { GPT_MODE, IS_AD_DISABLE } from '~/configs/config'

export default function ({ store }) {
  Vue.use(VueAwesomeSwiper)

  Vue.use(GptAd, {
    adNetwork: '40175602',
    mode: GPT_MODE,
    isAdDisable:
      IS_AD_DISABLE || store.getters['membership-subscribe/isPremiumMember'],
  })

  Vue.use(Vuelidate)
  Vue.use(VueObserveVisibility)
}
