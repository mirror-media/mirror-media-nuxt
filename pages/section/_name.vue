<template>
  <section class="section">
    <UIArticleList
      class="section__list"
      :listTitle="currentSectionTitle"
      :listTitleColor="'#30BACB'"
      :listData="listData"
    />
    <client-only>
      <infinite-loading @infinite="infiniteHandler">
        <UILoadmoreLoadingIcon slot="spinner" class="spinner" />
        <!-- provide empty slot if we want to disable load messages locally -->
        <!-- see: https://peachscript.github.io/vue-infinite-loading/guide/configure-load-msg.html#via-slot-sepcial-attribute -->
        <div slot="no-more" />
        <div slot="no-results" />
        <div slot="error" />
      </infinite-loading>
    </client-only>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import UILoadmoreLoadingIcon from '~/components/UILoadmoreLoadingIcon.vue'
import UIArticleList from '~/components/UIArticleList.vue'

export default {
  name: 'Section',
  components: {
    InfiniteLoading,
    UILoadmoreLoadingIcon,
    UIArticleList,
  },
  async fetch() {
    const response = await this.fetchSections({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
  },
  data() {
    return {
      listData: [],
      listDataPage: 1,
      listDataMaxResults: 9,
      listDataTotal: undefined,
    }
  },
  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    currentSectionName() {
      return this.$route.params.name
    },
    currentSectionData() {
      return (
        this.sections.find(
          (section) => section.name === this.currentSectionName
        ) ?? {}
      )
    },
    currentSectionId() {
      return this.currentSectionData.id
    },
    currentSectionTitle() {
      return this.currentSectionData.title
    },
    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item._id,
        href: item.slug ? `/story/${item.slug}` : '/',
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url ?? '',
        imgText: this.currentSectionTitle,
        imgTextBackgroundColor: '#30BACB',
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief?.html ?? ''),
      }
    },
    async fetchSections({ page = 1 }) {
      const baseUrl = process.browser
        ? `//${location.host}/`
        : process.env._AXIOS_BASE_URL_
      const response = await this.$axios.get(
        `${baseUrl}api/posts?where={"sections":{"$in":["${this.currentSectionId}"]}}&max_results=9&page=${page}&sort=-publishedDate`
      )
      return response
    },
    setListData(response = {}) {
      let listData = response.data?._items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.data?._meta?.total ?? 0
    },
    async infiniteHandler($state) {
      this.listDataPage += 1
      try {
        const response = await this.fetchSections({ page: this.listDataPage })
        this.setListData(response)

        if (this.listDataPage >= this.listDataPageLimit) {
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

.spinner {
  margin: 20px 0 0 0;
}
</style>
