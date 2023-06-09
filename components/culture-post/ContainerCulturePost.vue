<template>
  <section class="culture-post">
    <a :href="SITE_URL" class="logo" target="_blank" rel="noopener noreferrer">
      <img src="~/assets/logo@2x.png" :alt="SITE_TITLE" />
    </a>

    <UiArticleIndex
      :items="indexes"
      :currentIndex="currentIndex"
      :isIndexActive="isIndexActive"
      @closeIndex="handleIndexActive(false)"
      @openIndex="handleIndexActive(true)"
    />

    <UiTheCover
      :title="post.title"
      :video="post.coverVideo"
      :picture="post.coverPicture"
    />

    <div class="info">
      <div>發布時間 {{ post.publishedDate }}</div>

      <div class="credit">
        <span v-for="credit in post.credits" :key="credit">{{ credit }}</span>
      </div>
      <div v-if="shouldShowDonate" class="donate">
        <UiDonateButton class="donate-btn" />
        <UiBeSubscriberButton class="subscribe-btn" />
      </div>
    </div>

    <UiArticleBody
      v-if="!isPremium"
      ref="articleBody"
      class="culture-post__article-body"
      :brief="post.brief"
      :content="post.content"
      :pageState="articleBodyPageState"
      :isPremium="isPremium"
    />
    <UiArticleBodyForPremium
      v-else
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
      :shouldShwowAd="shouldShwowAd"
    />

    <LazyRenderer
      v-if="doesHaveAnyRelateds"
      class="list-related-container"
      @load="fetchRelatedImgs"
    >
      <UiListRelated :items="relateds" :imgs="relatedImgs" />
    </LazyRenderer>

    <div v-if="updatedAt" class="updated-at">更新時間／{{ updatedAt }}</div>

    <UiWineWarning v-if="doesHaveWineCategory" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import UiBeSubscriberButton from '../UiBeSubscriberButton.vue'
import UiTheCover from './UiTheCover.vue'
import UiArticleBody from './UiArticleBody.vue'
import UiArticleIndex from './UiArticleIndex.vue'
import UiListRelated from './UiListRelated.vue'
import UiArticleBodyForPremium from '~/components/culture-post-for-premium/UiArticleBody.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import UiDonateButton from '~/components/UiDonateButton.vue'

import { SITE_OG_IMG, SITE_TITLE, SITE_URL } from '~/constants/index'
import { doesContainWineName, getFormattedTimeStr } from '~/utils/article.js'

export default {
  name: 'ContainerCulturePost',

  components: {
    UiTheCover,
    UiArticleBody,
    UiArticleIndex,
    UiListRelated,
    UiWineWarning,
    UiArticleBodyForPremium,
    UiDonateButton,
    UiBeSubscriberButton,
  },

  props: {
    story: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
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
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),
    shouldShowDonate() {
      const slug = this.$route?.params?.slug ?? ''
      if (/^\d{8}(mkt|cnt|prf|corpmkt)/.test(slug)) {
        return false
      }
      return this.$config.donateFeatureToggle
    },
    post() {
      const {
        id = '',
        title = '',
        brief = {},
        writers = [],
        photographers = [],
        cameraMan = [],
        extendByline = '',
        content = {},
        heroVideo = {},
        heroImage = {},
        ogImage = {},
        mobileImage = {},
        publishedDate = '',
        updatedAt = '',
        relateds = [],
        isTruncated = false,
        ogDescription = '',
      } = this.story

      const heroVideoSrc = heroVideo?.video?.url || ''
      const heroVideoPoster =
        heroVideo?.coverPhoto?.image?.resizedTargets?.mobile?.url || false
      const heroImgsResized = heroImage?.image?.resizedTargets || {}
      const ogImgsResized = ogImage?.image?.resizedTargets || {}

      return {
        id,
        title,
        credits: getCredits(),
        brief: getBrief(),
        content: content.apiData || [],
        heroImage: heroImgsResized,
        ogImage: ogImgsResized,
        coverVideo: {
          src: heroVideoSrc,
          poster: heroVideoPoster,
        },
        coverPicture: {
          heroImage: heroImgsResized,
          mobileImage: mobileImage?.image?.resizedTargets || {},
        },
        publishedDate: getFormattedTimeStr(publishedDate),
        updatedAt: getFormattedTimeStr(updatedAt),
        relateds,
        isTruncated,
        ogDescription,
      }

      function getCredits() {
        return [
          [writers, '記者'],
          [photographers, '攝影'],
          [cameraMan, '影音'],
          [extendByline, ''],
        ]
          .filter(doesHaveAnyPeople)
          .map(buildText)

        function doesHaveAnyPeople([people]) {
          return people.length > 0
        }

        function buildText([people, role]) {
          return role !== '' ? `${role}／${joinNames(people)}` : people
        }

        function joinNames(items = []) {
          return items.map((item) => item.name).join('、')
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
              content: item.content[0],
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
  },

  head() {
    const {
      title = '',
      brief = '',
      heroImage = {},
      ogImage = {},
      ogDescription = '',
    } = this.post
    const description =
      ogDescription || brief.map((item) => item.content).join('')
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
.culture-post {
  color: rgba(#000, 0.87);
  word-break: break-word;
  overflow-wrap: break-word;

  &__article-body {
    padding-left: 10px;
    padding-right: 10px;
    @include media-breakpoint-up(md) {
      padding-left: 0;
      padding-right: 0;
      margin-left: auto;
      margin-right: auto;
      max-width: 700px;
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
.donate {
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 20px;
  @include media-breakpoint-up(md) {
    margin-top: 12px;
  }
  @include media-breakpoint-up(xl) {
    margin-top: 24px;
  }

  .donate-btn {
    margin-top: 0;
    margin-right: 8px;
  }
}
.list-related-container {
  margin-left: 10px;
  margin-right: 10px;
}

.updated-at {
  padding-top: 12px;
  padding-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  letter-spacing: 1px;
  border-top: 1px solid #979797;
  @include media-breakpoint-up(md) {
    margin-left: auto;
    margin-right: auto;
    max-width: 700px;
  }
  @include media-breakpoint-up(lg) {
    max-width: 900px;
  }
}
</style>
