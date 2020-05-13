<template>
  <section class="section">
    <UIArticleList
      class="list"
      :listTitle="currentSectionTitle"
      :listTitleColor="'#30BACB'"
      :listData="listData"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import UIArticleList from '~/components/UIArticleList.vue'

export default {
  name: 'Section',
  components: {
    UIArticleList,
  },
  async fetch() {
    const response = await this.$axios.get(
      `http://api.mirrormedia.mg/posts?where={"sections":{"$in":["${this.currentSectionId}"]}}&max_results=9&page=1&sort=-publishedDate`
    )
    let listData = response.data?._items ?? []
    listData = listData.map(this.mapDataToComponentProps)
    this.listData = listData
  },
  data() {
    return {
      listData: [],
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
}

.list {
  @include media-breakpoint-up(md) {
    margin: 8px 0 0 0;
  }
}
</style>
