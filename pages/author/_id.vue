<template>
  <section class="author-_id">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :listTitle="authorName"
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

import styleVariables from '~/scss/_variables.scss'
import { SITE_TITLE, SITE_URL } from '~/constants'

export default {
  name: 'Author',
  components: {
    ContainerTwoLists,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  async fetch() {
    const authorResponse = await this.fetchAuthor()
    this.setAuthorName(authorResponse)
  },
  data() {
    return {
      authorName: undefined,
    }
  },
  computed: {
    currentAuthorId() {
      return this.$route.params.id
    },
  },
  methods: {
    async fetchList(page) {
      return await this.$fetchPosts({
        maxResults: 9,
        sort: '-publishedDate',
        $or: [
          { writers: this.currentAuthorId },
          { photographers: this.currentAuthorId },
          { camera_man: this.currentAuthorId },
          { designers: this.currentAuthorId },
          { engineers: this.currentAuthorId },
        ],
        page,
      })
    },
    transformListItemContent(item) {
      const section = item.sections?.[0] || {}

      return {
        imgText: section.title ?? '',
        imgTextBackgroundColor: styleVariables[`section-color-${section.name}`],
      }
    },

    async fetchAuthor() {
      const response = await this.$fetchContacts({
        id: this.currentAuthorId,
      })
      return response
    },
    setAuthorName(response = {}) {
      this.authorName = (response.items ?? [])[0]?.name
    },
  },
  head() {
    const title = `${this.authorName} - ${SITE_TITLE}`
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
          content: `${SITE_URL}/author/${this.$route.params.id}`,
        },
      ],
    }
  },
}
</script>
