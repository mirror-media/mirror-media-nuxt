<template>
  <!-- CAVEAT: we replace the /topic/:id route component with deprecated one because of refactoring legacy topic page in progress -->
  <!-- so page component you see here was disabled temporarily -->
  <!-- see extendRoutes settings in nuxt.config.js -->
  <section class="topic">
    <UiTopicCover :type="coverType" :imgItems="topicImgs.items" />

    <UiArticleList class="topic__list" :listItems="listItems" />
    <UiInfiniteLoading v-if="shouldLoadmore" @infinite="infiniteHandler" />

    <UiWineWarning v-if="isTopicWine" />
  </section>
</template>

<script>
import UiTopicCover from '~/components/topic/UiTopicCover.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore.js'

const LIST_MAX_RESULTS = 9
const TOPIC_IDS_WINE = [
  '5c25f9e3315ec51000903a82',
  '5d22bb9fe311f3925c49396c',
  '5a4d8e60160ac91000294611',
  '5ff7d152127ff40f00d7125c',
  '61d6ade96fef6b0f00f8407e',
]

export default {
  name: 'Topic',
  components: {
    UiTopicCover,
    UiArticleList,
    UiInfiniteLoading,
    UiWineWarning,
  },

  mixins: [
    fetchListAndLoadmore({
      maxResults: LIST_MAX_RESULTS,

      async fetchList(page) {
        return await this.$fetchList({
          maxResults: LIST_MAX_RESULTS,
          sort: '-publishedDate',
          topics: [this.topicId],
          page,
        })
      },
    }),
  ],

  async fetch() {
    await Promise.all([this.loadTopic(), this.initList()])
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

<style lang="scss" scoped>
.topic {
  background-color: #f2f2f2;

  &__list {
    padding: 0 0 36px 0;
    @include media-breakpoint-up(md) {
      padding: 0 25px 72px 25px;
    }
    @include media-breakpoint-up(xl) {
      max-width: 1024px;
      padding: 0;
      margin: 0 auto;
    }
  }
}
</style>
