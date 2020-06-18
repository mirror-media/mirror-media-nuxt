<template>
  <section class="section">
    <UIVideoIframeWithItems
      :items="latestData"
      textPositionInMdViewport="right"
      class="section__latest"
    >
      <template v-slot:heading>
        <h1>最新影片</h1>
      </template>
    </UIVideoIframeWithItems>
    <div class="section__bottom-wrapper">
      <UIVideoPopular :items="popularData" class="section__popular" />
      <UIVideoSubscriptions class="section__subscriptions" />
      <client-only>
        <GPTAD
          class="section__ad"
          :adUnit="adBottom.adUnitCode"
          :adSize="adBottom.adSize"
        />
      </client-only>
      <div class="section__categories-wrapper">
        <UIVideoCategory
          v-for="category in categories"
          :key="`video-category-${category.id}`"
          :category="category"
          :items="getCategoryItems(category)"
          class="section__category"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import UIVideoCategory from '~/components/UIVideoCategory.vue'
import UIVideoIframeWithItems from '~/components/UIVideoIframeWithItems.vue'
import UIVideoPopular from '~/components/UIVideoPopular.vue'
import UIVideoSubscriptions from '~/components/UIVideoSubscriptions.vue'
import gptUnits from '~/constants/gptUnits'

// temporary
const PLAYLIST_MAPPING = {
  // 鏡封面
  video_coverstory: 'PLftq_bkhPR3ZtDGBhyqVGObQXazG_O3M3',
  // 鏡娛樂
  video_entertainment: 'PLftq_bkhPR3aj8UaqBvel6wia54AM5wlh',
  // 鏡社會
  video_society: 'PLftq_bkhPR3bLVBh5khl2pLxgFoPwrbfl',
  // 鏡調查
  video_investigation: 'PLftq_bkhPR3YOrSnIpcqSkY3hPE2TjXfW',
  // 鏡財經
  video_finance: 'PLftq_bkhPR3afBv0Wg_oUqjd_pkWIJm2h',
  // 鏡人物
  video_people: 'PLftq_bkhPR3YkNjH8VQZ__8nXZ9INIjAu',
  // 鏡食旅
  video_foodtravel: 'PLftq_bkhPR3baCfd6RU_1hbkY8ynXssun',
  // 娛樂透視
  video_ent_perspective: 'PLftq_bkhPR3YxUNEIHIMA2fsM-DqxCHMb',
  // 鏡錶誌
  // video_watch: '',
  // 鏡車誌
  // video_car: '',
}

const INVERTED_PLAYLIST_MAPPING = _.invert(PLAYLIST_MAPPING)

export default {
  name: 'SectionVideohub',
  components: {
    UIVideoCategory,
    UIVideoIframeWithItems,
    UIVideoPopular,
    UIVideoSubscriptions,
  },
  async fetch() {
    const response = await this.fetchChannelData({ order: 'date' })
    this.latestData = this.processItems(response).slice(0, 5)
  },
  data() {
    return {
      latestData: [],
      popularData: [],
      categoriesPlaylistData: {},
      videoAdUnits: gptUnits.videohub ?? {},
    }
  },
  computed: {
    ...mapState({
      section(state) {
        return state.sections.data.items.find(this.isThisSection) ?? {}
      },
    }),
    adBottom() {
      return this.videoAdUnits[`${this.adDevice}FT`] ?? {}
    },
    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    categories() {
      return this.section.categories ?? []
    },
    playlistIds() {
      return this.categories
        .map(this.mapCategoryToPlatlistId)
        .filter((playlist) => playlist)
    },
  },
  beforeMount() {
    this.fetchPopularData()
    this.fetchCategoriesPlaylistData()
  },
  methods: {
    async fetchCategoriesPlaylistData() {
      const response = await Promise.allSettled(
        this.playlistIds.map(this.fetchYoutubePlaylistItems)
      )
      response.forEach(this.mapDataToCategoriesPlaylist)
    },
    async fetchPopularData() {
      const response = await this.fetchChannelData({ order: 'viewCount' })
      this.popularData = this.processItems(response)
    },
    fetchChannelData({ order = 'date' } = {}) {
      return this.$fetchYoutubeSearch({
        channelId: 'UCYkldEK001GxR884OZMFnRw',
        maxResults: 10,
        order,
        part: 'snippet',
        type: 'video',
      })
    },
    fetchYoutubePlaylistItems(playlistId) {
      return this.$fetchYoutubePlaylistItems({
        playlistId,
        part: 'snippet',
        maxResults: 5,
      })
    },
    getCategoryItems(category) {
      return this.categoriesPlaylistData[category.name] ?? []
    },
    isThisSection(section) {
      const currentSectionName = this.$route.path.split('/section/')[1]
      return section.name === currentSectionName
    },
    isValidYoutubeVideo(item) {
      // for specific title from Youtube response data
      const invalidTitles = ['Deleted video', 'Private video']
      return !invalidTitles.includes(item.title)
    },
    mapCategoryToPlatlistId(category) {
      return PLAYLIST_MAPPING[category.name]
    },
    mapDataToCategoriesPlaylist(data, index) {
      if (data.status === 'fulfilled') {
        const categoryName = INVERTED_PLAYLIST_MAPPING[this.playlistIds[index]]
        this.$set(
          this.categoriesPlaylistData,
          categoryName,
          this.processItems(data.value)
        )
      }
    },
    processItems(response = {}) {
      const items = response.items ?? []
      return items.map(this.restructureItem).filter(this.isValidYoutubeVideo)
    },
    restructureItem(item) {
      return {
        videoId: item.id?.videoId || item.snippet?.resourceId?.videoId,
        title: item.snippet?.title,
        thumbnails: item.snippet?.thumbnails?.high?.url,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  &__latest {
    @include media-breakpoint-up(xl) {
      width: 1024px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 0 53px 0;
    }
  }
  &__bottom-wrapper {
    @include media-breakpoint-up(xl) {
      display: flex;
      flex-wrap: wrap;
    }
  }
  &__popular,
  &__categories-wrapper {
    @include media-breakpoint-up(xl) {
      margin: 30px 0 65px;
    }
  }
  &__popular {
    padding: 30px 0 32px 0;
    @include media-breakpoint-up(xl) {
      order: 1;
      position: relative;
      left: calc((100% - 1024px) / 2);
      width: 239px;
      padding: 0;
    }
  }
  &__subscriptions {
    @include media-breakpoint-up(xl) {
      order: 0;
      width: 100%;
    }
  }
  &__categories-wrapper {
    padding: 0 0 29px;
    @include media-breakpoint-up(xl) {
      order: 2;
      width: calc(1024px - 239px - 39px);
      margin-left: calc((100% - 1024px) / 2 + 39px);
      margin-right: auto;
      padding: 0;
    }
  }
  &__category {
    + .section__category {
      border-top: 1px solid #979797;
      @include media-breakpoint-up(xl) {
        margin-top: 30px;
        border-top: none;
      }
    }
  }
  &__ad {
    @include media-breakpoint-up(xl) {
      order: 3;
    }
  }
}
</style>
