<template>
  <section class="search">
    <h1 class="search__title" v-text="keyword" />

    <UiArticleList class="search__list" :listData="listItems" />
    <UiInfiniteLoading v-if="shouldLoadmore" @infinite="infiniteHandler" />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'

import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore.js'

import { stripHtmlTags } from '~/utils/article'

export default {
  name: 'Search',
  components: {
    UiArticleList,
    UiInfiniteLoading,
  },

  mixins: [
    fetchListAndLoadmore({
      getMaxResults() {
        return 9
      },

      async fetchList(page) {
        return await this.$fetchSearch({
          maxResults: 9,
          keywords: this.keyword,

          // add a section property conditonally
          ...(this.sectionTitle && {
            section: this.sectionTitle,
          }),
          page,
        })
      },

      getListItems(response = {}) {
        return (
          response.hits?.hits?.map(function getSource(hit = {}) {
            return hit.source || {}
          }) || []
        )
      },
      getListTotal(response = {}) {
        return response.hits?.total?.value ?? 0
      },

      transformListItemContent(item = {}) {
        return {
          id: item.objectID,
          infoDescription: stripHtmlTags(item.brief ?? ''),
        }
      },
    }),
  ],

  async fetch() {
    await this.initList()
  },

  computed: {
    keyword() {
      return this.$route.params.keyword
    },
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    sectionTitle() {
      const sectionIdFromUrlQuery = this.$route.query?.section
      if (sectionIdFromUrlQuery === undefined) {
        return null
      }

      return (
        this.sections.find((section) => section.id === sectionIdFromUrlQuery)
          ?.title ?? null
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  background-color: white;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 36px 0 0 0;
    margin: 0 auto;
  }
  &__title {
    font-size: 48px;
    color: #344951;
    display: flex;
    align-items: center;
    padding: 0 32px;
    @include media-breakpoint-up(md) {
      padding: 0 10px;
    }
    &::after {
      content: '';
      margin: 0 0 0 10px;
      display: inline-block;
      flex: 1 1 auto;
      height: 10px;
      background: linear-gradient(
        to right,
        #bcbcbc 0%,
        rgba(242, 242, 242, 1) 70%,
        rgba(242, 242, 242, 1) 100%
      );
    }
  }
  &__list {
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
    }
  }
}
</style>
