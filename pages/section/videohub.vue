<template>
  <section class="section">
    <UIVideoLatest :items="latestData" class="section__latest" />
    <div class="section__bottom-wrapper">
      <UIVideoPopular :items="popularData" class="section__popular" />
      <UIVideoSubscriptions class="section__subscriptions" />
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
import UIVideoLatest from '~/components/UIVideoLatest.vue'
import UIVideoPopular from '~/components/UIVideoPopular.vue'
import UIVideoSubscriptions from '~/components/UIVideoSubscriptions.vue'

// temporary
const PLAYLIST_MAPPING = {
  // 鏡封面
  video_coverstory: 'PLftq_bkhPR3ZtDGBhyqVGObQXazG_O3M3',
  // 鏡娛樂
  video_ent_headline: 'PLftq_bkhPR3ZHVK8_764az4C3eE2dABtf',
  // 鏡社會
  video_society: 'PLftq_bkhPR3YGhYcRZ-AHewlabCrXGwRX',
  // 鏡調查
  video_investigation: 'PLftq_bkhPR3Y022jEP9hma-1RTcd5K5bO',
  // 財經理財
  video_finance: 'PLftq_bkhPR3ZSuBsj7HYS91uZ4ivFRYZv',
  // 鏡人物
  video_people: 'PLftq_bkhPR3ZrjMn1hahyZB40QCEHLWhx',
  // 鏡食旅
  video_foodtravel: 'PLftq_bkhPR3baCfd6RU_1hbkY8ynXssun',
  // 娛樂透視
  video_ent_perspective: 'PLftq_bkhPR3YxUNEIHIMA2fsM-DqxCHMb',
  // 汽車鐘錶
  // video_carandwatch: '',
}

const INVERTED_PLAYLIST_MAPPING = _.invert(PLAYLIST_MAPPING)

export default {
  name: 'SectionVideohub',
  components: {
    UIVideoCategory,
    UIVideoLatest,
    UIVideoPopular,
    UIVideoSubscriptions,
  },
  async fetch() {
    const response = await this.$fetchYoutubeSearch({
      maxResults: 10,
      order: 'date',
      part: 'snippet',
      type: 'video',
      channelId: 'UCYkldEK001GxR884OZMFnRw',
    })
    this.latestData = this.restructureAndFilterItems(response).slice(0, 5)
  },
  data() {
    return {
      latestData: [],
      popularData: [],
      categoriesPlaylistData: {},
    }
  },
  computed: {
    ...mapState({
      section(state) {
        return state.sections.data.items.find(this.isThisSection) ?? {}
      },
    }),
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
    this.fetchAndSetPopularData()
    this.fetchAndSetCategoriesPlaylistData()
  },
  methods: {
    async fetchAndSetCategoriesPlaylistData() {
      const response = await Promise.allSettled(
        this.playlistIds.forEach(this.fetchYoutubePlaylistItems)
      )
      response.forEach(this.mapDataToCategoriesPlaylist)
    },
    async fetchAndSetPopularData() {
      const response = await this.$fetchYoutubeSearch({
        maxResults: 10,
        order: 'viewCount',
        part: 'snippet',
        type: 'video',
        channelId: 'UCYkldEK001GxR884OZMFnRw',
      })
      this.popularData = this.restructureAndFilterItems(response)
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
        this.categoriesPlaylistData[
          categoryName
        ] = this.restructureAndFilterItems(data.value)
      }
    },
    restructureAndFilterItems(response = {}) {
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
  > * {
    @include media-breakpoint-up(xl) {
      width: 1024px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  &__latest {
    @include media-breakpoint-up(xl) {
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
    @include media-breakpoint-up(xl) {
      order: 1;
    }
  }
  &__subscriptions {
    @include media-breakpoint-up(xl) {
      order: 0;
      width: 100vw;
      margin: 0 calc((-100vw + 1024px) / 2);
    }
  }
  &__categories-wrapper {
    padding: 0 0 29px;
    @include media-breakpoint-up(xl) {
      order: 2;
      flex: 1;
      padding: 0 0 0 39px;
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
}
</style>
