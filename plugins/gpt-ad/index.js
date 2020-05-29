import GPTAD from './index.vue'
import { insertGPTScript } from './util'

let isGPTScriptInserted = false
const GPTAdSlotsDefined = {}

export default {
  install(Vue, options = {}) {
    Vue.prototype.$setGPTAdSlotsDefined = function (key, value) {
      GPTAdSlotsDefined[key] = value
    }
    Vue.prototype.$getGPTAdSlotsDefined = function (key) {
      return GPTAdSlotsDefined[key]
    }

    let Component = Vue.extend(GPTAD)
    Component = Component.extend({
      beforeMount() {
        if (!isGPTScriptInserted) {
          insertGPTScript()
          isGPTScriptInserted = true
          window.googletag = window.googletag || {}
          window.googletag.cmd = window.googletag.cmd || []
        }

        window.googletag.cmd.push(() => {
          /*
           * Do not use lazy loading with SRA.
           *
           * With lazy loading in SRA,
           * GPT will fetching multiple ads at the same time,
           * which cause the call for the first ad and all other ad slots is made.
           * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_enableSingleRequest
           */
          // window.googletag.pubads().enableSingleRequest()

          window.googletag.pubads().enableLazyLoad({
            // Fetch slots within 1.5 viewports.
            fetchMarginPercent: 150,
            // Render slots within 1 viewports.
            renderMarginPercent: 100,
            // Double the above values on mobile, where viewports are smaller
            // and users tend to scroll faster.
            mobileScaling: 2.0,
          })
          window.googletag.pubads().collapseEmptyDivs()
          window.googletag.enableServices()
        })
      },
    })

    if (options.adNetwork) {
      Component = Component.extend({
        data() {
          return {
            adNetworkDefault: options.adNetwork,
          }
        },
      })
    }

    Vue.component('GPTAD', Component)
  },
}
