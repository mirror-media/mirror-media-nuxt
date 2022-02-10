<template>
  <section class="tag">
    <ContainerList
      :fetchList="fetchList"
      :listTitle="tagName"
      :listTitleColor="isPremiumMember ? '#FFFFFF' : '#bcbcbc'"
      :isTagPage="isTagPage"
    />
    <UiStickyAd pageKey="other" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import ContainerList from '~/components/ContainerList.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_URL } from '~/constants'

export default {
  name: 'Tag',
  components: {
    ContainerList,
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
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
    tagId() {
      return this.$route.params.id
    },
    isTagPage() {
      return this.$route.name === 'tag-id'
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
