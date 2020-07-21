<template>
  <client-only>
    <div v-if="hasFullScreenAd" class="full-screen-ads">
      <FullScreenAd
        v-if="hasAdFirst"
        v-show="isAdFirstVisible"
        :hasDefaultStyle="true"
        :isCloseBtnVisible="isAdFirstCloseBtnVisible"
      >
        <GPTAD
          key="ad-first"
          :adUnit="globalAdUnits.MB_FULL_SCREEN_FIRST.adUnitCode"
          :adSize="globalAdUnits.MB_FULL_SCREEN_FIRST.adSize"
          @slotRequested="handleAdRequestedFirst"
          @slotRenderEnded="handleAdRenderEndedFirst"
        />
      </FullScreenAd>
      <FullScreenAd
        v-if="hasAdSecondOrThird"
        :hasModifiedStyle="hasModifiedStyle"
      >
        <GPTAD
          v-if="hasAdSecond"
          key="ad-second"
          :adUnit="globalAdUnits.MB_FULL_SCREEN_SECOND.adUnitCode"
          :adSize="globalAdUnits.MB_FULL_SCREEN_SECOND.adSize"
          @slotRenderEnded="handleAdRenderEndedSecond"
        />
        <GPTAD
          v-if="hasAdThird"
          key="ad-third"
          :adUnit="globalAdUnits.MB_FULL_SCREEN_THIRD.adUnitCode"
          :adSize="globalAdUnits.MB_FULL_SCREEN_THIRD.adSize"
          @slotRenderEnded="handleAdRenderEndedThird"
        />
      </FullScreenAd>
    </div>
  </client-only>
</template>

<script>
import FullScreenAd from '~/components/FullScreenAd.vue'
import gptUnits from '~/constants/gptUnits'

export default {
  name: 'FullScreenAds',
  components: {
    FullScreenAd,
  },
  data() {
    return {
      hasAdFirst: true,
      hasAdSecond: false,
      hasAdThird: false,
      hasModifiedStyle: true,
      isAdFirstVisible: false,
      isAdFirstCloseBtnVisible: false,
      globalAdUnits: gptUnits.global,
    }
  },
  computed: {
    hasFullScreenAd() {
      return this.hasAdFirst || this.hasAdSecond || this.hasAdThird
    },
    hasAdSecondOrThird() {
      return this.hasAdSecond || this.hasAdThird
    },
  },
  mounted() {
    // Custom event listener for AD2 Slot
    // It will be triggered when AD2 is empty
    window.addEventListener('noad2', (e) => {
      this.hasModifiedStyle = true
      this.hasAdSecond = false
      this.hasAdThird = true
    })
  },
  methods: {
    handleAdRequestedFirst(event) {
      setTimeout(() => {
        this.isAdFirstCloseBtnVisible = true
      }, 3000)
    },
    handleAdRenderEndedFirst(event) {
      this.isAdFirstVisible = true
      this.hasAdFirst = !event.isEmpty
      this.hasAdSecond = event.isEmpty
    },
    handleAdRenderEndedSecond(event) {
      this.hasModifiedStyle = false
    },
    handleAdRenderEndedThird(event) {
      this.hasModifiedStyle = false
    },
  },
}
</script>
