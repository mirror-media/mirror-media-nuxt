<template>
  <section class="section">
    <h1 v-text="currentKeyword" />
    <UIArticleList class="section__list" :listData="listData" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import UIArticleList from '~/components/UIArticleList.vue'
import styleVariables from '~/scss/_variables.scss'

export default {
  name: 'Search',
  components: {
    UIArticleList,
  },
  async fetch() {
    const response = await this.fetchSearchListing({ page: 1 })
    this.setListData(response)
    // this.setListDataTotal(response)
    // this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData: [],
      // listDataCurrentPage: 0,
      listDataMaxResults: 9,
      // listDataTotal: undefined,
    }
  },
  computed: {
    currentKeyword() {
      return this.$route.params.keyword
    },
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    sectionQueryTitle() {
      const sectionIdFromUrlQuery = this.$route.query?.section ?? ''
      if (sectionIdFromUrlQuery === '') {
        return null
      }
      return (
        this.sections.find((section) => section.id === sectionIdFromUrlQuery)
          ?.title ?? null
      )
    },
    // listDataPageLimit() {
    //   if (this.listDataTotal === undefined) {
    //     return undefined
    //   }
    //   return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    // },
    // // Constraint which prevent loadmore unexpectly
    // // if we navigating on client-side
    // // due to the list data of the first page has not been loaded.
    // shouldMountInfiniteLoading() {
    //   return this.listDataCurrentPage >= 1
    // },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    getFirstSectionName(article = {}) {
      return (article.sections ?? [])[0]?.name
    },
    mapDataToComponentProps(dataFromES) {
      const item = dataFromES.source ?? {}
      return {
        id: item.objectID,
        href: item.slug ? `/story/${item.slug}` : '/',
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: (item.sections ?? [])[0]?.title,
        imgTextBackgroundColor:
          styleVariables[`sections-color-${this.getFirstSectionName(item)}`],
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief ?? ''),
      }
    },
    async fetchSearchListing({ page = 1 } = {}) {
      const response = await this.$fetchSearch({
        maxResults: this.listDataMaxResults,
        keywords: this.currentKeyword,

        // add a section property conditonally
        ...(this.sectionQueryTitle && {
          section: this.sectionQueryTitle,
        }),
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.hits?.hits ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    // setListDataTotal(response = {}) {
    //   this.listDataTotal = response.meta?.total ?? 0
    // },
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
