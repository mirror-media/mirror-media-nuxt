<template>
  <section class="section">
    <UIVideoIframeWithItems
      :items="playlistItems"
      class="section__highlight"
      @sendGA="handleSendGA"
    >
      <template v-if="categoryTitle" v-slot:heading>
        <h1
          :class="categoryName"
          class="section__heading"
          v-text="categoryTitle"
        />
      </template>
    </UIVideoIframeWithItems>
    <div class="section__remaining">
      <UILinkedItemWithTitle
        v-if="remainingItemsBeforeMobileAd"
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
    <ContainerFullScreenAds />
    <UIStickyAd>
      <client-only>
        <GPTAD
          :adUnit="videoAdUnits.MBST.adUnitCode"
          :adSize="videoAdUnits.MBST.adSize"
        />
      </client-only>
    </UIStickyAd>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import {
  SITE_TITLE,
  SITE_URL,
  VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING as PLAYLIST_MAPPING,
} from '~/constants/index'
import { processResponseItems } from '~/utils/youtube'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UIStickyAd from '~/components/UIStickyAd.vue'
import UIInfiniteLoading from '~/components/UIInfiniteLoading.vue'
import UILinkedItemWithTitle from '~/components/UILinkedItemWithTitle.vue'
import UIVideoIframeWithItems from '~/components/UIVideoIframeWithItems.vue'
import gptUnits from '~/constants/gptUnits'

const VIDEO_CATEGORIES_NAME = Object.keys(PLAYLIST_MAPPING)
const MAX_RESULTS = 29

export default {
  name: 'VideoCategory',
  components: {
    ContainerFullScreenAds,
    UIStickyAd,
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
      VIDEO_CATEGORIES_NAME,
      nextPageToken: '',
      playlistItems: [],
      videoAdUnits: gptUnits.videohub ?? {},
    }
  },
  computed: {
    ...mapState({
      categories: (state) =>
        state.sections.data.items.find((section) => section.name === 'videohub')
          ?.categories ?? [],
    }),
    adBottom() {
      return this.videoAdUnits[`${this.adDevice}FT`] ?? {}
    },
    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    categoryName() {
      return this.$route.path.split('/video_category/')[1]
    },
    categoryTitle() {
      return this.categories.find(
        (category) => category.name === this.categoryName
      )?.title
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
      return this.playlistItems.slice(6, MAX_RESULTS)
    },
    remainingItemsAfterDesktopAd() {
      return this.playlistItems.slice(MAX_RESULTS)
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
        maxResults: MAX_RESULTS,
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
    setPlaylistItems(reponse) {
      this.playlistItems = [
        ...this.playlistItems,
        ...processResponseItems(reponse),
      ]
    },
  },
  head() {
    const title = `${this.categoryTitle} - ${SITE_TITLE}`
    return {
      title,
      meta: [
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}${this.$route.path}`,
        },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { name: 'section-name', content: 'videohub' },
      ],
    }
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
  &.video_entertainment {
    &::before {
      background-color: #bf3385;
    }
  }
  &.video_society {
    &::before {
      background-color: #8b572a;
    }
  }
  &.video_investigation {
    &::before {
      background-color: #417505;
    }
  }
  &.video_people {
    &::before {
      background-color: #4a90e2;
    }
  }
  &.video_finance {
    &::before {
      background-color: #8b222c;
    }
  }
  &.video_foodtravel {
    &::before {
      background-color: #f1a356;
    }
  }
  &.video_ent_perspective {
    &::before {
      background-color: #30bac8;
    }
  }
  &.video_carandwatch {
    &::before {
      background-color: #969696;
    }
  }
}
</style>
