import Vue from 'vue'

export default ({ app: { store, router } }, inject) => {
  inject(
    'customRouter',
    Vue.observable({
      push: (path, queryObject) => {
        router.push(
          path + store.getters['utm-url-params/getUtmQueryString'](queryObject)
        )
      },
      replace: (path, queryObject) => {
        router.replace(
          path + store.getters['utm-url-params/getUtmQueryString'](queryObject)
        )
      },
      back: () => {
        router.back()
      },
    })
  )
}
