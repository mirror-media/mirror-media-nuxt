<template>
  <section class="section">
    <UIArticleList
      class="section__list"
      :listTitle="tagName"
      :listTitleColor="'#BCBCBC'"
      :listData="listData"
    />
    <UIInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />
  </section>
</template>

<script>
import UIArticleList from '~/components/UIArticleList.vue'
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import styleVariables from '~/scss/_variables.scss'

export default {
  name: 'Tag',
  components: {
    UIArticleList,
    UIInfiniteLoading,
  },
  async fetch() {
    const response = await this.fetchTagListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1

    const responseTag = await this.$fetchTag(this.currentTagId)
    this.setTagName(responseTag)
  },
  data() {
    return {
      listData: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 12,
      listDataTotal: undefined,
      tagName: undefined,
    }
  },
  computed: {
    currentTagId() {
      return this.$route.params.id
    },

    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },

    // Constraint which prevent loadmore unexpectly
    // if we navigating on client-side
    // due to the list data of the first page has not been loaded.
    shouldMountInfiniteLoading() {
      return this.listDataCurrentPage >= 1
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
        href: item.slug ? `/story/${item.slug}` : '/',
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: section.title ?? '',
        imgTextBackgroundColor: styleVariables[`section-color-${section.name}`],
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief?.html ?? ''),
      }
    },
    async fetchTagListing({ page = 1 } = {}) {
      const response = await this.$fetchList({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        tags: [this.currentTagId],
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.meta?.total ?? 0
    },
    setTagName(response = {}) {
      this.tagName = response.name
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchTagListing({
          page: this.listDataCurrentPage,
        })
        this.setListData(response)

        if (this.listDataCurrentPage >= this.listDataPageLimit) {
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
