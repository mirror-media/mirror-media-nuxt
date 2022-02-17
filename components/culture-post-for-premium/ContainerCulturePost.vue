<template>
  <section>
    <section class="culture-post">
      <ContainerHeaderSectionMember
        v-if="isCurrentPagePremium"
        class="header"
        @sidebarToggle="handleIndexActive(!isIndexActive)"
      />
      <a
        v-else
        :href="SITE_URL"
        class="logo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="~/assets/logo@2x.png" :alt="SITE_TITLE" />
      </a>

      <UiArticleIndex
        class="article-index"
        :items="indexes"
        :currentIndex="currentIndex"
        :isIndexActive="isIndexActive"
        @closeIndex="handleIndexActive(false)"
        @openIndex="handleIndexActive(true)"
      />

      <div class="landing">
        <div class="landing-info">
          <div class="landing-info__label">
            <UiSectionLabel label="會員專區">會員專區</UiSectionLabel>｜
            <UiSectionLabel :label="post.sectionLabelFirst">{{
              post.sectionLabelFirst
            }}</UiSectionLabel>
          </div>
          <UiH1 class="landing-info__title">{{ post.title }}</UiH1>
        </div>

        <div class="cover">
          <UiTheCover :video="post.coverVideo" :picture="post.coverPicture" />
          <UiCaption class="cover__hero-caption">
            {{ post.heroCaption }}
          </UiCaption>
        </div>
      </div>

      <UiArticleInfo
        class="article-info"
        :publishTime="post.publishedDate"
        :updateTime="post.updatedAt"
        :writers="post.writers"
        :extendByline="post.extendByline"
        :photographers="post.photographers"
        :tags="post.tags"
        @shareLinksVisibilityChanged="handleShareLinksVisibilityChanged"
      />

      <div class="article-body-wrapper">
        <UiArticleBody
          ref="articleBody"
          class="culture-post__article-body"
          :postId="post.id"
          :brief="post.brief"
          :content="post.content"
          :isArticleContentTruncatedByGateway="post.isTruncated"
          :pageState="articleBodyPageState"
          :isLoading="isLoading"
          :isFail="isFail"
          :failTimes="failTimes"
          @reload="handleReload"
        />
        <transition name="fade">
          <UiShareLinksHasCopyLink
            v-show="!isShareLinksInArticleInfoVisible"
            class="article-body-wrapper__share-links"
            :direction="'vertical-reverse'"
          />
        </transition>
      </div>

      <LazyRenderer
        v-if="doesHaveAnyRelateds"
        class="list-related-container"
        @load="fetchRelatedImgs"
      >
        <UiListRelatedRedesign :items="relateds" :imgs="relatedImgs" />
        <!-- <UiListRelated :items="relateds" :imgs="relatedImgs" /> -->
      </LazyRenderer>

      <UiWineWarning v-if="doesHaveWineCategory" />
    </section>
    <div class="footer-wrapper">
      <UiFooter />
    </div>
    <UiShareLinksToggled class="share-toggled" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import UiTheCover from './UiTheCover.vue'
import UiArticleBody from './UiArticleBody.vue'
import UiArticleIndex from './UiArticleIndex.vue'
import UiListRelatedRedesign from './UiListRelatedRedesign.vue'

// import UiListRelated from './UiListRelated.vue'
import UiH1 from './UiH1.vue'
import UiSectionLabel from './UiSectionLabel.vue'
import UiCaption from './UiCaption.vue'
import UiArticleInfo from './UiArticleInfo.vue'
import ContainerHeaderSectionMember from '~/components/ContainerHeaderSectionMember.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import UiFooter from '~/components/UiFooter.vue'
import UiShareLinksToggled from '~/components/UiShareLinksToggled.vue'
import UiShareLinksHasCopyLink from '~/components/UiShareLinksHasCopyLink.vue'

import { SITE_OG_IMG, SITE_TITLE, SITE_URL } from '~/constants/index'
import { doesContainWineName } from '~/utils/article.js'

export default {
  name: 'ContainerCulturePost',

  components: {
    UiArticleInfo,
    UiCaption,
    UiSectionLabel,
    UiH1,
    ContainerHeaderSectionMember,
    UiTheCover,
    UiArticleBody,
    UiArticleIndex,
    UiListRelatedRedesign,

    // UiListRelated,
    UiWineWarning,
    UiFooter,
    UiShareLinksToggled,
    UiShareLinksHasCopyLink,
  },

  props: {
    story: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFail: {
      type: Boolean,
      default: false,
      required: true,
    },
    failTimes: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      SITE_TITLE,
      SITE_URL,

      currentIndex: 0,
      isIndexActive: false,

      relatedImgs: [],
      isShareLinksInArticleInfoVisible: false,
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),
    post() {
      const {
        id = '',
        title = '',
        brief = {},
        writers = [],
        extendByline = '',
        photographers = [],
        content = {},
        heroVideo = {},
        heroImage = {},
        heroCaption = '',
        mobileImage = {},
        publishedDate = '',
        updatedAt = '',
        relateds = [],
        sections = [],
        tags = [],
        isTruncated = true,
      } = this.story

      const heroVideoSrc = heroVideo.video?.url || ''
      const heroVideoPoster =
        heroVideo.coverPhoto?.image?.resizedTargets?.mobile?.url || false
      const heroImgsResized = heroImage.image?.resizedTargets || {}

      return {
        id,
        title,
        writers,
        extendByline,
        photographers,
        brief: getBrief(),
        content: content.apiData || [],
        heroImage: heroImgsResized,
        heroCaption,
        coverVideo: {
          src: heroVideoSrc,
          poster: heroVideoPoster,
        },
        coverPicture: {
          heroImage: heroImgsResized,
          mobileImage: mobileImage?.image?.resizedTargets || {},
        },
        publishedDate: new Date(publishedDate),
        updatedAt: new Date(updatedAt),
        relateds,
        sectionLabelFirst: sections?.[0]?.title,
        tags,
        isTruncated,
      }

      function getBrief() {
        return (
          brief.apiData
            ?.filter(
              (item = {}) => item.type === 'unstyled' && item.content?.[0]
            )
            .map((item) => ({
              id: item.id,
              type: item.type,
              content: item.content,
            })) || []
        )
      }
    },
    indexes() {
      return this.post.content
        .filter(
          (item) =>
            (item.type === 'header-one' || item.type === 'header-two') &&
            item.content?.[0]
        )
        .map((item) => ({
          id: item.id,
          content: item.content[0],
        }))
    },
    updatedAt() {
      return this.post.updatedAt
    },

    relateds() {
      return this.post.relateds
    },
    doesHaveAnyRelateds() {
      return this.relateds.length > 0
    },

    doesHaveWineCategory() {
      return doesContainWineName(this.story.categories)
    },

    isCurrentPagePremium() {
      return this.$route.name === 'premium-slug'
    },

    articleBodyPageState() {
      if (!this.isCurrentPagePremium) {
        return 'storyPage'
      }

      if (this.$store.getters['membership/isLoggedIn']) {
        return 'premiumPageIsLogin'
      } else {
        return 'premiumPageNotLogin'
      }
    },
  },

  watch: {
    isViewportWidthUpXl(isUp) {
      if (isUp) {
        this.isIndexActive = false
      }
    },
  },

  mounted() {
    this.detectCurrentIndex()
  },

  methods: {
    detectCurrentIndex() {
      import('intersection-observer').then(() => {
        const selectorIdBeginWithHeader = '[id^=header]'
        const targets = [
          ...this.$refs.articleBody.$el.querySelectorAll(
            selectorIdBeginWithHeader
          ),
        ]
        let observer

        {
          const ids = targets.map((target) => target.id)

          observer = new IntersectionObserver(
            function callback(entries) {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  this.currentIndex = ids.indexOf(entry.target.id) + 1 || 0
                }
              })
            }.bind(this),
            {
              threshold: 1,
            }
          )
        }

        targets.forEach((element) => {
          observer.observe(element)
        })
      })
    },
    handleIndexActive(isActive) {
      this.isIndexActive = isActive
    },

    async fetchRelatedImgs() {
      const imgIds = this.relateds.map((item) => item.heroImage)
      const { items = [] } = await this.$fetchImages({ id: imgIds })

      this.relatedImgs = items
    },

    handleReload() {
      this.$emit('reload')
    },

    handleShareLinksVisibilityChanged(isVisible) {
      this.isShareLinksInArticleInfoVisible = isVisible
    },
  },

  head() {
    const { title = '', brief = '', heroImage = {} } = this.post
    const description = brief.map((item) => item.content).join('')
    const image = heroImage.desktop?.url || SITE_OG_IMG
    const dableImgUrl = heroImage.tiny?.url || SITE_OG_IMG

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}${this.$route.path}`,
        },
        { hid: 'og:image', property: 'og:image', content: image },
        { property: 'dable:image', content: dableImgUrl },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.culture-post {
  color: rgba(#000, 0.87);
  word-break: break-word;
  overflow-wrap: break-word;

  &__article-body {
    padding: 0 20px;
    @include media-breakpoint-up(md) {
      padding: 0;
      margin: 0 auto;
      max-width: 608px;
    }
    @include media-breakpoint-up(xl) {
      max-width: 640px;
    }
  }
}

.header {
  position: fixed !important;
  top: 0;
  right: 0;
}
.logo {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 900;
  width: 44px;

  img {
    width: 100%;
  }
}

.article-index {
  z-index: 1;
}

.landing {
  position: relative;
  z-index: 2;
  background-color: white;
}

.landing-info {
  padding: 88px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(md) {
    padding: 112px 0 0 0;
    max-width: 608px;
    margin: 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: 800px;
  }
  &__title {
    margin: 8px 0 0 0;
  }
}

.cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0 0 0;
  @include media-breakpoint-up(xl) {
    margin: 48px 0 0 0;
  }

  &__hero-caption {
    margin: 16px 20px 0 20px;
    @include media-breakpoint-up(md) {
      max-width: 608px;
      margin: 16px auto 0 auto;
    }
    @include media-breakpoint-up(xl) {
      max-width: 640px;
    }
  }
}

.article-info {
  margin: 36px 20px 0 20px;
  @include media-breakpoint-up(md) {
    max-width: 608px;
    margin: 52px auto 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: 640px;
    margin: 64px auto 0 auto;
  }
}

.info,
.updated-at {
  font-size: 14px;
  line-height: 25px;
  text-align: center;
  color: rgba(#000, 0.66);
}

.info {
  padding: 16px 31px;
  margin-bottom: 24px;
  @include media-breakpoint-up(lg) {
    padding-top: 24px;
    padding-bottom: 24px;
    margin-bottom: 60px;
  }
}

.credit {
  margin-top: 4px;

  span + span {
    margin-left: 12px;
    @include media-breakpoint-up(lg) {
      margin-left: 24px;
    }
  }
}

.list-related-container {
  padding-top: 48px;
  background-color: #f3f5f6;
  padding-bottom: 48px;
  @include media-breakpoint-up(md) {
    padding-left: calc((100vw - 608px) / 2);
    padding-right: calc((100vw - 608px) / 2);
  }
  @include media-breakpoint-up(xl) {
    padding-top: 60px;
    padding-left: 12px;
    padding-right: 12px;
    position: relative;
    z-index: 511;
  }
}

.footer-wrapper {
  @include media-breakpoint-up(xl) {
    background-color: white;
    position: relative;
    z-index: 511;
  }
}

.share-toggled {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}

.article-body-wrapper {
  &__share-links {
    visibility: hidden;
    pointer-events: none;
    @include media-breakpoint-up(xl) {
      display: flex;
      visibility: initial;
      pointer-events: initial;
      position: fixed;
      top: calc((100vh - 140px) / 2);
      right: calc((100vw - 634px) / 4);
      bottom: 0;
      margin: 0 auto;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
