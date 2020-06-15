<template>
  <section class="video">
    <article class="video__content-wrapper">
      <UIYoutubeIframe :videoId="videoId" class="video__iframe" />
      <h1 class="video__title" v-text="title" />
      <div class="video__data-share">
        <p class="video__datetime" v-text="datetime" />
      </div>
      <p class="video__description" v-html="descriptionParsed" />
    </article>
    <div v-if="hasLatestItems" class="video__latest-wrapper">
      <h2 class="video__heading">最新影音</h2>
      <UILinkedItemWithTitle
        v-for="item in listDataLatest"
        :key="item.videoId"
        :title="item.title"
        :href="`/video/${item.videoId}`"
        :imgSrc="item.thumbnails"
        textPositionInMdViewport="right"
        class="video__latest"
      />
    </div>
  </section>
</template>

<script>
import UILinkedItemWithTitle from '~/components/UILinkedItemWithTitle.vue'
import UIYoutubeIframe from '~/components/UIYoutubeIframe.vue'

export default {
  name: 'Video',
  components: {
    UILinkedItemWithTitle,
    UIYoutubeIframe,
  },
  async fetch() {
    const response = await this.$fetchYoutubeVideos({
      part: 'snippet',
      maxResults: 1,
      id: this.videoId,
    })
    this.videoData = response.items?.[0]?.snippet ?? {}
  },
  data() {
    return {
      videoData: {},
      listDataLatest: [],
    }
  },
  computed: {
    channelId() {
      return this.videoData.channelId
    },
    datetime() {
      return this.$dayjs(this.videoData.publishedAt).format(
        'YYYY/MM/DD HH:mm:ss'
      )
    },
    descriptionParsed() {
      const description = this.videoData.description ?? ''
      return description.replace(/↵|\n/g, '<br>').split('-----')[0]
    },
    hasLatestItems() {
      return this.listDataLatest.length > 0
    },
    title() {
      return this.videoData.title
    },
    videoId() {
      return this.$route.params.id
    },
  },
  watch: {
    channelId(value) {
      value && this.fetchAndSetChannelLatestData(value)
    },
  },
  methods: {
    async fetchAndSetChannelLatestData(channelId) {
      const response = await this.$fetchYoutubeSearch({
        maxResults: 7,
        order: 'date',
        part: 'snippet',
        channelId,
      })
      this.listDataLatest = this.restructureAndFilterItems(response)
    },
    isValidYoutubeVideo(item) {
      // for specific title from Youtube response data
      return item.title !== 'Deleted video' && item.title !== 'Private video'
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
.video {
  padding: 0 0 20px;
  @include media-breakpoint-up(xl) {
    display: flex;
    max-width: 1160px;
    margin: 0 auto;
    padding: 20px 0;
  }
  &__content-wrapper {
    @include media-breakpoint-up(xl) {
      width: 66.67%;
    }
    + * {
      margin-top: 40px;
      @include media-breakpoint-up(xl) {
        margin-top: 0;
      }
    }
  }
  &__latest-wrapper {
    padding: 0 5%;
    @include media-breakpoint-up(md) {
      padding: 0 20%;
    }
    @include media-breakpoint-up(xl) {
      width: calc(33.33% - 50px);
      min-width: 300px;
      padding: 0;
      margin: 0 0 0 50px;
    }
  }

  &__iframe + * {
    margin-top: 1em;
  }
  &__title,
  &__data-share,
  &__description {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(md) {
      width: 60%;
    }
    @include media-breakpoint-up(xl) {
      width: auto;
    }
  }
  &__title {
    color: #064f77;
    text-align: justify;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.37;
    @include media-breakpoint-up(md) {
      font-size: 22px;
    }
    + * {
      margin-top: 15px;
    }
  }
  &__data-share {
    + * {
      margin-top: 0.5em;
    }
  }
  &__datetime {
    color: #a0a0a0;
    font-size: 12px;
    line-height: 1.88;
  }
  &__description {
    color: #34495e;
    font-size: 16px;
    font-weight: 400;
    text-align: justify;
    line-height: 1.88;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  &__heading {
    color: #2a597d;
    font-size: 16px;
    font-weight: 600;
    @include media-breakpoint-up(md) {
      font-size: 20px;
    }
  }
  &__latest {
    margin: 20px 0 0;
    ::v-deep {
      .linked-item__title {
        color: #828282;
      }
    }
    &.align-right {
      ::v-deep {
        .linked-item__image {
          @include media-breakpoint-up(md) {
            width: 50%;
            padding-top: 28.125%;
          }
        }
        .linked-item__title {
          @include media-breakpoint-up(md) {
            margin: 0 0 0 20px;
          }
        }
      }
    }
  }
}
</style>
