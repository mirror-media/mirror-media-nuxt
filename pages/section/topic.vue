<template>
  <section class="section">
    <ContainerGptAd class="section__ad" pageKey="other" adKey="HD" />

    <UiArticleList
      class="section__list"
      :listTitle="'Topic'"
      :listTitleColor="'#BCBCBC'"
      :listData="listItemsInFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="section__ad" pageKey="other" adKey="FT" />

    <UiArticleList
      v-if="shouldMountLoadmoreList"
      class="section__list"
      :listData="listItemsInLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />

    <UiStickyAd pageKey="other" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import MicroAd from '~/components/MicroAd.vue'

import { processTwoLists } from '~/mixins/list.js'

import { SITE_TITLE, SITE_URL } from '~/constants'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { stripHtmlTags } from '~/utils/article.js'

const LIST_MAX_RESULTS = 9

export default {
  name: 'SectionTopic',
  components: {
    UiArticleList,
    UiInfiniteLoading,
    ContainerGptAd,
    ContainerFullScreenAds,
    UiStickyAd,
    MicroAd,
  },

  mixins: [
    processTwoLists({
      maxResults: LIST_MAX_RESULTS,

      async fetchList(page) {
        return await this.$fetchTopics({
          maxResults: LIST_MAX_RESULTS,
          page,
        })
      },

      transformListItemContent(item = {}) {
        return {
          href: item.id ? `/topic/${item.id}` : '/',
          imgSrc: item.ogImage?.image?.resizedTargets?.mobile?.url,
          infoTitle: item.name ?? '',
          infoDescription:
            stripHtmlTags(item.brief?.html ?? '') || (item.ogDescription ?? ''),
        }
      },
    }),
  ],

  async fetch() {
    await this.initList()
  },

  data() {
    return {
      microAdUnits: MICRO_AD_UNITS.LISTING.RWD,
    }
  },

  head() {
    const title = `Topic - ${SITE_TITLE}`
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/section/topic`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: 'other',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/css/micro-ad/listing.scss';

.section {
  background-color: #f2f2f2;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 0;
    margin: auto;
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
