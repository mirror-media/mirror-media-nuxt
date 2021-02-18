<template>
  <div class="list">
    <UiArticleList class="list__list" :listData="listItems" />
    <UiInfiniteLoading v-if="shouldLoadmore" @infinite="infiniteHandler" />
  </div>
</template>

<script>
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'

import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore.js'

export default {
  name: 'ContainerList',

  components: {
    UiArticleList,
    UiInfiniteLoading,
  },

  mixins: [
    fetchListAndLoadmore({
      getMaxResults() {
        return this.listMaxResults
      },

      async fetchList(page) {
        return await this.fetchList(page)
      },

      transformListItemContent(item) {
        return this.transformListItemContent(item)
      },
    }),
  ],

  props: {
    listMaxResults: {
      type: Number,
      default: 9,
    },
    // eslint-disable-next-line vue/require-default-prop
    fetchList: {
      type: Function,
      require: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    transformListItemContent: {
      type: Function,
      require: true,
    },
  },

  async fetch() {
    await this.initList()
  },
}
</script>

<style lang="scss" scoped>
.list {
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
