<template>
  <div
    :id="adOptDiv"
    :style="{
      width: `${adSize[0]}px`,
      height: `${adSize[1]}px`,
    }"
  />
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    adNetwork: {
      type: String,
      default: undefined,
    },
    adUnit: {
      type: String,
      required: true,
    },
    adSize: {
      type: Array,
      required: true,
      validator(value) {
        return (
          value.length === 2 &&
          value.reduce((acc, curr) => acc && _.isFinite(curr), true)
        )
      },
    },
  },
  data() {
    return {
      adSlot: undefined,
    }
  },
  computed: {
    $adNetwork() {
      return this.adNetwork || this.adNetworkDefault
    },
    adUnitPath() {
      return `/${this.$adNetwork}/${this.adUnit}`
    },
    adOptDiv() {
      return this.adUnitPath
    },
  },
  beforeMount() {
    if (!this.$adNetwork) {
      throw new Error(
        "GPT Ad network-code not found. Please provide network-code via plugin option or component's adNetwork props, see https://developers.google.com/doubleclick-gpt/guides/get-started"
      )
    }
  },
  mounted() {
    window.googletag.cmd.push(() => {
      this.adSlot = window.googletag
        .defineSlot(this.adUnitPath, this.adSize, this.adOptDiv)
        .addService(window.googletag.pubads())
    })
    window.googletag.cmd.push(() => {
      window.googletag.display(this.adOptDiv)
    })
  },
  beforeDestroy() {
    window.googletag.cmd.push(() => {
      window.googletag.destroySlots([this.adSlot])
    })
  },
}
</script>
