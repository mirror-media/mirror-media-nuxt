<template>
  <section class="section">
    <ContainerGptAd
      class="section__ad"
      :pageKey="currentSectionId"
      adKey="HD"
    />

    <UiArticleList
      class="section__list"
      :listTitle="currentSectionTitle"
      :listTitleColor="currentSectionThemeColor"
      :listData="listItemsInFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>

    <ContainerGptAd
      class="section__ad"
      :pageKey="currentSectionId"
      adKey="FT"
    />

    <UiArticleList
      v-if="shouldMountLoadmoreList"
      class="section__list"
      :listData="listItemsInLoadmorePage"
    />
    <UiInfiniteLoading @infinite="infiniteHandler" />

    <UiStickyAd :pageKey="currentSectionId" />
    <ContainerFullScreenAds v-if="!isSectionMember" />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { processTwoLists } from '~/mixins/list.js'

import styleVariables from '~/scss/_variables.scss'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '~/constants'

const LIST_MAX_RESULTS = 9

export default {
  name: 'Section',
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
        return await this.$fetchList({
          maxResults: LIST_MAX_RESULTS,
          sort: '-publishedDate',
          sections: [this.currentSectionId],
          page,
        })
      },

      transformListItemContent() {
        return {
          imgText: this.currentSectionTitle,
          imgTextBackgroundColor: this.currentSectionThemeColor,
        }
      },
    }),
  ],

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
    currentSectionThemeColor() {
      const key = `section-color-${this.currentSectionName}`
      return styleVariables[key]
    },
    isSectionMember() {
      return this.currentSectionName === 'member'
    },

    microAdUnits() {
      return !this.isSectionMember ? MICRO_AD_UNITS.LISTING.RWD : []
    },
  },

  head() {
    const title = `${this.currentSectionTitle} - ${SITE_TITLE}`
    const description = this.currentSectionData?.description || SITE_DESCRIPTION

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
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/section/${this.$route.params.name}`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.currentSectionName,
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
