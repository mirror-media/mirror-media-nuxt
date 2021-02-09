<template>
  <section class="section">
    <ContainerGptAd class="section__ad" pageKey="other" adKey="HD" />

    <UiArticleList
      class="section__list"
      :listTitle="authorName"
      :listTitleColor="'#BCBCBC'"
      :listData="listItemsInFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="section__ad" pageKey="other" adKey="FT" />

    <UiArticleList
      v-if="shouldMountLoadmoreList"
      class="section__list"
      :listData="listItemsInLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />

    <UiStickyAd pageKey="other" />

    <ContainerFullScreenAds />
  </section>
</template>

<script>
import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { processTwoLists } from '~/mixins/list.js'

import styleVariables from '~/scss/_variables.scss'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_URL } from '~/constants'

const LIST_MAX_RESULTS = 9

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

  mixins: [
    processTwoLists({
      maxResults: LIST_MAX_RESULTS,

      async fetchList(page) {
        return await this.$fetchPosts({
          maxResults: LIST_MAX_RESULTS,
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
      },

      transformListItemContent(item = {}) {
        const section = item.sections?.[0] || {}

        return {
          imgText: section.title ?? '',
          imgTextBackgroundColor:
            styleVariables[`section-color-${section.name}`],
        }
      },
    }),
  ],

  async fetch() {
    const [, authorResponse] = await Promise.all([
      this.initList(),
      this.fetchAuthor(),
    ])
    this.setAuthorName(authorResponse)
  },
  data() {
    return {
      authorName: undefined,
      microAdUnits: MICRO_AD_UNITS.LISTING.RWD,
    }
  },
  computed: {
    currentAuthorId() {
      return this.$route.params.id
    },
  },
  methods: {
    async fetchAuthor() {
      const response = await this.$fetchContacts({
        id: this.currentAuthorId,
      })
      return response
    },
    setAuthorName(response = {}) {
      this.authorName = (response.items ?? [])[0]?.name
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
