<template>
  <section class="section">
    <div>
      <UIArticleList
        :list-title="'時事、生活'"
        :list-title-color="'#30BACB'"
        :list-data="listData"
      />
    </div>
  </section>
</template>

<script>
import UIArticleList from '~/components/UIArticleList.vue'

export default {
  components: {
    UIArticleList,
  },
  async fetch() {
    const response = await this.$axios.get(
      'http://api.mirrormedia.mg/posts?where={"sections":{"$in":["57e1e0e5ee85930e00cad4e9"]}}&max_results=9&page=1&sort=-publishedDate'
    )
    const listData = response.data._items.map(this.mapDataToComponentProps)
    this.listData = listData
  },
  data() {
    return {
      listData: [],
    }
  },
  methods: {
    createInfoDescriptions(apiData) {
      const filterString = function (content) {
        return typeof content === 'string'
      }
      const getStringContents = function (data) {
        return data.content.filter(filterString).join('')
      }
      return apiData.map(getStringContents).join('')
    },
    mapDataToComponentProps(item) {
      return {
        href: `/story/${item.slug}`,
        imgSrc: item.heroImage.image.resizedTargets.mobile.url,
        imgText: '時事、生活',
        imgTextBackgroundColor: '#30BACB',
        infoTitle: item.title,
        infoDescription: this.createInfoDescriptions(item.brief.apiData),
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.section
  background-color: #f2f2f2
  padding: 36px 0
  @include media-breakpoint-up(md)
    padding: 36px 25px 72px 25px
  @include media-breakpoint-up(xl)
    max-width: 1024px
    padding: 0
    margin: auto
</style>
