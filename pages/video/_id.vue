<template>
  <section class="video">
    <client-only v-if="!isMobile">
      <GPTAD
        class="video__ad"
        :adUnit="getAdUnit('HD').adUnitCode"
        :adSize="getAdUnit('HD').adSize"
      />
    </client-only>
    <article class="video__content-wrapper">
      <UIYoutubeIframe :videoId="videoId" class="video__iframe" />
      <client-only v-if="isMobile">
        <GPTAD
          class="video__ad"
          :adUnit="getAdUnit('HD').adUnitCode"
          :adSize="getAdUnit('HD').adSize"
        />
      </client-only>
      <h1 class="video__title" v-text="title" />
      <div class="video__data-share">
        <p class="video__datetime" v-text="datetime" />
        <div class="video__share">
          <UIShareFacebook />
          <UIShareLine />
        </div>
      </div>
      <p class="video__description" v-html="descriptionParsed" />
    </article>
    <client-only v-if="isMobile">
      <GPTAD
        class="video__ad"
        :adUnit="getAdUnit('E1').adUnitCode"
        :adSize="getAdUnit('E1').adSize"
      />
    </client-only>
    <div class="video__latest-wrapper">
      <client-only v-if="!isMobile">
        <GPTAD
          class="video__ad"
          :adUnit="getAdUnit('R1').adUnitCode"
          :adSize="getAdUnit('R1').adSize"
        />
      </client-only>
      <template v-if="hasLatestItems">
        <h2 class="video__heading">最新影音</h2>
        <UILinkedItemWithTitle
          v-for="item in listDataLatest"
          :key="item.videoId"
          :title="item.title"
          :href="getHref(item.videoId)"
          :imgSrc="item.thumbnails"
          :target="linkedTarget"
          textPositionInMdViewport="right"
          class="video__latest"
          @click="handleClick"
        />
      </template>
    </div>
    <client-only>
      <GPTAD
        class="video__ad"
        :adUnit="getAdUnit('FT').adUnitCode"
        :adSize="getAdUnit('FT').adSize"
      />
    </client-only>
    <ContainerFullScreenAds />
    <UIStickyAd>
      <client-only>
        <GPTAD
          :adUnit="getAdUnit('ST').adUnitCode"
          :adSize="getAdUnit('ST').adSize"
        />
      </client-only>
    </UIStickyAd>
  </section>
</template>

<script>
import { SITE_OG_IMAGE, SITE_URL } from '~/constants/index'
import { processResponseItems as restructureAndFilterItems } from '~/utils/youtube'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UIStickyAd from '~/components/UIStickyAd.vue'
import UILinkedItemWithTitle from '~/components/UILinkedItemWithTitle.vue'
import UIShareFacebook from '~/components/UIShareFacebook.vue'
import UIShareLine from '~/components/UIShareLine.vue'
import UIYoutubeIframe from '~/components/UIYoutubeIframe.vue'
import gptUnits from '~/constants/gptUnits'

export default {
  name: 'Video',
  layout(context) {
    return context.route.query.layout
  },
  components: {
    ContainerFullScreenAds,
    UIStickyAd,
    UILinkedItemWithTitle,
    UIShareFacebook,
    UIShareLine,
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
      videoAdUnits: gptUnits.videohub ?? {},
      videoData: {},
      listDataLatest: [],
    }
  },
  computed: {
    adDevice() {
      if (this.isApp) {
        return 'APP'
      }
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
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
    isApp() {
      return this.$route.query.layout === 'app'
    },
    isMobile() {
      return this.adDevice === 'MB' || this.adDevice === 'APP'
    },
    linkedTarget() {
      if (this.isApp) {
        return '_self'
      }
      return '_blank'
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
      this.listDataLatest = restructureAndFilterItems(response)
    },
    getAdUnit(position) {
      return this.videoAdUnits[`${this.adDevice}${position}`] ?? {}
    },
    getHref(videoId) {
      if (this.isApp) {
        return `/video/${videoId}?layout=app`
      }
      return `/video/${videoId}`
    },
    handleClick() {
      this.$ga.event({
        eventCategory: 'listing',
        eventAction: 'click',
        eventLabel: 'latest_video',
      })
    },
  },
  head() {
    const image =
      this.videoData?.thumbnails?.maxres?.url ||
      this.videoData?.thumbnails?.standard?.url ||
      SITE_OG_IMAGE
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.descriptionParsed,
        },
        { hid: 'og:title', property: 'og:title', content: this.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.descriptionParsed,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}${this.$route.path}`,
        },
        { hid: 'og:image', property: 'og:image', content: image },
        { hid: 'twitter:title', name: 'twitter:title', content: this.title },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.descriptionParsed,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
        { name: 'section-name', content: 'videohub' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.video {
  padding: 0 0 20px;
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
    max-width: 1160px;
    margin: 0 auto;
    padding: 20px 0;
  }
  &__content-wrapper {
    @include media-breakpoint-up(xl) {
      display: flex;
      flex-direction: column;
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
      margin: 20px 0 0 50px;
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
    display: flex;
    justify-content: space-between;
    + * {
      margin-top: 0.5em;
    }
  }
  &__datetime {
    color: #a0a0a0;
    font-size: 12px;
    line-height: 1.88;
  }
  &__share {
    display: flex;
    > a + a {
      margin-left: 10px;
    }
    &::v-deep {
      img {
        width: 35px;
        height: 35px;
      }
    }
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

  * + .video__ad {
    margin-top: 20px;
  }
  &__ad {
    margin-left: auto;
    margin-right: auto;
    &.dfp-hd {
      order: -1;
    }
    + * {
      margin-top: 20px;
    }
  }
}
</style>
