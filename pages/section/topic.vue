<template>
  <section class="section">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      listTitle="Topic"
      listTitleColor="#bcbcbc"
    />

    <UiStickyAd pageKey="other" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import ContainerTwoLists from '~/components/list/ContainerTwoLists.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_URL } from '~/constants'
import { stripHtmlTags } from '~/utils/article.js'

export default {
  name: 'SectionTopic',
  components: {
    ContainerTwoLists,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  methods: {
    async fetchList(page) {
      return await this.$fetchTopics({
        maxResults: 9,
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
