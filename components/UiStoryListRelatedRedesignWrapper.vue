<template>
  <div class="related-redesign">
    <h1 class="related-redesign__title title">延伸閱讀</h1>
    <UiStoryListRelatedRedesign
      class="related-redesign__list"
      :items="relateds"
      :images="relatedImages"
      @sendGa="$emit('sendGa')"
    >
      <template v-if="canAdvertise" #ads>
        <ClientOnly>
          <MicroAd
            v-for="unit in microAdUnits[device]"
            :key="unit.name"
            :unitId="unit.id"
          />

          <div id="_popIn_recommend"></div>
        </ClientOnly>
      </template>
    </UiStoryListRelatedRedesign>
  </div>
</template>

<script>
import UiStoryListRelatedRedesign from '~/components/UiStoryListRelatedRedesign.vue'
import MicroAd from '~/components/MicroAd.vue'
import { MICRO_AD_UNITS } from '~/constants/ads'

export default {
  components: {
    MicroAd,
    UiStoryListRelatedRedesign,
  },
  props: {
    relatedImages: {
      type: Array,
      default: () => [],
      required: true,
    },
    relateds: {
      type: Array,
      default: () => [],
      required: true,
    },
    canAdvertise: {
      type: Boolean,
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      microAdUnits: MICRO_AD_UNITS.STORY,
    }
  },
}
</script>

<style lang="scss" scoped>
.related-redesign {
  &__list {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 0;
    }
  }
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 150%;
  color: #054f77;
}
</style>
