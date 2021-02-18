<template>
  <section class="topic">
    <UiTopicCover :type="coverType" :imgItems="topicImgs.items" />

    <ContainerList :fetchList="fetchList" />

    <UiWineWarning v-if="isTopicWine" />
  </section>
</template>

<script>
import ContainerList from '~/components/list/ContainerList.vue'
import UiTopicCover from '~/components/topic/UiTopicCover.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

const TOPIC_IDS_WINE = [
  '5c25f9e3315ec51000903a82',
  '5d22bb9fe311f3925c49396c',
  '5a4d8e60160ac91000294611',
  '5ff7d152127ff40f00d7125c',
]

export default {
  name: 'Topic',
  components: {
    ContainerList,
    UiTopicCover,
    UiWineWarning,
  },

  async fetch() {
    await this.loadTopic()
    await this.loadTopicImgsInitial()
  },
  data() {
    return {
      topic: {},
      topicImgs: {
        items: [],
        page: 0,
        maxPage: 0,
        maxResults: 25,
      },
    }
  },
  computed: {
    topicId() {
      return this.$route.params.id
    },
    isTopicWine() {
      return TOPIC_IDS_WINE.includes(this.topicId)
    },

    coverType() {
      return this.topic.leading
    },
  },

  mounted() {
    this.continueLoadingTopicImgs()
  },

  methods: {
    async loadTopic() {
      this.topic =
        (
          await this.$fetchTopics({
            id: this.topicId,
          })
        )?.items?.[0] || {}
    },

    async fetchList(page) {
      return await this.$fetchList({
        maxResults: 9,
        sort: '-publishedDate',
        topics: [this.topicId],
        page,
      })
    },

    async loadTopicImgsInitial() {
      if (this.coverType === undefined) {
        return
      }

      const response = await this.loadTopicImgs()

      this.setTopicImgsMaxPage(response)
    },
    async loadTopicImgs() {
      this.topicImgs.page += 1

      const response =
        (await this.$fetchImages({
          topics: this.topicId,
          maxResults: this.topicImgs.maxResults,
          page: this.topicImgs.page,
        })) || {}

      this.setTopicImgsItems(response)

      return response
    },
    async continueLoadingTopicImgs() {
      if (this.topicImgs.page >= this.topicImgs.maxPage) {
        return
      }

      await this.loadTopicImgs()
      this.continueLoadingTopicImgs()
    },
    setTopicImgsItems(response = {}) {
      const items = (response.items || []).map(function transformContent(
        item = {}
      ) {
        const { id, keywords = '', image = {}, description } = item || {}

        return {
          id,
          href: keywords.startsWith('@-') && keywords.slice(2),
          srcs: {
            mobile: image?.resizedTargets?.mobile?.url,
            tablet: image?.resizedTargets?.tablet?.url,
            desktop: image?.resizedTargets?.desktop?.url,
          },
          alt: description,
        }
      })

      this.topicImgs.items.push(...items)
    },
    setTopicImgsMaxPage(response = {}) {
      const imgsTotal = response.meta?.total ?? 0

      this.topicImgs.maxPage = Math.ceil(imgsTotal / this.topicImgs.maxResults)
    },
  },
}
</script>
