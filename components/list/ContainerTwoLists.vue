<template>
  <div class="two-lists">
    <ContainerGptAd class="two-lists__ad" :pageKey="gptAdPageKey" adKey="HD" />

    <UiArticleList
      class="two-lists__list"
      :listTitle="listTitle"
      :listTitleColor="listTitleColor"
      :listData="listItemsInFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="two-lists__ad" :pageKey="gptAdPageKey" adKey="FT" />

    <UiArticleList
      v-if="shouldMountLoadmoreList"
      class="two-lists__list"
      :listData="listItemsInLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />
  </div>
</template>

<script>
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import MicroAd from '~/components/MicroAd.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'

import { MICRO_AD_UNITS } from '~/constants/ads.js'

import { processTwoLists } from '~/mixins/list.js'

export default {
  name: 'ContainerTwoLists',

  components: {
    UiArticleList,
    UiInfiniteLoading,
    MicroAd,
    ContainerGptAd,
  },

  mixins: [
    processTwoLists({
      getMaxResults() {
        return this.listMaxResults
      },

      async fetchList(page) {
        return await this.fetchList(page)
      },

      transformListItemContent(item) {
        return this.transformListItemContent?.(item) || {}
      },
    }),
  ],

  props: {
    listMaxResults: {
      type: Number,
      default: 9,
    },
    // eslint-disable-next-line vue/require-default-prop
    fetchList: {
      type: Function,
      require: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    transformListItemContent: {
      type: Function,
      require: true,
    },
    gptAdPageKey: {
      type: String,
      default: 'other',
    },
    listTitle: {
      type: String,
      default: '',
    },
    listTitleColor: {
      type: String,
      default: '#000',
    },
    shouldMountMicroAds: {
      type: Boolean,
      default: true,
    },
  },

  async fetch() {
    await this.initList()
  },

  computed: {
    microAdUnits() {
      return this.shouldMountMicroAds ? MICRO_AD_UNITS.LISTING.RWD : []
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/css/micro-ad/listing.scss';

.two-lists {
  background-color: #f2f2f2;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 0;
    margin: 0 auto;
  }

  &__ad {
    margin: 20px auto;
  }

  &__list {
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
    }
  }
}
</style>
