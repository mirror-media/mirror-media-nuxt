import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import loading from '~/assets/loading.gif'

Vue.use(VueLazyload, {
  loading,
  lazyComponent: true,
})
