import Vue from 'vue'
import VueLazyRenderer from 'vue-lazy-renderer'
import VueLazyload from 'vue-lazyload'

import loadingImg from '~/assets/loading.gif'
import { SITE_OG_IMG } from '~/constants/index.js'

Vue.use(VueLazyRenderer, {
  preLoad: 2,
})

Vue.use(VueLazyload, {
  preLoad: 2,
  loading: loadingImg,
  error: SITE_OG_IMG,
})
