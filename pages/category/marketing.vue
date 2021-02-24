<template>
  <section class="category">
    <ContainerList
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionName"
      :listTitle="categoryTitle"
      listTitleColor="#bcbcbc"
    />

    <UiStickyAd :pageKey="sectionName" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import ContainerList from '~/components/ContainerList.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import {
  SITE_TITLE,
  SITE_URL,
  CATEGORY_ID_MARKETING,
} from '~/constants/index.js'

export default {
  name: 'CategoryMarketing',
  components: {
    ContainerList,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  data() {
    return {
      sectionName: 'other',
      categoryTitle: '企劃特輯',
    }
  },
  methods: {
    async fetchList(page) {
      return await this.$fetchList({
        maxResults: 9,
        sort: '-publishedDate',
        categories: [CATEGORY_ID_MARKETING],
        page,
      })
    },
    transformListItemContent(item) {
      const categories = item.categories?.filter(
        (category) => category && category?.title !== this.categoryTitle
      )
      const section = item.sections?.[0] || {}

      return {
        imgText: section?.title ?? categories?.[0]?.title ?? this.categoryTitle,
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
          content: `${SITE_URL}/category/marketing`,
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
