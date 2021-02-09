<template>
  <section class="section">
    <ContainerGptAd class="section__ad" pageKey="other" adKey="HD" />

    <UiArticleList
      class="section__list"
      :listTitle="authorName"
      :listTitleColor="'#BCBCBC'"
      :listData="listDataFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="section__ad" pageKey="other" adKey="FT" />

    <UiArticleList
      v-show="showListDataLoadmorePage"
      class="section__list"
      :listData="listDataLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />
    <UiStickyAd>
      <ContainerGptAd pageKey="other" adKey="MB_ST" />
    </UiStickyAd>
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import _ from 'lodash'
import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import styleVariables from '~/scss/_variables.scss'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_URL } from '~/constants'
import { stripHtmlTags, getStoryPath } from '~/utils/article'

export default {
  name: 'Author',
  components: {
    MicroAd,
    UiArticleList,
    UiInfiniteLoading,
    ContainerGptAd,
    ContainerFullScreenAds,
    UiStickyAd,
  },
  async fetch() {
    const response = await this.fetchAuthorListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1

    const responseAuthor = await this.fetchAuthor()
    this.setAuthorName(responseAuthor)
  },
  data() {
    return {
      listData_: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
      authorName: undefined,
      microAdUnits: MICRO_AD_UNITS.LISTING.RWD,
    }
  },
  computed: {
    currentAuthorId() {
      return this.$route.params.id
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
    listDataFirstPage() {
      return this.listData.slice(0, this.listDataMaxResults)
    },
    listDataLoadmorePage() {
      return this.listData.slice(this.listDataMaxResults, Infinity)
    },
    showListDataLoadmorePage() {
      return this.listDataLoadmorePage.length > 0
    },
  },
  methods: {
    mapDataToComponentProps(item) {
      const section = (item.sections ?? [])[0]
      return {
        id: item.id,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: section.title ?? '',
        imgTextBackgroundColor: styleVariables[`section-color-${section.name}`],
        infoTitle: item.title ?? '',
        infoDescription: stripHtmlTags(item.brief?.html ?? ''),
      }
    },
    async fetchAuthor() {
      const response = await this.$fetchContacts({
        id: this.currentAuthorId,
      })
      return response
    },
    setAuthorName(response = {}) {
      this.authorName = (response.items ?? [])[0]?.name
    },
    async fetchAuthorListing({ page = 1 } = {}) {
      const response = await this.$fetchPosts({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        $or: [
          { writers: this.currentAuthorId },
          { photographers: this.currentAuthorId },
          { camera_man: this.currentAuthorId },
          { designers: this.currentAuthorId },
          { engineers: this.currentAuthorId },
        ],
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData_.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.meta?.total ?? 0
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchAuthorListing({
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
  head() {
    const title = `${this.authorName} - ${SITE_TITLE}`
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/author/${this.$route.params.id}`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/css/micro-ad/listing.scss';

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
  &__ad {
    margin: 20px auto;
  }
  &__list {
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
    }
  }
}
</style>
