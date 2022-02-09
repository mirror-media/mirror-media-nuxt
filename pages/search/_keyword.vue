<template>
  <section class="search">
    <h1 class="search__title">
      <UpperQuotationSvg class="search__icon" />{{ keyword }}
      <LowerQuotationSvg class="search__icon" />
    </h1>
    <UiArticleList class="search__list" :listItems="listItems" />
    <UiInfiniteLoading v-if="shouldLoadmore" @infinite="infiniteHandler" />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import UpperQuotationSvg from '~/assets/quotation-mark-upper.svg?inline'
import LowerQuotationSvg from '~/assets/quotation-mark-lower.svg?inline'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'

import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore.js'

const LIST_MAX_RESULTS = 9

export default {
  name: 'Search',
  components: {
    UiArticleList,
    UiInfiniteLoading,
    UpperQuotationSvg,
    LowerQuotationSvg,
  },

  mixins: [
    fetchListAndLoadmore({
      maxResults: LIST_MAX_RESULTS,

      async fetchList(page) {
        return await this.$fetchSearch({
          maxResults: LIST_MAX_RESULTS,
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
        }
      },
    }),
  ],

  async fetch() {
    await this.initList()
  },

  computed: {
    keyword() {
      return `${this.$route.params.keyword}`
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
    width: 100%;
    font-size: 20.8px;
    line-height: 115%;
    color: #000000de;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    @include media-breakpoint-up(md) {
      padding: 0;
    }
    &::after {
      content: '';
      margin: 0 0 0 24px;
      display: inline-block;
      flex: 1 1 auto;
      height: 2px;
      background: linear-gradient(
        to right,
        #000000 0%,
        rgba(242, 242, 242, 1) 100%
      );
    }
  }
  &__icon {
    align-self: flex-start;
    margin-top: 3.2px;
    &:first-child {
      margin-right: 7.54px;
    }
    &:last-child {
      margin-left: 9px;
    }
  }
  &__list {
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
    }
  }
}
</style>
