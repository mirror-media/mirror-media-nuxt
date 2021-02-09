<template>
  <section class="category-_name">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionId"
      :listTitle="categoryTitle"
      :listTitleColor="sectionThemeColor"
    />

    <UiWineWarning v-if="isCategoryWine" />
    <template v-else>
      <UiStickyAd :pageKey="sectionId" />
      <ContainerFullScreenAds />
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import ContainerTwoLists from '~/components/list/ContainerTwoLists.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import styleVariables from '~/scss/_variables.scss'
import { SITE_TITLE, SITE_URL } from '~/constants'

export default {
  name: 'Category',
  components: {
    ContainerTwoLists,
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
  },

  methods: {
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
        imgTextBackgroundColor: this.sectionThemeColor,
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
