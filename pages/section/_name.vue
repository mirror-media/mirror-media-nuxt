<template>
  <section class="section">
    <client-only>
      <GPTAD
        class="section__ad"
        :adUnit="adTop.adUnit"
        :adSize="adTop.adSize"
      />
    </client-only>
    <UIArticleList
      class="section__list"
      :listTitle="currentSectionTitle"
      :listTitleColor="currentSectionThemeColor"
      :listData="listDataFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UIArticleList>
    <client-only>
      <GPTAD
        class="section__ad"
        :adUnit="adBottom.adUnit"
        :adSize="adBottom.adSize"
      />
    </client-only>
    <UIArticleList
      v-show="showListDataLoadmorePage"
      class="section__list"
      :listData="listDataLoadmorePage"
    />
    <UIInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />
    <UIStickyAd v-if="adDevice === 'MB'">
      <client-only>
        <GPTAD
          :adUnit="adFixedBottomMobile.adUnit"
          :adSize="adFixedBottomMobile.adSize"
        />
      </client-only>
    </UIStickyAd>
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import MicroAd from '~/components/MicroAd.vue'
import UIArticleList from '~/components/UIArticleList.vue'
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UIStickyAd from '~/components/UIStickyAd.vue'
import styleVariables from '~/scss/_variables.scss'
import gptAdUnits from '~/constants/gpt-ad-units.js'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '~/constants'

export default {
  name: 'Section',
  components: {
    MicroAd,
    UIArticleList,
    UIInfiniteLoading,
    ContainerFullScreenAds,
    UIStickyAd,
  },
  async fetch() {
    const response = await this.fetchSectionListing({ page: 1 })
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
      microAdUnits: MICRO_AD_UNITS.LISTING.RWD,
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
    currentSectionThemeColor() {
      const key = `section-color-${this.currentSectionName}`
      return styleVariables[key]
    },
    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },

    /**
     * Constraint which prevent loadmore unexpectly
     * if we navigating on client-side
     * due to the list data of the first page has not been loaded.
     */
    shouldMountInfiniteLoading() {
      return this.listDataCurrentPage >= 1
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

    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    adTop() {
      return gptAdUnits?.[this.currentSectionId]?.[`${this.adDevice}_HD`] ?? {}
    },
    adBottom() {
      return gptAdUnits?.[this.currentSectionId]?.[`${this.adDevice}_FT`] ?? {}
    },
    adFixedBottomMobile() {
      return gptAdUnits?.[this.currentSectionId]?.['MB_ST'] ?? {}
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        href: item.slug ? `/story/${item.slug}` : '/',
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: this.currentSectionTitle,
        imgTextBackgroundColor: this.currentSectionThemeColor,
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief?.html ?? ''),
      }
    },
    async fetchSectionListing({ page = 1 } = {}) {
      const response = await this.$fetchList({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        sections: [this.currentSectionId],
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.meta?.total ?? 0
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchSectionListing({
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
