<template>
  <section class="category-_name">
    <!--    <PagePremiumCategory v-if="isCurrentCategoryPremium($route, $store)" />-->
    <!--    <template v-else>-->
    <ContainerList
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionId"
      :listTitle="categoryTitle"
      :listTitleColor="sectionColor"
    />

    <UiWineWarning v-if="isCategoryWine" />
    <template v-else>
      <UiStickyAd :pageKey="sectionId" />
      <ContainerFullScreenAds />
    </template>
    <!--    </template>-->
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

// import PagePremiumCategory from '../premiumcategory/_name.vue'
import ContainerList from '~/components/ContainerList.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_URL } from '~/constants'
import { getSectionColor } from '~/utils/index.js'

/*
 * function isCurrentCategoryPremium(route, store) {
 *   return (store?.getters?.['sections-member/categories'] ?? []).some(
 *     function compareCategoryName(category) {
 *       return category.name === route.params.name
 *     }
 *   )
 * }
 */

export default {
  name: 'Category',

  /*
   * layout({ route, store }) {
   *   if (isCurrentCategoryPremium(route, store)) {
   *     return 'premium'
   *   }
   *
   *   return 'default'
   * },
   */

  components: {
    // PagePremiumCategory,

    ContainerList,
    UiWineWarning,
    ContainerFullScreenAds,
    UiStickyAd,
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
    sectionColor() {
      return getSectionColor(this.sectionName)
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
      return this.categoryName === 'wine' || this.categoryName === 'wine1'
    },
  },

  methods: {
    // isCurrentCategoryPremium,
    async fetchList(page) {
      return await this.$fetchList({
        maxResults: 9,
        sort: '-publishedDate',
        categories: [this.categoryId],
        page,
      })
    },
    transformListItemContent() {
      return {
        imgText: this.sectionTitle,
        imgTextBackgroundColor: this.sectionColor,
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
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/category/${this.categoryName}`,
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
