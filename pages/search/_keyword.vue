<template>
  <section class="section">
    <h1 class="section__title" v-text="currentKeyword" />
    <UiArticleList class="section__list" :listData="listData" />
    <UiInfiniteLoading @infinite="infiniteHandler" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import styleVariables from '~/scss/_variables.scss'
import { stripHtmlTags, getStoryPath } from '~/utils/article'

export default {
  name: 'Search',
  components: {
    UiArticleList,
    UiInfiniteLoading,
  },
  async fetch() {
    const response = await this.fetchSearchListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData_: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
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

    listData() {
      return _.uniqBy(this.listData_, function identifyDuplicatedItemById(
        listItem
      ) {
        return listItem.id
      })
    },
  },
  methods: {
    getFirstSectionName(article = {}) {
      return (article.sections ?? [])[0]?.name
    },
    mapDataToComponentProps(dataFromES) {
      const item = dataFromES.source ?? {}
      return {
        id: item.objectID,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: (item.sections ?? [])[0]?.title,
        imgTextBackgroundColor:
          styleVariables[`section-color-${this.getFirstSectionName(item)}`],
        infoTitle: item.title ?? '',
        infoDescription: stripHtmlTags(item.brief ?? ''),
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
      this.listData_.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.hits?.total ?? 0
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchSearchListing({
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
}
</style>
