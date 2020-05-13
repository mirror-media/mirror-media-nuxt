<template>
  <section class="section">
    <div>
      <UIArticleList
        :listTitle="'時事、生活'"
        :listTitleColor="'#30BACB'"
        :listData="listData"
      />
    </div>
  </section>
</template>

<script>
import UIArticleList from '~/components/UIArticleList.vue'

export default {
  name: 'Section',
  components: {
    UIArticleList,
  },
  async fetch() {
    const response = await this.$axios.get(
      'http://api.mirrormedia.mg/posts?where={"sections":{"$in":["57e1e0e5ee85930e00cad4e9"]}}&max_results=9&page=1&sort=-publishedDate'
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
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item._id,
        href: item.slug ? `/story/${item.slug}` : '/',
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url ?? '',
        imgText: '時事、生活',
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
</style>
