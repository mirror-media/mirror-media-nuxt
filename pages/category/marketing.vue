<template>
  <section class="category">
    <ClientOnly>
      <GptAd
        class="category__ad"
        :adUnit="adTop.adUnit"
        :adSize="adTop.adSize"
      />
    </ClientOnly>

    <UiArticleList
      class="category__list"
      :listTitle="categoryTitle"
      :listTitleColor="sectionThemeColor"
      :listData="listDataFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ClientOnly>
      <GptAd
        class="category__ad"
        :adUnit="adBottom.adUnit"
        :adSize="adBottom.adSize"
      />
    </ClientOnly>

    <UiArticleList
      v-show="showListDataLoadmorePage"
      class="category__list"
      :listData="listDataLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />

    <UiStickyAd>
      <GptAd
        :adUnit="adFixedBottomMobile.adUnit"
        :adSize="adFixedBottomMobile.adSize"
      />
    </UiStickyAd>

    <ContainerFullScreenAds />
  </section>
</template>

<script>
import _ from 'lodash'
import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import gptAdUnits from '~/constants/gpt-ad-units.js'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import {
  SITE_TITLE,
  SITE_URL,
  CATEGORY_ID_MARKETING,
} from '~/constants/index.js'
import { stripHtmlTags, getStoryPath } from '~/utils/article.js'
import styleVariables from '~/scss/_variables.scss'

export default {
  name: 'Category',
  components: {
    MicroAd,
    UiArticleList,
    UiInfiniteLoading,
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
    sectionName() {
      return 'other'
    },
    sectionThemeColor() {
      return '#bcbcbc'
    },

    categoryTitle() {
      return '企劃特輯'
    },
    categoryId() {
      return CATEGORY_ID_MARKETING
    },

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

    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    adTop() {
      return gptAdUnits[this.sectionName][`${this.adDevice}_HD`] ?? {}
    },
    adBottom() {
      return gptAdUnits[this.sectionName][`${this.adDevice}_FT`] ?? {}
    },
    adFixedBottomMobile() {
      return gptAdUnits[this.sectionName].MB_ST ?? {}
    },
  },
  methods: {
    mapDataToComponentProps(item) {
      item = item || {}

      const categories = item.categories?.filter(
        (category) => category && category?.title !== this.categoryTitle
      )
      const [section = {}] = item.sections || []

      return {
        id: item.id,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: section?.title ?? categories?.[0]?.title ?? this.categoryTitle,
        imgTextBackgroundColor:
          styleVariables[`section-color-${section?.name}`] ||
          this.sectionThemeColor,
        infoTitle: item.title ?? '',
        infoDescription: stripHtmlTags(item.brief?.html ?? ''),
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

.category {
  background-color: #f2f2f2;
  padding: 36px 0;
  overflow: hidden;
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
