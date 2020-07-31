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
      :listTitle="categoryTitle"
      :listTitleColor="sectionThemeColor"
      :listData="listDataFirstPage"
    >
      <template v-for="(unitId, key) in microAdUnits" v-slot:[key]>
        <MicroAd :key="unitId" :unitId="unitId" />
      </template>
    </UIArticleList>
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
import { mapGetters } from 'vuex'
import MicroAd from '~/components/MicroAd.vue'
import UIArticleList from '~/components/UIArticleList.vue'
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import styleVariables from '~/scss/_variables.scss'
import gptUnits from '~/constants/gptUnits'
import microAdUnits from '~/constants/microAdUnits'
import { SITE_TITLE, SITE_URL } from '~/constants'

export default {
  name: 'Category',
  components: {
    MicroAd,
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
      listDataMaxResults: 12,
      listDataTotal: undefined,
      microAdUnits: microAdUnits.LISTING,
    }
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
  computed: {
    ...mapGetters({
      sectionByCategoryName: 'sections/sectionByCategoryName',
    }),

    sectionData() {
      return this.sectionByCategoryName(this.categoryName)
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
      return gptUnits?.[this.sectionId]?.[`L${this.adDevice}HD`] ?? {}
    },
    adBottom() {
      return gptUnits?.[this.sectionId]?.[`L${this.adDevice}FT`] ?? {}
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

.micro-ad {
  height: 100%;
  background-color: #f4f1e9;
  box-shadow: 5px 5px 5px #bcbcbc;
  @include media-breakpoint-up(xl) {
    transition: all 0.3s ease-in-out;
    &:hover {
      transform: translateY(-20px);
      box-shadow: 5px 15px 5px #bcbcbc;
    }
  }
  &::v-deep {
    #compass-fit-widget {
      height: 100%;
    }
    #compass-fit-widget-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
}
</style>
