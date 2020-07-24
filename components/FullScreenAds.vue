<template>
  <client-only>
    <div v-if="hasFullScreenAd" class="full-screen-ads">
      <FullScreenAd
        v-if="hasAdFirst"
        v-show="showAdFirst"
        :needDefaultStyle="true"
        :showCloseBtn="showAdFirstCloseBtn"
      >
        <GPTAD
          key="ad-first"
          :adUnit="globalAdUnits.MB_FULL_SCREEN_FIRST.adUnitCode"
          :adSize="globalAdUnits.MB_FULL_SCREEN_FIRST.adSize"
          @slotRequested="handleAdRequestedFirst"
          @slotRenderEnded="handleAdRenderEndedFirst"
        />
      </FullScreenAd>
      <FullScreenAd v-if="hasAdSecondOrThird" :needFixStyle="needFixStyle">
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
      needFixStyle: true,
      showAdFirst: false,
      showAdFirstCloseBtn: false,
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
    window.addEventListener('noad2', (e) => {
      console.log('!! noad2', e)
    })
    window.parent.addEventListener('noad2', (e) => {
      console.log('!! parent noad2', e)
    })
  },
  methods: {
    handleAdRequestedFirst(event) {
      setTimeout(() => {
        this.showAdFirstCloseBtn = true
      }, 3000)
    },
    handleAdRenderEndedFirst(event) {
      console.log('handleAdRenderEndedFirst', event)
      this.showAdFirst = true
      this.hasAdFirst = !event.isEmpty
      this.hasAdSecond = event.isEmpty
    },
    handleAdRenderEndedSecond(event) {
      console.log('handleAdRenderEndedSecond', event)
      if (!event.isEmpty) {
        this.needFixStyle = false
      }
      this.hasAdSecond = !event.isEmpty
      this.hasAdThird = event.isEmpty
    },
    handleAdRenderEndedThird(event) {
      this.hasAdThird = !event.isEmpty
      this.needFixStyle = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
