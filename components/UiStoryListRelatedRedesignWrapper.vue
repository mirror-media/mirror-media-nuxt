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
            class="micro-ad-redesign"
            :unitId="unit.id"
          />

          <!-- popIn ad is not available for a/b test, because styles are not customizable-->
          <!-- <div id="_popIn_recommend"></div> -->
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

.micro-ad-redesign {
  @include media-breakpoint-up(md) {
    margin: 16px 0 0 0;
    height: 90px;
  }
  & + & {
    margin: 12px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 16px 0 0 0;
    }
  }
  @include media-breakpoint-up(md) {
    width: calc((100% - 25px) / 2);
  }

  &::v-deep {
    #compass-fit-widget-content {
      display: flex;
      figure {
        width: 90px;
        height: 90px;
        position: relative;
        @include media-breakpoint-up(xl) {
          width: 135px;
        }

        a {
          display: block;
          width: 90px;
          height: 90px;
          @include media-breakpoint-up(xl) {
            width: 135px;
          }
        }
        img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          @include media-breakpoint-up(xl) {
            width: 135px;
          }
        }
        .pop_item--colorBlock {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 36px;
          height: 22px;
          background-color: #bcbcbc;
          color: white;
          font-weight: 300;
          font-size: 14px;
          line-height: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .pop_item_title {
        background-color: white !important;
        margin: 0 0 0 16px;
        font-size: 16px;
        line-height: 150%;
        color: #4a4a4a;
        a {
          display: block;
          height: 100%;
        }
      }
    }

    // reset
    .popListVert-list__item {
      position: relative;
    }
    .popListVert-list__item--text {
      & > div {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 36px;
        height: 22px;
        background-color: #bcbcbc;
        color: white;
        font-weight: 300;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      & > h2 {
        margin: 0 0 0 16px;
        font-size: 16px;
        line-height: 150%;
        color: #4a4a4a;
        height: 100%;
        a {
          font-weight: 400 !important;
          display: block;
          height: 100%;
        }
      }
    }
    .popListVert-list__item--img img {
      width: 135px;
      min-width: 135px;
      height: 90px;
      object-fit: cover;
    }
    .popListVert-list__item {
      display: flex;
    }
  }
}
</style>
