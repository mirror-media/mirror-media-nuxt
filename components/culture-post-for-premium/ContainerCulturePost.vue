<template>
  <section>
    <section class="culture-post" @wheel="wheelListener($event)">
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

      <UiSubTitleNavigator
        class="subtitle-navigator"
        :class="{
          'subtitle-navigator-moving-down': isWheel && isWheelingDown,
          'subtitle-navigator-moving-up': isWheel && !isWheelingDown,
        }"
        :items="indexes"
        :currentIndex="currentIndex"
      />

      <ContainerGptAd
        v-if="shouldShwowAd"
        class="ad ad--head"
        :pageKey="post.sectionIdFirst"
        adKey="HD"
      />

      <UiLanding
        :shouldShowMemberLabel="true"
        :sectionLabel="post.sectionLabelFirst"
        :title="post.title"
        :coverVideo="post.coverVideo"
        :coverPicture="post.coverPicture"
        :heroCaption="post.heroCaption"
        :shouldShwowAd="shouldShwowAd"
      />

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
          :sectionIdFirst="post.sectionIdFirst"
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

      <div v-if="shouldShwowAd" class="article-ad">
        <ContainerGptAd class="ad" :pageKey="post.sectionIdFirst" adKey="E1" />
        <ContainerGptAd
          v-show="isViewportWidthUpMd"
          class="ad"
          :pageKey="post.sectionIdFirst"
          adKey="E2"
        />
      </div>

      <LazyRenderer
        v-if="doesHaveAnyRelateds"
        :class="{
          'list-related-container--redesign':
            $GOExp['premium-list-related-redesign'].variant === '1',
          'list-related-container':
            $GOExp['premium-list-related-redesign'].variant !== '1',
        }"
        @load="fetchRelatedImgs"
      >
        <UiListRelatedRedesign
          v-if="$GOExp['premium-list-related-redesign'].variant === '1'"
          :items="relateds"
          :imgs="relatedImgs"
          @sendGa="sendGaForClick('related')"
        />
        <UiListRelated
          v-else
          :items="relateds"
          :imgs="relatedImgs"
          @sendGa="sendGaForClick('related')"
        />
        <UiMagazineAfterArticle
          v-if="
            $GOExp['premium-post-related-position'].variant === '1' &&
            articleBodyPageState === 'premiumPageIsLogin'
          "
        />
      </LazyRenderer>

      <ContainerGptAd
        v-if="shouldShwowAd"
        class="ad"
        :pageKey="post.sectionIdFirst"
        adKey="FT"
      />

      <UiWineWarning v-if="doesHaveWineCategory" />
    </section>
    <div class="footer-wrapper">
      <UiFooter />
    </div>
    <UiShareLinksToggled class="share-toggled" />
    <UiStickyAd
      v-if="shouldShwowAd && !doesHaveWineCategory"
      :pageKey="post.sectionIdFirst"
    />
    <ContainerFullScreenAds v-if="shouldShwowAd && !doesHaveWineCategory" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import UiArticleBody from './UiArticleBody.vue'
import UiArticleIndex from './UiArticleIndex.vue'
import UiListRelatedRedesign from './UiListRelatedRedesign.vue'
import UiListRelated from './UiListRelated.vue'
import UiArticleInfo from './UiArticleInfo.vue'
import UiSubTitleNavigator from './UiSubtitleNavigator.vue'
import UiLanding from '~/components/UiLanding.vue'
import ContainerHeaderSectionMember from '~/components/ContainerHeaderSectionMember.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import UiFooter from '~/components/UiFooter.vue'
import UiShareLinksToggled from '~/components/UiShareLinksToggled.vue'
import UiShareLinksHasCopyLink from '~/components/UiShareLinksHasCopyLink.vue'
import { SITE_OG_IMG, SITE_TITLE, SITE_URL } from '~/constants/index'
import { doesContainWineName } from '~/utils/article.js'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiMagazineAfterArticle from '~/components/culture-post-for-premium/UiMagazineAfterArticle.vue'

export default {
  name: 'ContainerCulturePost',

  components: {
    UiLanding,
    UiArticleInfo,
    ContainerHeaderSectionMember,
    UiArticleBody,
    UiArticleIndex,
    UiSubTitleNavigator,
    UiListRelatedRedesign,
    UiListRelated,
    UiWineWarning,
    UiFooter,
    UiShareLinksToggled,
    UiShareLinksHasCopyLink,
    ContainerGptAd,
    UiStickyAd,
    ContainerFullScreenAds,
    UiMagazineAfterArticle,
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
    shouldShwowAd: {
      type: Boolean,
      default: false,
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
      isWheel: false,
      isWheelingDown: false,
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
      isViewportWidthUpMd: 'viewport/isViewportWidthUpMd',
    }),
    movingPixel() {
      return `${this.movingDirection}px`
    },
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
        ogImage = {},
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
      const heroImgsResized = heroImage?.image?.resizedTargets || {}
      const ogImgsResized = ogImage?.image?.resizedTargets || {}
      let sectionIdFirst = sections?.[0]?.id
      if (
        sections?.[0]?.name === 'mirrorcolumn' ||
        sections?.[0]?.name === 'timesquare'
      ) {
        sectionIdFirst = '5964418a4bbe120f002a3198'
      } else if (sections?.[0]?.name === 'member') {
        sectionIdFirst = '5fe15f1e123c831000ee54c2'
      }

      return {
        id,
        title,
        writers,
        extendByline,
        photographers,
        brief: getBrief(),
        content: content.apiData || [],
        heroImage: heroImgsResized,
        ogImage: ogImgsResized,
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
        sectionLabelFirst: getSectionLabelFirst(),
        sectionIdFirst,
        tags,
        isTruncated,
      }

      /**
       * In premium article, we have to select one item of array `this.sections` and render it title.
       * The logic of select title for render is :
       * 1. If the first item's name of array `this.sections` is `member`, and second item of array is existed,
       * then show second item's title.
       * 2. If the first item's name of array `this.sections` is `member`, but second item of array is not existed,
       * then show first item's title, which name is `member`, title is `會員專區`.
       * 3. If the first item's name of array `this.sections` is not `member`,
       * then show first item's title, which name is definitely not `member`.
       * @returns {string}
       */
      function getSectionLabelFirst() {
        if (sections?.[0]?.name === 'member' && sections?.[1]) {
          return sections?.[1]?.title
        } else {
          return sections?.[0]?.title
        }
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
          type: item.type,
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
    indexes() {
      if (this.indexes.length !== 0) {
        this.detectCurrentIndex()
      }
    },
  },

  methods: {
    wheelListener(event) {
      this.isWheel = true
      if (event.deltaY >= 20) {
        this.isWheelingDown = true
      } else if (event.deltaY <= -20) {
        this.isWheelingDown = false
      }
    },
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
    sendGa(eventAction, eventLabel, eventCategory = 'premium') {
      this.$ga.event({
        eventAction,
        eventLabel,
        eventCategory,
      })
    },
    sendGaForClick(eventLabel) {
      this.sendGa('click', eventLabel)
    },
  },

  head() {
    const { title = '', brief = '', heroImage = {}, ogImage = {} } = this.post
    const description = brief.map((item) => item.content).join('')
    const image = ogImage.tablet?.url || heroImage.tablet?.url || SITE_OG_IMG
    const dableImgUrl = ogImage.tiny?.url || heroImage.tiny?.url || SITE_OG_IMG

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
$article-body-width-in-xl-viewport: 720px;
$article-body-width-in-xxl-viewport: 774px;

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
      max-width: $article-body-width-in-xl-viewport;
    }
    @include media-breakpoint-up(xxl) {
      max-width: $article-body-width-in-xxl-viewport;
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
.subtitle-navigator {
  display: none;

  @include media-breakpoint-up(xl) {
    display: inline-block;
    position: fixed;
    top: 50%;
    left: calc((100% - 634px) / 4);
    right: auto;
    bottom: auto;
    transform: translate(-50%, -50%);
    width: 240px;
    height: auto;
  }
  @include media-breakpoint-up(xxl) {
    left: calc((100% - #{$article-body-width-in-xxl-viewport}) / 4);
    min-width: 139px;
    max-width: 300px;
  }
}
.subtitle-navigator-moving-down {
  animation-name: subtitle-navigator-moving-down;

  animation-duration: 2s;
}
@keyframes subtitle-navigator-moving-down {
  0% {
    top: calc(50%);
  }
  50% {
    top: calc(55%);
  }
  100% {
    top: calc(50%);
  }
}
.subtitle-navigator-moving-up {
  animation-name: subtitle-navigator-moving-up;

  animation-duration: 2s;
}
@keyframes subtitle-navigator-moving-up {
  0% {
    top: calc(50%);
  }
  50% {
    top: calc(45%);
  }
  100% {
    top: calc(50%);
  }
}

.article-info {
  margin: 36px 20px 0 20px;
  @include media-breakpoint-up(md) {
    max-width: 608px;
    margin: 52px auto 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: $article-body-width-in-xl-viewport;
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

.list-related-container--redesign {
  padding-top: 48px;
  background-color: #f3f5f6;
  padding-bottom: 4px;
  @include media-breakpoint-up(md) {
    padding-left: calc((100% - 608px) / 2);
    padding-right: calc((100% - 608px) / 2);
  }
  @include media-breakpoint-up(xl) {
    padding-top: 60px;
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 16px;
    margin-bottom: 60px;
    position: relative;
    z-index: 498;
  }
}

.list-related-container {
  margin: 48px 20px 48px 20px;
  @include media-breakpoint-up(md) {
    margin: 0;
    padding-top: 48px;
    padding-left: calc((100vw - 608px) / 2);
    padding-right: calc((100vw - 608px) / 2);
    padding-bottom: 48px;
  }
  @include media-breakpoint-up(xl) {
    padding-left: calc((100vw - #{$article-body-width-in-xl-viewport}) / 2);
    padding-right: calc((100vw - #{$article-body-width-in-xl-viewport}) / 2);
    background-color: white;
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
  bottom: 100px;
  right: 20px;
  z-index: 400;
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
      right: calc((100vw - #{$article-body-width-in-xl-viewport}) / 4 - 18px);
      bottom: 0;
      margin: 0 auto;
    }
    @include media-breakpoint-up(xxl) {
      right: calc((100vw - #{$article-body-width-in-xxl-viewport}) / 4 - 18px);
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

.ad {
  margin: 20px 0;

  &--head {
    margin-top: 88px;
    @include media-breakpoint-up(md) {
      margin-top: 112px;
    }
  }
}

.article-ad {
  display: flex;
  justify-content: center;

  .ad:nth-child(2) {
    margin-left: 40px;
  }
}
</style>
