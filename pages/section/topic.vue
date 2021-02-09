<template>
  <section class="section">
    <ContainerGptAd class="section__ad" pageKey="other" adKey="HD" />

    <UiArticleList
      class="section__list"
      :listTitle="'Topic'"
      :listTitleColor="'#BCBCBC'"
      :listData="listDataFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="section__ad" pageKey="other" adKey="FT" />

    <UiArticleList
      v-show="showListDataLoadmorePage"
      class="section__list"
      :listData="listDataLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />
    <UiStickyAd>
      <ContainerGptAd pageKey="other" adKey="MB_ST" />
    </UiStickyAd>
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import _ from 'lodash'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import MicroAd from '~/components/MicroAd.vue'
import { SITE_TITLE, SITE_URL } from '~/constants'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { stripHtmlTags } from '~/utils/article.js'

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
  async fetch() {
    const response = await this.fetchTopicsListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData_: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
      microAdUnits: MICRO_AD_UNITS.LISTING.RWD,
    }
  },
  computed: {
    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },

    listData() {
      return _.uniqBy(this.listData_, function identifyDuplicatedItemById(
        listItem
      ) {
        return listItem.id
      })
    },
    listDataFirstPage() {
      return this.listData.slice(0, this.listDataMaxResults)
    },
    listDataLoadmorePage() {
      return this.listData.slice(this.listDataMaxResults, Infinity)
    },
    showListDataLoadmorePage() {
      return this.listDataLoadmorePage.length > 0
    },
  },
  methods: {
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        href: item.id ? `/topic/${item.id}` : '/',
        imgSrc: item.ogImage?.image?.resizedTargets?.mobile?.url,
        imgText: undefined,
        imgTextBackgroundColor: undefined,
        infoTitle: item.name ?? '',
        infoDescription: item.brief?.html
          ? stripHtmlTags(item.brief?.html)
          : item.ogDescription,
      }
    },
    async fetchTopicsListing({ page = 1 } = {}) {
      const response = await this.$fetchTopics({
        maxResults: this.listDataMaxResults,
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData_.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.meta?.total ?? 0
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchTopicsListing({
          page: this.listDataCurrentPage,
        })
        this.setListData(response)

        if (this.listDataCurrentPage >= this.listDataPageLimit) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (e) {
        $state.error()
      }
    },
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
