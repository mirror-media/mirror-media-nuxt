<template>
  <section class="tag">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :listTitle="tagName"
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
import { getSectionColor } from '~/utils/index.js'

export default {
  name: 'Tag',
  components: {
    ContainerTwoLists,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  async fetch() {
    const tagResponse = await this.$fetchTag(this.tagId)
    this.setTagName(tagResponse)
  },
  data() {
    return {
      tagName: undefined,
    }
  },
  computed: {
    tagId() {
      return this.$route.params.id
    },
  },
  methods: {
    setTagName(response = {}) {
      this.tagName = response.name
    },

    async fetchList(page) {
      return await this.$fetchList({
        maxResults: 9,
        sort: '-publishedDate',
        tags: [this.tagId],
        page,
      })
    },

    transformListItemContent(item = {}) {
      const section = item.sections?.[0] || {}

      return {
        imgText: section.title ?? '',
        imgTextBackgroundColor: getSectionColor(section.name),
      }
    },
  },
  head() {
    const title = `${this.tagName} - ${SITE_TITLE}`
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
          content: `${SITE_URL}/tag/${this.tagId}`,
        },
      ],
    }
  },
}
</script>
