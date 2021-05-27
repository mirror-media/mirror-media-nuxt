<template>
  <section class="culture-post">
    <!--    <ContainerHeaderSectionMember-->
    <!--      v-if="isCurrentPagePremium"-->
    <!--      class="header"-->
    <!--      @sidebarToggle="handleIndexActive(!isIndexActive)"-->
    <!--    />-->
    <!--    <a-->
    <!--      v-else-->
    <!--      :href="SITE_URL"-->
    <!--      class="logo"-->
    <!--      target="_blank"-->
    <!--      rel="noopener noreferrer"-->
    <!--    >-->
    <!--      <img src="~/assets/logo@2x.png" :alt="SITE_TITLE" />-->
    <!--    </a>-->

    <!--    <UiArticleIndex-->
    <!--      :items="indexes"-->
    <!--      :currentIndex="currentIndex"-->
    <!--      :isIndexActive="isIndexActive"-->
    <!--      @closeIndex="handleIndexActive(false)"-->
    <!--      @openIndex="handleIndexActive(true)"-->
    <!--    />-->

    <div class="landing-info">
      <UiSectionLabel v-text="post.sectionLabelFirst" />
      <UiH1 class="landing-info__title" v-html="post.title" />
    </div>

    <div class="cover">
      <UiTheCover :video="post.coverVideo" :picture="post.coverPicture" />
      <UiHeroCaption class="cover__hero-caption" v-text="post.heroCaption" />
    </div>

    <UiArticleInfo
      class="article-info"
      :publishTime="post.publishedDate"
      :updateTime="post.updatedAt"
      :writers="post.writers"
      :photographers="post.photographers"
      :tags="post.tags"
    />

    <!--    <div class="info">-->
    <!--      <div>發布時間 {{ post.publishedDate }}</div>-->

    <!--      <div class="credit">-->
    <!--        <span v-for="credit in post.credits" :key="credit">{{ credit }}</span>-->
    <!--      </div>-->
    <!--    </div>-->

    <UiArticleBody
      ref="articleBody"
      class="culture-post__article-body"
      :brief="post.brief"
      :content="post.content"
      :pageState="articleBodyPageState"
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

import UiTheCover from './UiTheCover.vue'
import UiArticleBody from './UiArticleBody.vue'
import UiArticleIndex from './UiArticleIndex.vue'
import UiListRelated from './UiListRelated.vue'
import ContainerHeaderSectionMember from '~/components/ContainerHeaderSectionMember.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

import { SITE_OG_IMG, SITE_TITLE, SITE_URL } from '~/constants/index'
import { doesContainWineName } from '~/utils/article.js'
import UiH1 from '~/components/culture-post-for-premium/UiH1.vue'
import UiSectionLabel from '~/components/culture-post-for-premium/UiSectionLabel.vue'
import UiHeroCaption from '~/components/culture-post-for-premium/UiHeroCaption.vue'
import UiArticleInfo from '~/components/culture-post-for-premium/UiArticleInfo.vue'

export default {
  name: 'ContainerCulturePost',

  components: {
    UiArticleInfo,
    UiHeroCaption,
    UiSectionLabel,
    UiH1,
    // eslint-disable-next-line vue/no-unused-components
    ContainerHeaderSectionMember,
    // eslint-disable-next-line vue/no-unused-components
    UiTheCover,
    UiArticleBody,
    // eslint-disable-next-line vue/no-unused-components
    UiArticleIndex,
    UiListRelated,
    UiWineWarning,
  },

  props: {
    story: {
      type: Object,
      default: () => ({}),
      required: true,
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
    post() {
      const {
        title = '',
        brief = {},
        writers = [],
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
      } = this.story

      const heroVideoSrc = heroVideo.video?.url || ''
      const heroVideoPoster =
        heroVideo.coverPhoto?.image?.resizedTargets?.mobile?.url || false
      const heroImgsResized = heroImage.image?.resizedTargets || {}

      return {
        title,
        writers,
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
          mobileImage: mobileImage.image?.resizedTargets || {},
        },
        publishedDate,
        updatedAt,
        relateds,
        sectionLabelFirst: sections?.[0]?.title,
        tags,
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

.landing-info {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(md) {
    padding: 0;
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