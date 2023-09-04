<template>
  <div class="article-gallery">
    <ul>
      <template v-for="(item, index) in items">
        <UiArticleGalleryItem
          v-show="showItem(index)"
          :key="item.id || microAdUnits[item.idx].name"
          :item="item"
          :index="index"
          :isPremiumMember="isPremiumMember"
          :showTopFive="showTopFive"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import UiArticleGalleryItem from './UiArticleGalleryItem.vue'

import { MICRO_AD_UNITS } from '~/constants/ads.js'

export default {
  name: 'UiArticleGallery',

  components: {
    UiArticleGalleryItem,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    isPremiumMember: {
      type: Boolean,
      default: false,
      required: true,
    },
    showTopFive: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },
    microAdUnits() {
      return MICRO_AD_UNITS.HOME[this.device]
    },
  },

  methods: {
    showItem(index) {
      return index >= 5 || this.showTopFive
    },
  },
}
</script>

<style lang="scss" scoped>
$font-size--base: 19.2px;
$font-size--base--xl: 16px;

.article-gallery {
  color: #8c8c8c;
  font-size: $font-size--base;
  @include media-breakpoint-up(xl) {
    font-size: $font-size--base--xl;
  }
}

ul {
  @include media-breakpoint-up(xl) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}

.hidden {
  display: none;
}
</style>
