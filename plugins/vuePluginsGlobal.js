import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import GPTAD from './gpt-ad'
import loading from '~/assets/loading.gif'

Vue.use(GPTAD)

Vue.use(VueLazyload, {
  loading,
})
