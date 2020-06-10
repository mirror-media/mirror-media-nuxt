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
      :listTitle="currentCategoryTitle"
      :listTitleColor="currentSectionThemeColor"
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
import { mapState } from 'vuex'
import UIArticleList from '~/components/UIArticleList.vue'
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import styleVariables from '~/scss/_variables.scss'
import gptUnits from '~/constants/gptUnits'

export default {
  name: 'Category',
  components: {
    UIArticleList,
    UIInfiniteLoading,
  },
  async fetch() {
    const response = await this.fetchCategoryListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
    }
  },
  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    categories() {
      return this.sections.map((section) => section.categories).flat()
    },

    currentSectionData() {
      return (
        this.sections.find((section) =>
          section.categories
            .map((category) => category.name)
            .find((name) => name === this.currentCategoryName)
        ) ?? {}
      )
    },
    currentSectionName() {
      return this.currentSectionData.name
    },
    currentSectionThemeColor() {
      const key = `section-color-${this.currentSectionName}`
      return styleVariables[key]
    },
    currentSectionId() {
      return this.currentSectionData.id
    },
    currentSectionTitle() {
      return this.currentSectionData.title
    },

    currentCategoryName() {
      return this.$route.params.name
    },
    currentCategoryData() {
      return (
        this.categories.find(
          (category) => category.name === this.currentCategoryName
        ) ?? {}
      )
    },
    currentCategoryTitle() {
      return this.currentCategoryData.title
    },
    currentCategoryId() {
      return this.currentCategoryData.id
    },

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
      return gptUnits?.[this.currentSectionId]?.[`L${this.adDevice}HD`] ?? {}
    },
    adBottom() {
      return gptUnits?.[this.currentSectionId]?.[`L${this.adDevice}FT`] ?? {}
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        href: item.slug ? `/story/${item.slug}` : '/',
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: this.currentSectionTitle,
        imgTextBackgroundColor: this.currentSectionThemeColor,
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief?.html ?? ''),
      }
    },
    async fetchCategoryListing({ page = 1 } = {}) {
      const response = await this.$fetchList({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        categories: [this.currentCategoryId],
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
        const response = await this.fetchCategoryListing({
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
