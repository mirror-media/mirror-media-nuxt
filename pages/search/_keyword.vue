<template>
  <section class="section">
    <h1 class="section__title" v-text="currentKeyword" />
    <UIArticleList class="section__list" :listData="listData" />
    <button
      v-if="showLoadmoreButton"
      class="section__loadmore-button"
      v-text="textContentLoadmore"
    />
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
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
      textContentLoadmore: '更多文章',
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
    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },
    showLoadmoreButton() {
      return (
        this.listDataPageLimit &&
        this.listDataCurrentPage < this.listDataPageLimit
      )
    },
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
          styleVariables[`section-color-${this.getFirstSectionName(item)}`],
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
    setListDataTotal(response = {}) {
      this.listDataTotal = response.hits?.total ?? 0
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  background-color: white;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 36px 0 0 0;
    margin: auto;
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
  &__loadmore-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 16px - 16px);
    height: 30px;
    border: 1px solid #bcbcbc;
    font-size: 16px;
    color: black;
    margin: 20px 16px;
    @include media-breakpoint-up(md) {
      width: 100%;
      margin: 40px 0 0 0;
    }
  }
}
</style>
