<template>
  <section class="section">
    <UiArticleList class="section__list" :listData="listItems" />
    <UiInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />

    <UiWineWarning v-if="isTopicWine" />
  </section>
</template>

<script>
import _ from 'lodash'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

import styleVariables from '~/scss/_variables.scss'
import { stripHtmlTags, getStoryPath } from '~/utils/article'

const TOPIC_IDS_WINE = [
  '5c25f9e3315ec51000903a82',
  '5d22bb9fe311f3925c49396c',
  '5a4d8e60160ac91000294611',
  '5ff7d152127ff40f00d7125c',
]

export default {
  name: 'Topic',
  components: {
    UiArticleList,
    UiInfiniteLoading,
    UiWineWarning,
  },
  async fetch() {
    await this.loadListInitial()
  },
  data() {
    return {
      list: {
        items: [],
        page: 0,
        maxResults: 9,
        total: undefined,
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

    maxListPage() {
      if (this.list.total === undefined) {
        return undefined
      }
      return Math.ceil(this.list.total / this.list.maxResults)
    },

    /**
     * Constraint which prevent loadmore unexpectly
     * if we navigating on client-side
     * due to the list data of the first page has not been loaded.
     */
    shouldMountInfiniteLoading() {
      return this.list.page >= 1
    },

    listItems() {
      return _.uniqBy(this.list.items, function identifyDuplicateById(item) {
        return item.id
      })
    },
  },
  methods: {
    async loadListInitial() {
      const response = await this.loadList()

      this.setListTotal(response)
    },
    async loadList() {
      this.list.page += 1

      const response =
        (await this.$fetchList({
          maxResults: this.list.maxResults,
          sort: '-publishedDate',
          topics: [this.topicId],
          page: this.list.page,
        })) || {}

      this.setListItems(response)

      return response
    },
    setListItems(response = {}) {
      const items = (response.items ?? []).map(function transformContent(
        item = {}
      ) {
        const [section = {}] = item?.sections || []

        return {
          id: item?.id,
          href: getStoryPath(item || {}),
          imgSrc: item?.heroImage?.image?.resizedTargets?.mobile?.url,
          imgText: section.title ?? '',
          imgTextBackgroundColor:
            styleVariables[`section-color-${section.name}`],
          infoTitle: item?.title ?? '',
          infoDescription: stripHtmlTags(item?.brief?.html ?? ''),
        }
      })

      this.list.items.push(...items)
    },
    setListTotal(response = {}) {
      this.list.total = response.meta?.total ?? 0
    },
    async infiniteHandler(state) {
      try {
        await this.loadList()

        if (this.list.page >= this.maxListPage) {
          state.complete()
        } else {
          state.loaded()
        }
      } catch (err) {
        state.error()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  background-color: #f2f2f2;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 0;
    margin: auto;
  }
  &__list {
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
    }
  }
}
</style>
