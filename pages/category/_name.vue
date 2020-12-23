<template>
  <section class="section">
    <client-only>
      <GptAd
        class="section__ad"
        :adUnit="adTop.adUnit"
        :adSize="adTop.adSize"
      />
    </client-only>
    <UiArticleList
      class="section__list"
      :listTitle="categoryTitle"
      :listTitleColor="sectionThemeColor"
      :listData="listDataFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>
    <client-only>
      <GptAd
        class="section__ad"
        :adUnit="adBottom.adUnit"
        :adSize="adBottom.adSize"
      />
    </client-only>
    <UiArticleList
      v-show="showListDataLoadmorePage"
      class="section__list"
      :listData="listDataLoadmorePage"
    />
    <UiInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />

    <UiWineWarning v-if="isCategoryWine" />

    <UiStickyAd v-if="!isCategoryWine">
      <GptAd
        :adUnit="adFixedBottomMobile.adUnit"
        :adSize="adFixedBottomMobile.adSize"
      />
    </UiStickyAd>

    <ContainerFullScreenAds v-if="!isCategoryWine" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import styleVariables from '~/scss/_variables.scss'
import gptAdUnits from '~/constants/gpt-ad-units.js'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_URL } from '~/constants'
import { getStoryPath } from '~/utils/article'

export default {
  name: 'Category',
  components: {
    MicroAd,
    UiArticleList,
    UiInfiniteLoading,
    UiWineWarning,
    ContainerFullScreenAds,
    UiStickyAd,
  },
  async fetch() {
    const response = await this.fetchCategoryListing({ page: 1 })
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
    ...mapGetters({
      getSectionByCategoryName: 'sections/getSectionByCategoryName',
    }),

    sectionData() {
      return this.getSectionByCategoryName(this.categoryName)
    },
    sectionName() {
      return this.sectionData.name
    },
    sectionThemeColor() {
      const key = `section-color-${this.sectionName}`
      return styleVariables[key]
    },
    sectionId() {
      return this.sectionData.id
    },
    sectionTitle() {
      return this.sectionData.title
    },

    categoryName() {
      return this.$route.params.name
    },
    categoryData() {
      return (
        this.sectionData.categories.find((category) => {
          return this.categoryName === category.name
        }) ?? {}
      )
    },
    categoryTitle() {
      return this.categoryData.title
    },
    categoryId() {
      return this.categoryData.id
    },
    isCategoryWine() {
      return this.categoryName === 'wine'
    },

    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },

    /**
     * Constraint which prevent loadmore unexpectly
     * if we navigating on client-side
     * due to the list data of the first page has not been loaded.
     */
    shouldMountInfiniteLoading() {
      return this.listDataCurrentPage >= 1
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

    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    adTop() {
      return gptAdUnits?.[this.sectionId]?.[`${this.adDevice}_HD`] ?? {}
    },
    adBottom() {
      return gptAdUnits?.[this.sectionId]?.[`${this.adDevice}_FT`] ?? {}
    },
    adFixedBottomMobile() {
      return gptAdUnits?.[this.sectionId]?.['MB_ST'] ?? {}
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: this.sectionTitle,
        imgTextBackgroundColor: this.sectionThemeColor,
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief?.html ?? ''),
      }
    },
    async fetchCategoryListing({ page = 1 } = {}) {
      const response = await this.$fetchList({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        categories: [this.categoryId],
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
  head() {
    const title = `${this.categoryTitle} - ${SITE_TITLE}`
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
          content: `${SITE_URL}/category/${this.$route.params.name}`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.sectionName,
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
