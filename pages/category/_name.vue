<template>
  <section class="section">
    <ContainerGptAd class="section__ad" :pageKey="sectionId" adKey="HD" />

    <UiArticleList
      class="section__list"
      :listTitle="categoryTitle"
      :listTitleColor="sectionThemeColor"
      :listData="listItemsInFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd class="section__ad" :pageKey="sectionId" adKey="FT" />

    <UiArticleList
      v-show="shouldMountLoadmoreList"
      class="section__list"
      :listData="listItemsInLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />

    <UiWineWarning v-if="isCategoryWine" />
    <template v-else>
      <UiStickyAd :pageKey="sectionId" />
      <ContainerFullScreenAds />
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { processTwoLists } from '~/mixins/list.js'

import styleVariables from '~/scss/_variables.scss'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_URL } from '~/constants'

const LIST_MAX_RESULTS = 9

export default {
  name: 'Category',
  components: {
    MicroAd,
    UiArticleList,
    UiInfiniteLoading,
    UiWineWarning,
    ContainerGptAd,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  mixins: [
    processTwoLists({
      maxResults: LIST_MAX_RESULTS,

      async fetchList(page) {
        return await this.$fetchList({
          maxResults: LIST_MAX_RESULTS,
          sort: '-publishedDate',
          categories: [this.categoryId],
          page,
        })
      },

      transformListItemContent() {
        return {
          imgText: this.sectionTitle,
          imgTextBackgroundColor: this.sectionThemeColor,
        }
      },
    }),
  ],

  data() {
    return {
      microAdUnits: MICRO_AD_UNITS.LISTING.RWD,
    }
  },
  computed: {
    ...mapGetters({
      getSectionByCategoryName: 'sections/getSectionByCategoryName',
    }),

    sectionData() {
      return this.getSectionByCategoryName(this.categoryName)
    },
    sectionName() {
      return this.sectionData.name
    },
    sectionThemeColor() {
      const key = `section-color-${this.sectionName}`
      return styleVariables[key]
    },
    sectionId() {
      return this.sectionData.id
    },
    sectionTitle() {
      return this.sectionData.title
    },

    categoryName() {
      return this.$route.params.name
    },
    categoryData() {
      return (
        this.sectionData.categories.find((category) => {
          return this.categoryName === category.name
        }) ?? {}
      )
    },
    categoryTitle() {
      return this.categoryData.title
    },
    categoryId() {
      return this.categoryData.id
    },
    isCategoryWine() {
      return this.categoryName === 'wine'
    },
  },

  head() {
    const title = `${this.categoryTitle} - ${SITE_TITLE}`
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
          content: `${SITE_URL}/category/${this.$route.params.name}`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.sectionName,
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
