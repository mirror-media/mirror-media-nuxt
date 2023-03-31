<template>
  <div class="list" :class="{ 'list--premium': isPremiumMember }">
    <ContainerGptAd
      class="ad"
      :class="{ 'ad--premium': isPremiumMember }"
      :pageKey="gptAdPageKey"
      adKey="HD"
    />

    <UiArticleList
      class="article-list"
      :listTitle="listTitle"
      :listTitleColor="listTitleColor"
      :listItems="listItemsInFirstPage"
      :isTagPage="isTagPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="ad" :pageKey="gptAdPageKey" adKey="FT" />

    <template v-if="shouldLoadmore">
      <UiArticleList
        class="article-list"
        :listItems="listItemsInLoadmorePage"
      />
      <UiInfiniteLoading @infinite="infiniteHandler" />
    </template>
  </div>
</template>

<script>
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import MicroAd from '~/components/MicroAd.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'

import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { removeArticleWithExternalLink } from '~/utils/index'
import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore.js'

export default {
  name: 'ContainerList',

  components: {
    UiArticleList,
    UiInfiniteLoading,
    MicroAd,
    ContainerGptAd,
  },

  mixins: [
    fetchListAndLoadmore({
      maxResults() {
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
    isTagPage: {
      type: Boolean,
      default: false,
    },
  },

  async fetch() {
    await this.initList()
  },

  computed: {
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
    listItemsAfterRedirect() {
      return this.listItems.map((item) => {
        return {
          ...item,
          href: this.getHref(item, this.isPremiumMember),
        }
      })
    },
    listItemsInFirstPage() {
      return removeArticleWithExternalLink(this.listItemsAfterRedirect).slice(
        0,
        this.maxResults
      )
    },
    listItemsInLoadmorePage() {
      if (
        this.$config.warmlifeFeatureToggle &&
        this.$route.params?.name === 'warmlife'
      ) {
        return removeArticleWithExternalLink(this.listItemsAfterRedirect).slice(
          this.maxResults,
          this.nowPage * this.maxResults
        )
      }
      return removeArticleWithExternalLink(this.listItemsAfterRedirect).slice(
        this.maxResults,
        Infinity
      )
    },
    microAdUnits() {
      return this.shouldMountMicroAds && !this.isPremiumMember
        ? MICRO_AD_UNITS.LISTING.RWD
        : []
    },
  },
  methods: {
    getHref(item, isPremiumMember = false) {
      const { href } = item
      if (href.split('/')[1] === 'story' && isPremiumMember) {
        return '/pre' + href
      }
      return href
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/css/micro-ad/listing.scss';

.list {
  background-color: #f2f2f2;
  padding: 36px 0;
  overflow: hidden;
  &--premium {
    padding: 16px 0;
  }
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 0;
    margin: 0 auto;
  }
}

.ad {
  margin: 20px auto;
  &--premium {
    margin: 0;
  }
}

.article-list {
  @include media-breakpoint-up(md) {
    margin: 8px 0 0 0;
  }
}
</style>
