import Vue from 'vue'
import VueLazyRenderer from 'vue-lazy-renderer'
import VueLazyload from 'vue-lazyload'

import loadingImg from '~/assets/loading.gif'

Vue.use(VueLazyRenderer, {
  preLoad: 2,
})

Vue.use(VueLazyload, {
  preLoad: 2,
  loading: loadingImg,
})
