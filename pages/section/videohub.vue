<template>
  <section class="section" :class="{ premium: isPremiumMember }">
    <UiVideoIframeWithItems
      :items="latestData"
      textPositionInMdViewport="right"
      class="section__latest"
      @sendGa="handleSendGa"
    >
      <template #heading>
        <h1>最新影片</h1>
      </template>
    </UiVideoIframeWithItems>
    <div class="section__bottom-wrapper">
      <UiVideoPopular
        v-if="!isPremiumMember"
        :items="popularData"
        class="section__popular"
        @sendGa="handleSendGa"
      />
      <UiVideoSubscriptions class="section__subscriptions" />
      <UiVideoPopular
        v-if="isPremiumMember"
        :items="popularData"
        class="section__popular"
        @sendGa="handleSendGa"
      />

      <ContainerGptAd
        v-if="!isPremiumMember"
        class="section__ad"
        pageKey="videohub"
        adKey="FT"
      />

      <div class="section__categories-wrapper">
        <UiVideoCategory
          v-for="category in categories"
          :key="`video-category-${category.id}`"
          :category="category"
          :items="getCategoryItems(category)"
          class="section__category"
          @sendGa="handleSendGa"
        />
      </div>
    </div>

    <UiStickyAd pageKey="videohub" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import {
  SITE_TITLE,
  SITE_URL,
  VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING as PLAYLIST_MAPPING,
} from '~/constants/index'
import { processResponseItems } from '~/utils/youtube'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import UiVideoCategory from '~/components/UiVideoCategory.vue'
import UiVideoIframeWithItems from '~/components/UiVideoIframeWithItems.vue'
import UiVideoPopular from '~/components/UiVideoPopular.vue'
import UiVideoSubscriptions from '~/components/UiVideoSubscriptions.vue'

const INVERTED_PLAYLIST_MAPPING = _.invert(PLAYLIST_MAPPING)

export default {
  name: 'SectionVideohub',
  components: {
    ContainerGptAd,
    ContainerFullScreenAds,
    UiStickyAd,
    UiVideoCategory,
    UiVideoIframeWithItems,
    UiVideoPopular,
    UiVideoSubscriptions,
  },
  async fetch() {
    const response = await this.fetchChannelData()
    this.latestData = processResponseItems(response).slice(0, 5)
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
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
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
      const { items: latest = [] } = await this.fetchChannelData({
        maxResults: 50,
      })
      const ids = latest.map((item) => item.id.videoId).join(',')
      const { items: videos = [] } = await this.$fetchYoutubeVideos({
        part: 'snippet, statistics',
        id: ids,
      })
      const popular = videos
        .sort((a, b) => b.statistics?.viewCount - a.statistics?.viewCount)
        .slice(0, 10)
      this.popularData = processResponseItems({
        items: popular,
      })
    },
    fetchChannelData({ maxResults = 10 } = {}) {
      return this.$fetchYoutubeSearch({
        channelId: 'UCYkldEK001GxR884OZMFnRw',
        maxResults,
        order: 'date',
        part: 'snippet',
        type: 'video',
      })
    },
    fetchYoutubePlaylistItems(playlistId) {
      return this.$fetchYoutubePlaylistItems({
        playlistId,
        part: ['snippet', 'status'],
        maxResults: 15,
      })
    },
    getCategoryItems(category) {
      return this.categoriesPlaylistData[category.name] ?? []
    },
    handleSendGa(param = {}) {
      this.$ga.event(param)
    },
    isThisSection(section) {
      const currentSectionName = this.$route.path.split('/section/')[1]
      return section.name === currentSectionName
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
          processResponseItems(data.value)
            ?.filter((item) => item.privacyStatus === 'public')
            .slice(0, 5)
        )
      }
    },
  },
  head() {
    const title = `影音 - ${SITE_TITLE}`
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
$categories: (
  'coverstory': #30bac8,
  'entertainment': #bf3385,
  'society': #8b572a,
  'investigation': #417505,
  'people': #4a90e2,
  'finance': #8b222c,
  'foodtravel': #f1a356,
  'ent_perspective': #30bac8,
  'carandwatch': #969696,
);
.section {
  overflow: hidden;
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

  &__policies {
    margin: 0 auto;
    padding: 5px 20px;
    @include media-breakpoint-up(md) {
      padding: 10px 20px;
    }
    @include media-breakpoint-up(xl) {
      order: 3;
      width: 100%;
    }
  }

  * + .section__ad {
    margin-top: 20px;
  }

  &__ad {
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(xl) {
      order: 3;
      margin-bottom: 20px;
    }
  }

  &.premium::v-deep {
    margin: 0 auto;
    h1 {
      font-weight: 500;
      font-size: 16px;
      line-height: 115%;
      @include media-breakpoint-up(md) {
        font-size: 20.8px;
        line-height: 115%;
        width: 640px;
      }
      @include media-breakpoint-up(xl) {
        margin: 40px 0 0 0;
        width: 1024px;
      }
    }
    .video-iframe-items {
      &__remaining {
        margin-top: 16px;
        max-width: 1024px;
        @include media-breakpoint-up(md) {
          width: 80%;
          max-width: 640px;
        }
        @include media-breakpoint-up(xl) {
          margin: 20px 0 0 36px;
        }

        .linked-item {
          & + .linked-item {
            margin-top: 16px;
            @include media-breakpoint-up(xl) {
              margin-top: 10px;
            }
          }
          &__image {
            @include media-breakpoint-up(md) {
              width: 258px;
              height: 145px;
            }
            @include media-breakpoint-up(xl) {
              width: 135px;
              padding-top: 76px;
              height: 0;
            }
          }

          &__title {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-top: 8px;
            @include media-breakpoint-up(md) {
              font-size: 24px;
              line-height: 34px;
              margin-top: 0;
              margin-left: 25px;
            }
            @include media-breakpoint-up(xl) {
              font-size: 18px;
              line-height: 25px;
              margin-left: 16px;
            }
          }
        }
      }
      &__first {
        @include media-breakpoint-up(xl) {
          width: 480px;
          &-title {
            font-weight: 400;
            line-height: 32px;
            margin-top: 8px;
          }
        }
      }
    }

    .video-subscriptions {
      box-shadow: none;
    }

    .video-popular {
      padding: 18px 0 20px 0px;
      border-top: 0;
      position: relative;
      @include media-breakpoint-up(xl) {
        width: 272px;
        padding: 0 0 28px 0;
      }

      &:before {
        content: '';
        width: calc(100vw);
        height: 1px;
        background: #979797;
        position: absolute;
        display: block;
        top: 0;
        right: 0;
        @include media-breakpoint-up(md) {
          width: calc(100vw - 40px);
          right: 20px;
        }
        @include media-breakpoint-up(xl) {
          content: none;
        }
      }
      &:after {
        content: '';
        width: calc(100vw);
        height: 1px;
        background: #979797;
        position: absolute;
        display: block;
        bottom: 0;
        right: 0;
        @include media-breakpoint-up(md) {
          width: calc(100vw - 40px);
          right: 20px;
        }
        @include media-breakpoint-up(xl) {
          content: none;
        }
      }

      &__heading {
        font-weight: 600;
        font-size: 16px;
        line-height: 115%;
        letter-spacing: 0.5px;
        @include media-breakpoint-up(md) {
          margin: 0;
        }
        @include media-breakpoint-up(xl) {
          font-weight: 600;
          font-size: 20.8px;
          line-height: 115%;
        }
      }
      .scroll-container {
        margin-top: 16px;
        .linked-item {
          @include media-breakpoint-up(xl) {
            width: 244px;
          }
          &:first-child {
            margin-left: 16px;
            @include media-breakpoint-up(md) {
              margin-left: 20px;
            }
            @include media-breakpoint-up(xl) {
              margin-left: 0;
              margin-top: 20px;
            }
          }
          &:not(:first-child) {
            margin-left: 24px;
            @include media-breakpoint-up(xl) {
              margin-left: 0;
            }
          }
          &__image {
            width: 169px;
            @include media-breakpoint-up(xl) {
              width: 100%;
            }
          }
          &__title {
            @include media-breakpoint-up(xl) {
              margin-top: 16px;
              font-weight: 400;
              font-size: 16px;
              line-height: 150%;
            }
          }
        }
      }
    }

    .section__categories-wrapper {
      // @include media-breakpoint-up(xl) {
      //   margin-left: 296px;
      //   padding: 0 0 0 24px;
      // }
    }

    .video-category {
      padding: 23px 16px 77px 16px;
      @include media-breakpoint-up(md) {
        padding: 28px 0;
        margin: 0 20px;
      }
      @include media-breakpoint-up(xl) {
        padding: 0 0 28px 0;
        margin: 0;
        &:not(:first-child) {
          padding-top: 28px;
          border-top: 1px solid #c4c4c4;
        }
      }

      &__remaining {
        @include media-breakpoint-up(md) {
          margin: 16px 0 0 20px;
        }
      }

      &__heading {
        font-weight: 600;
        font-size: 16px;
        line-height: 115%;
        letter-spacing: 0.5px;
        @include media-breakpoint-up(md) {
          font-size: 20.8px;
          line-height: 115%;
          margin: 0;
        }
        &::before {
          content: none;
        }
        & + * {
          margin-top: 16px;
        }
      }

      .linked-item {
        & + .linked-item {
          margin-top: 16px;
          @include media-breakpoint-up(md) {
            margin-top: 10px;
          }
        }

        &__title {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          margin-top: 8px;
          @include media-breakpoint-up(md) {
            margin: 0 0 0 16px;
            font-size: 16px;
            line-height: 150%;
          }
        }
        &__image {
          @include media-breakpoint-up(md) {
            width: 135px;
            height: 0;
            padding-top: 76px;
          }
        }
      }
      &__first {
        .linked-item {
          &__title {
            @include media-breakpoint-up(md) {
              font-weight: 600;
              font-size: 18px;
              line-height: 25px;
              padding: 16px;
              margin: 0;
            }
          }
          &__image {
            @include media-breakpoint-up(md) {
              width: 100%;
              height: 184px;
            }
          }
        }
      }

      &__category-link {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        right: 16px;
        bottom: 18px;
        @include media-breakpoint-up(md) {
          font-weight: 400;
          font-size: 13px;
          line-height: 18px;
        }
      }

      @each $name, $color in $categories {
        &.video_#{$name} {
          .video-category__heading {
            color: $color;
          }
          .video-category__category-link {
            color: $color;
            &::after {
              border-color: transparent transparent transparent $color;
            }
            @include media-breakpoint-up(md) {
              color: white;
              &::after {
                border-color: transparent transparent transparent white;
              }
            }
          }
        }
      }
    }
  }
}

.grey {
  background: #f5f5f5;
}
</style>
