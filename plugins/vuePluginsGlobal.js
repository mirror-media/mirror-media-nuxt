import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import Vuelidate from 'vuelidate'
import loadingImg from '~/assets/loading.gif'

Vue.use(VueLazyload, {
  loading: loadingImg,
  lazyComponent: true,
})
Vue.use(Vuelidate)
