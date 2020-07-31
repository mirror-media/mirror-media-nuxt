<template>
  <section class="section">
    <client-only>
      <GPTAD
        class="section__ad"
        :adUnit="adTop.adUnitCode"
        :adSize="adTop.adSize"
      />
    </client-only>
    <UIArticleList
      class="section__list"
      :listTitle="'Topic'"
      :listTitleColor="'#BCBCBC'"
      :listData="listDataFirstPage"
    />
    <client-only>
      <GPTAD
        class="section__ad"
        :adUnit="adBottom.adUnitCode"
        :adSize="adBottom.adSize"
      />
    </client-only>
    <UIArticleList
      v-show="showListDataLoadmorePage"
      class="section__list"
      :listData="listDataLoadmorePage"
    />
    <UIInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />
  </section>
</template>

<script>
import UIArticleList from '~/components/UIArticleList.vue'
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import gptUnits from '~/constants/gptUnits'
import { SITE_TITLE, SITE_URL } from '~/constants'

export default {
  name: 'SectionTopic',
  components: {
    UIArticleList,
    UIInfiniteLoading,
  },
  async fetch() {
    const response = await this.fetchTopicsListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 12,
      listDataTotal: undefined,
    }
  },
  computed: {
    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },

    // Constraint which prevent loadmore unexpectly
    // if we navigating on client-side
    // due to the list data of the first page has not been loaded.
    shouldMountInfiniteLoading() {
      return this.listDataCurrentPage >= 1
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

    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    adTop() {
      return gptUnits.other[`L${this.adDevice}HD`]
    },
    adBottom() {
      return gptUnits.other[`L${this.adDevice}FT`]
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        href: item.id ? `/topic/${item.id}` : '/',
        imgSrc: item.ogImage?.image?.resizedTargets?.mobile?.url,
        imgText: undefined,
        imgTextBackgroundColor: undefined,
        infoTitle: item.name ?? '',
        infoDescription: item.brief?.html
          ? this.stripHtmlTag(item.brief?.html)
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
      this.listData.push(...listData)
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
