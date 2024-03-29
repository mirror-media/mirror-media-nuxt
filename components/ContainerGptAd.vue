<template>
  <div>
    <ClientOnly>
      <div v-if="shouldOpenAd" class="container-gpt-ad">
        <GptAd
          :adUnit="adData.adUnit"
          :adSize="adData.adSize"
          :adNetwork="adNetwork"
          v-on="$listeners"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { SECTION_IDS } from '~/constants/index.js'
import gptAdUnits from '~/constants/gpt-ad-units.js'

export default {
  name: 'ContainerGptAd',

  props: {
    pageKey: {
      type: String,
      required: true,
    },
    adKey: {
      type: String,
      required: true,
    },
    adNetwork: {
      type: String,
      default: undefined,
    },
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
    shouldOpenAd() {
      if (!this.adData || !this.$store.state.canAdvertise) {
        return false
      }

      if (this.isVersionOf('MB')) {
        return !this.isDesktopWidth
      } else if (this.isVersionOf('PC')) {
        return this.isDesktopWidth
      } else {
        return true
      }
    },
    adData() {
      const data = gptAdUnits[this.pageKey]?.[this.adKeyFull]

      if (!data && this.pageKey !== SECTION_IDS.member) {
        // eslint-disable-next-line no-console
        console.error(
          `Unable to find the AD data. Got the pageKey "${this.pageKey}" and adKey "${this.adKeyFull}". Please provide a vaild pageKey or adKey.`
        )
      }

      return data
    },
    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },
    adKeyFull() {
      return this.adKey.includes('_')
        ? this.adKey
        : `${this.device}_${this.adKey}`
    },
  },

  methods: {
    isVersionOf(device) {
      return this.adKeyFull.includes(device)
    },
  },
}
</script>

<style lang="scss" scoped>
/**
 * 廣告有時會替換掉原本 <GptAd> 元件裡頭的根元素 <div>
 * 因此用 ::v-deep，並不限定所指定的元素類型（*）
 * 以確保能選擇到 .container-gpt-ad 的直接子元素
 */
.container-gpt-ad::v-deep > * {
  display: block;
  margin-left: auto;
  margin-right: auto;
  iframe {
    display: block;
  }
}
</style>
