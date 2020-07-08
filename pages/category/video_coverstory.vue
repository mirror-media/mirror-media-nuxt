<template>
  <section class="section">
    <UIVideoIframeWithItems
      :items="playlistItems"
      class="section__highlight"
      @sendGA="handleSendGA"
    >
      <template v-slot:heading>
        <h1 :class="categoryName" class="section__heading">鏡封面</h1>
      </template>
    </UIVideoIframeWithItems>
    <div class="section__remaining">
      <UILinkedItemWithTitle
        :key="remainingItemsBeforeMobileAd.videoId"
        :imgSrc="remainingItemsBeforeMobileAd.thumbnails"
        :href="`/video/${remainingItemsBeforeMobileAd.videoId}`"
        :title="remainingItemsBeforeMobileAd.title"
        class="section__remaining-item"
        @click="handleClick"
      />
      <client-only>
        <div class="section__ad dfp-ft">
          <GPTAD :adUnit="adBottom.adUnitCode" :adSize="adBottom.adSize" />
        </div>
      </client-only>
      <UILinkedItemWithTitle
        v-for="item in remainingItemsAfterMobileAdBeforeDesktopAd"
        :key="item.videoId"
        :imgSrc="item.thumbnails"
        :href="`/video/${item.videoId}`"
        :title="item.title"
        class="section__remaining-item"
        @click="handleClick"
      />
    </div>
    <div v-if="hasLoadedMore" class="section__remaining">
      <UILinkedItemWithTitle
        v-for="item in remainingItemsAfterDesktopAd"
        :key="item.videoId"
        :imgSrc="item.thumbnails"
        :href="`/video/${item.videoId}`"
        :title="item.title"
        class="section__remaining-item"
        @click="handleClick"
      />
    </div>
    <UIInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />
  </section>
</template>

<script>
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import UILinkedItemWithTitle from '~/components/UILinkedItemWithTitle.vue'
import UIVideoIframeWithItems from '~/components/UIVideoIframeWithItems.vue'
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

export default {
  name: 'CategoryVideo',
  components: {
    UIInfiniteLoading,
    UILinkedItemWithTitle,
    UIVideoIframeWithItems,
  },
  async fetch() {
    const response = await this.fetchYoutubePlaylistItems()
    this.setPlaylistItems(response)
    this.nextPageToken = response.nextPageToken
  },
  data() {
    return {
      nextPageToken: '',
      playlistItems: [],
      videoAdUnits: gptUnits.videohub ?? {},
    }
  },
  computed: {
    adBottom() {
      return this.videoAdUnits[`${this.adDevice}FT`] ?? {}
    },
    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    categoryName() {
      return this.$route.path.split('/category/')[1]
    },
    firstFiveItems() {
      return this.playlistItems.slice(0, 5)
    },
    hasLoadedMore() {
      return this.remainingItemsAfterDesktopAd.length > 0
    },
    remainingItemsBeforeMobileAd() {
      return this.playlistItems.slice(5, 6)[0]
    },
    remainingItemsAfterMobileAdBeforeDesktopAd() {
      return this.playlistItems.slice(6, 30)
    },
    remainingItemsAfterDesktopAd() {
      return this.playlistItems.slice(30)
    },
    shouldMountInfiniteLoading() {
      return this.nextPageToken
    },
  },
  methods: {
    fetchYoutubePlaylistItems(nextPageToken = '') {
      return this.$fetchYoutubePlaylistItems({
        playlistId: PLAYLIST_MAPPING[this.categoryName],
        part: 'snippet',
        maxResults: 30,
        pageToken: nextPageToken,
      })
    },
    handleClick() {
      this.$ga.event({
        eventCategory: 'listing',
        eventAction: 'click',
        eventLabel: 'latest_video',
      })
    },
    handleSendGA(param = {}) {
      this.$ga.event(param)
    },
    async infiniteHandler($state) {
      try {
        const response = await this.fetchYoutubePlaylistItems(
          this.nextPageToken
        )
        this.setPlaylistItems(response)
        this.nextPageToken = response.nextPageToken

        if (this.nextPageToken) {
          $state.loaded()
        } else {
          $state.complete()
        }
      } catch {
        $state.error()
      }
    },
    isValidYoutubeVideo(item) {
      // for specific title from Youtube response data
      const invalidTitles = ['Deleted video', 'Private video']
      return !invalidTitles.includes(item.title)
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
    setPlaylistItems(reponse) {
      this.playlistItems = [
        ...this.playlistItems,
        ...this.processItems(reponse),
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  padding: 30px 0 43px;
  @include media-breakpoint-up(xl) {
    width: calc(1024px + 15px);
    margin: 0 auto;
  }
  &__highlight {
    display: flex;
    flex-direction: column;
    @include media-breakpoint-up(xl) {
      flex-direction: row;
      flex-wrap: wrap;
    }
    &::v-deep {
      .video-iframe-items__first {
        order: 1;
        margin-top: 20px;
        @include media-breakpoint-up(xl) {
          width: 460px;
          margin-left: 7.5px;
          border-bottom: 2px solid #979797;
        }
      }
      .video-iframe-items__ad {
        order: 2;
        @include media-breakpoint-up(md) {
          margin-bottom: 0;
        }
        @include media-breakpoint-up(xl) {
          order: 0;
          margin: 0 auto 20px;
        }
      }
      .video-iframe-items__remaining {
        order: 3;
        margin-top: 20px;
        @include media-breakpoint-up(md) {
          display: flex;
          flex-wrap: wrap;
          width: 80%;
          margin-top: 0;
          padding: 0;
        }
        @include media-breakpoint-up(xl) {
          display: flex;
          flex-wrap: wrap;
          margin: 0 0 0 8.5px;
        }
        .video-iframe-items__item {
          @include media-breakpoint-up(md) {
            width: calc((100% - 60px) / 4);
            margin: 20px 7.5px 0;
          }
          @include media-breakpoint-up(xl) {
            width: calc((100% - 30px) / 2);
          }
        }
      }
    }
  }
  &__heading {
    order: 0;
    margin-top: 0;
    @include media-breakpoint-up(xl) {
      padding-left: 7.5px;
    }
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 1em;
      margin-right: 10px;
      background-color: #000;
      transform: translateY(4px);
    }
  }
  &__remaining {
    width: calc(100% - 40px);
    margin: 0 auto;
    + .section__remaining {
      margin-top: 0;
    }
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      width: 80%;
      &::v-deep {
        .section__ad {
          order: 999;
        }
      }
    }
    @include media-breakpoint-up(xl) {
      width: auto;
      margin-top: 30px;
    }
  }
  &__remaining-item {
    @include media-breakpoint-up(md) {
      width: calc((100% - 60px) / 4);
      margin: 20px 7.5px 0;
    }
    @include media-breakpoint-up(xl) {
      width: calc((100% - 75px) / 5);
    }
    + .section__remaining-item,
    + .section__ad {
      margin-top: 20px;
    }
    + .section__ad {
      @include media-breakpoint-up(md) {
        margin-top: 0;
      }
    }
  }
  &__ad {
    @include media-breakpoint-up(md) {
      width: 80%;
      margin: 0 auto;
    }
    + .section__remaining-item {
      margin-top: 20px;
    }
    &.dfp-ft {
      width: calc(100% + 40px);
      margin-left: -20px;
      @include media-breakpoint-up(md) {
        margin: 20px auto;
      }
      @include media-breakpoint-up(xl) {
        margin-bottom: 0;
      }
      > div {
        margin: 0 auto;
      }
    }
  }
}

.section__heading {
  &.video_coverstory {
    &::before {
      background-color: #30bac8;
    }
  }
}
</style>
