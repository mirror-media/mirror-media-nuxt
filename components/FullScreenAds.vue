<template>
  <client-only>
    <div v-if="hasFullScreenAd" class="full-screen-ads">
      <FullScreenAd
        v-if="hasAdFirst"
        v-show="isAdFirstVisible"
        :hasDefaultStyle="true"
        :isClosedBtnVisible="isAdFirstClosedBtnVisible"
      >
        <GPTAD
          key="ad-first"
          :adUnit="globalAdUnits.MB_FULL_SCREEN_FIRST.adUnitCode"
          :adSize="globalAdUnits.MB_FULL_SCREEN_FIRST.adSize"
          @slotRequested="setTimerForClosedBtn"
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
          @slotRenderEnded="disableModifiedStyle"
        />
        <GPTAD
          v-if="hasAdThird"
          key="ad-third"
          :adUnit="globalAdUnits.MB_FULL_SCREEN_THIRD.adUnitCode"
          :adSize="globalAdUnits.MB_FULL_SCREEN_THIRD.adSize"
          @slotRenderEnded="disableModifiedStyle"
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
      isAdFirstClosedBtnVisible: false,
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
    window.addEventListener('noad2', function enableInnityAd() {
      this.hasModifiedStyle = true
      this.hasAdSecond = false
      this.hasAdThird = true
    })
  },
  methods: {
    setTimerForClosedBtn() {
      setTimeout(() => {
        this.isAdFirstClosedBtnVisible = true
      }, 3000)
    },
    handleAdRenderEndedFirst(event) {
      this.isAdFirstVisible = true
      this.hasAdFirst = !event.isEmpty
      this.hasAdSecond = event.isEmpty
    },
    disableModifiedStyle() {
      this.hasModifiedStyle = false
    },
  },
}
</script>
