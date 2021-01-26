<template>
  <section class="section">
    <UiArticleList class="section__list" :listData="listData" />
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
import { getStoryPath } from '~/utils/article'

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
    const response = await this.fetchTopicListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.list.page += 1
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
    currentTopicId() {
      return this.$route.params.id
    },
    isTopicWine() {
      return TOPIC_IDS_WINE.includes(this.currentTopicId)
    },

    listDataPageLimit() {
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

    listData() {
      return _.uniqBy(this.list.items, function identifyDuplicatedItemById(
        listItem
      ) {
        return listItem.id
      })
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      const section = (item.sections ?? [])[0]
      return {
        id: item.id,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: section.title ?? '',
        imgTextBackgroundColor: styleVariables[`section-color-${section.name}`],
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief?.html ?? ''),
      }
    },
    async fetchTopicListing({ page = 1 } = {}) {
      const response = await this.$fetchList({
        maxResults: this.list.maxResults,
        sort: '-publishedDate',
        topics: [this.currentTopicId],
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.list.items.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.list.total = response.meta?.total ?? 0
    },
    async infiniteHandler($state) {
      this.list.page += 1
      try {
        const response = await this.fetchTopicListing({
          page: this.list.page,
        })
        this.setListData(response)

        if (this.list.page >= this.listDataPageLimit) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (e) {
        $state.error()
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
