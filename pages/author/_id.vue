<template>
  <section class="author">
    <ContainerTwoLists
      :fetchList="fetchList"
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
    authorId() {
      return this.$route.params.id
    },
  },
  methods: {
    async fetchList(page) {
      return await this.$fetchPosts({
        maxResults: 9,
        sort: '-publishedDate',
        $or: [
          { writers: this.authorId },
          { photographers: this.authorId },
          { camera_man: this.authorId },
          { designers: this.authorId },
          { engineers: this.authorId },
        ],
        page,
      })
    },

    async fetchAuthor() {
      const response = await this.$fetchContacts({
        id: this.authorId,
      })
      return response
    },
    setAuthorName(response = {}) {
      this.authorName = response.items?.[0]?.name
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
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/author/${this.authorId}`,
        },
      ],
    }
  },
}
</script>
