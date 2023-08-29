<template>
  <section>
    <section v-if="isStylePhotography">
      <ContainerPhotoGallery :story="story" />
    </section>
    <section v-else-if="isStyleWide">
      <ContainerCulturePost :story="story" :isPremium="false" />
    </section>
    <section v-else>
      <ContainerHeader />

      <UiLanding
        class="landing"
        :sectionLabel="post.sectionLabelFirst"
        :sectionLabelColor="post.sectionLabelFirstColor"
        :sectionLabelHref="`/section/${post.sectionFirstName}`"
        :title="post.title"
        :titleStyle="{
          fontFamily: 'sans-serif',
          fontWeight: 'normal',
        }"
        :coverVideo="post.coverVideo"
        :coverPicture="post.coverPicture"
        :heroCaption="post.heroCaption"
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
          :briefColor="post.sectionLabelFirstColor"
          :content="post.content"
          :isArticleContentTruncatedByGateway="post.isTruncated"
          :isLoading="false"
          :isFail="false"
          :failTimes="0"
          :hideInvite="true"
          @reload="handleReload"
        />
        <transition name="fade">
          <UiShareLinksHasCopyLink
            v-show="showShareLinksAside"
            class="article-body-wrapper__share-links"
            :direction="'vertical-reverse'"
          />
        </transition>
      </div>
      <div class="additional-info-wrapper">
        <UiAnniversary class="anniversary" />
        <UiSocialNetworkServices class="sns" />
      </div>
      <LazyRenderer
        class="story__list related-list"
        @load="handleLoadStoryListRelated"
      >
        <UiStoryListRelatedMobileLayoutColumn
          :items="relateds"
          :images="relatedImages"
          @sendGa="sendGaForClick('related')"
        >
          <!--        <template v-if="canAdvertise" #ads>-->
          <!--          <ClientOnly>-->
          <!--            <MicroAdWithLabel-->
          <!--              v-for="unit in microAdUnits[device]"-->
          <!--              :key="unit.name"-->
          <!--              :unitId="unit.id"-->
          <!--            />-->
          <!--            <div id="_popIn_recommend"></div>-->
          <!--          </ClientOnly>-->
          <!--        </template>-->
        </UiStoryListRelatedMobileLayoutColumn>
      </LazyRenderer>
      <section
        v-observe-visibility="handleLatestListVisibilityChanged"
        class="latest-list-wrapper"
      >
        <h1 class="latest-list-wrapper__title">最新文章</h1>
        <LazyRenderer
          class="latest-list-wrapper__latest-list"
          @load="fetchLatestStories"
        >
          <section v-if="doesHaveLatestStories">
            <UiArticleListCompact
              :items="latestStories"
              :isStyleAdjusted="true"
              @sendGa="sendGaForClick('popular')"
            />
          </section>
        </LazyRenderer>
      </section>
      <div class="separator" />
      <section class="popular-list-wrapper">
        <h1 class="popular-list-wrapper__title">熱門文章</h1>
        <LazyRenderer
          class="popular-list-wrapper__popular-list"
          @load="fetchPopularStories"
        >
          <section v-if="doesHavePopularStories">
            <UiArticleListCompact
              :items="popularStories"
              :titleColor="'#054f77'"
              @sendGa="sendGaForClick('popular')"
            />
          </section>
        </LazyRenderer>
      </section>
      <UiShareLinksToggled class="share-toggled" />
    </section>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { useViewport } from '~/composition/viewport.js'

import UiLanding from '~/components/UiLanding.vue'
import UiArticleInfo from '~/components/culture-post-for-premium/UiArticleInfo.vue'
import UiArticleBody from '~/components/culture-post-for-premium/UiArticleBody.vue'
import UiAnniversary from '~/components/UiAnniversary.vue'
import UiSocialNetworkServices from '~/components/UiSocialNetworkServices.vue'
import UiStoryListRelatedMobileLayoutColumn from '~/components/UiStoryListRelatedMobileLayoutColumn.vue'
import UiArticleListCompact from '~/components/UiArticleListCompact.vue'
import UiShareLinksToggled from '~/components/UiShareLinksToggled.vue'
import UiShareLinksHasCopyLink from '~/components/UiShareLinksHasCopyLink.vue'
import ContainerPhotoGallery from '~/components/photo-gallery/ContainerPhotoGallery.vue' // import MicroAdWithLabel from '~/components/MicroAdWithLabel.vue'
import ContainerHeader from '~/components/ContainerHeader.vue'
import ContainerCulturePost from '~/components/culture-post/ContainerCulturePost.vue'
import { DOMAIN_NAME, ENV, PREVIEW_QUERY } from '~/configs/config'
import { getSectionColor } from '~/utils/index.js'
import saveMemberArticleHistoryLocally from '~/mixins/save-member-article-history-locally'

// import { DABLE_WIDGET_IDS, MICRO_AD_UNITS } from '~/constants/ads'
import {
  SITE_DESCRIPTION,
  SITE_OG_IMG,
  SITE_TITLE,
  SITE_URL,
} from '~/constants'

export default {
  middleware: ['handle-story-premium-redirect'],
  components: {
    UiLanding,
    UiArticleInfo,
    UiArticleBody,
    UiAnniversary,
    UiSocialNetworkServices,
    UiStoryListRelatedMobileLayoutColumn,
    UiArticleListCompact,
    UiShareLinksToggled,
    UiShareLinksHasCopyLink,
    ContainerPhotoGallery,
    ContainerHeader,
    ContainerCulturePost,

    // MicroAdWithLabel,
  },
  layout: 'empty',
  setup() {
    useViewport()
  },
  mixins: [saveMemberArticleHistoryLocally],
  async fetch() {
    const processPostResponse = (response) => {
      if (response.status === 'fulfilled') {
        this.story = response.value?.items?.[0] ?? {}

        // redirect
        const { style, slug, redirect } = this.story
        if (redirect && redirect?.trim()) {
          const redirectHref = redirect?.trim()
          if (
            redirectHref?.startsWith('https://') ||
            redirectHref?.startsWith('http://')
          ) {
            this.$nuxt.context.redirect(redirectHref)
          } else if (redirectHref?.startsWith('www.')) {
            this.$nuxt.context.redirect(`https://${redirectHref}`)
          } else {
            this.$nuxt.context.redirect(`/pre/story/${redirectHref}`)
          }
        }
        if (style === 'campaign') {
          this.$nuxt.context.redirect(`/campaigns/${slug}/index.html`)
        } else if (style === 'projects') {
          this.$nuxt.context.redirect(`/projects/${slug}/index.html`)
        }

        this.$store.commit(
          'setCanAdvertise',
          !this.story.hiddenAdvertised ?? true
        )
        const isTitleExist = this.story.title
        const isContentExist = (this.story?.content?.apiData ?? []).length > 0
        if (!isTitleExist || !isContentExist) {
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
            this.$nuxt.context.res.setHeader(
              'Cache-Control',
              'public, max-age=10'
            )
          }
          this.$nuxt.error({ statusCode: 404 })
        }

        return true
      } else {
        const { statusCode, message } = response.reason

        if (process.server) {
          this.$nuxt.context.res.statusCode = statusCode
          this.$nuxt.context.res.setHeader(
            'Cache-Control',
            'public, max-age=10'
          )
        }
        throw new Error(message)
      }
    }

    let isPreviewMode = false
    {
      const [name, value] = PREVIEW_QUERY.split('=')

      isPreviewMode = this.$route.query[name] === value
    }

    const fetchPartnersAndTopicsData = async () => {
      await Promise.all([
        this.$store.dispatch('partners/fetchPartnersData'),
        this.$store.dispatch('topics/fetchTopicsData'),
      ])
    }

    if (!this.storySlug) {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404
        this.$nuxt.context.res.setHeader('Cache-Control', 'public, max-age=10')
      }
      this.$nuxt.error({ statusCode: 404 })
    } else if (!isPreviewMode) {
      const [postResponse] = await Promise.allSettled([
        this.$fetchStoryFromMembershipGateway({
          slug: this.storySlug,
          isAudioSiteOnly: false,
          clean: 'content',
          related: 'article',
        }),
        fetchPartnersAndTopicsData(),
      ])
      const canContinueProcessing = processPostResponse(postResponse)

      if (canContinueProcessing) {
        this.membershipTokenState = postResponse?.value?.tokenState
      }
    } else {
      const [postResponse] = await Promise.allSettled([
        this.$fetchDrafts({
          slug: this.storySlug,
          isAudioSiteOnly: false,
          clean: 'content',
          related: 'article',
        }),
        fetchPartnersAndTopicsData(),
      ])

      processPostResponse(postResponse)
    }
  },
  data() {
    return {
      story: {},
      membershipTokenState: undefined,

      shouldLoadPopinScript: false,

      // microAdUnits: MICRO_AD_UNITS.STORY,

      relatedImages: [],

      latestStories: [],
      hasLoadedLatestStories: false,

      popularStories: [],

      showShareLinksAside: false,
    }
  },
  computed: {
    storySlug() {
      return this.$route.params.slug
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
        sectionFirstName: sections?.[0]?.name,
        sectionLabelFirstColor: getSectionColor(sections?.[0]?.name),
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
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },

    ...mapState({
      canAdvertise: (state) => state.canAdvertise,
    }),
    isAdvertised() {
      return this.story.isAdvertised || false
    },
    isInvisible() {
      return this.story.state === 'invisible'
    },
    relateds() {
      return (this.story.relateds ?? []).filter((item) => item.slug)
    },
    isStylePhotography() {
      return this.story.style === 'photography'
    },
    section() {
      return this.story.sections?.[0] || {}
    },
    sectionId() {
      return this.section.id
    },
    doesHaveLatestStories() {
      return this.latestStories.length > 0
    },
    doesHavePopularStories() {
      return this.popularStories.length > 0
    },
    isStyleWide() {
      return this.story.style === 'wide'
    },
  },

  methods: {
    handleLoadStoryListRelated() {
      this.fetchRelatedImages()

      // this.shouldLoadPopinScript = true
    },
    async fetchRelatedImages() {
      const imageIds = this.relateds.map((item) => item.heroImage)

      const { items = [] } = await this.$fetchImages({
        id: imageIds,
        maxResults: this.relateds.length,
      })
      this.relatedImages = items
    },
    doesNotHaveCurrentStorySlug(item) {
      return item.slug !== this.storySlug
    },
    async fetchLatestStories() {
      const { items = [] } = await this.$fetchList({
        sort: '-publishedDate',
        sections: this.sectionId,
      })

      this.latestStories = items
        .filter(this.doesNotHaveCurrentStorySlug)
        .slice(0, 6)
        .map(function transformContent({
          slug = '',
          title = '',
          heroImage = {},
          categories = [],
          sections = [],
        }) {
          return {
            slug,
            title,
            href: `/pre/story/${slug}/`,
            imgSrc: heroImage ? getImgSrc(heroImage) : SITE_OG_IMG,
            label: getLabel(categories),
            sectionName: sections[0]?.name,
          }
        })

      this.hasLoadedLatestStories = true
    },
    async fetchPopularStories() {
      if (ENV === 'lighthouse') {
        return
      }

      const { report: items = [] } = await this.$fetchPopular()
      this.popularStories = items
        .slice(0, 9)
        .map(function transformContent({
          slug = '',
          title = '',
          heroImage = {},
          sections = [],
        }) {
          return {
            slug,
            title,
            href: `/pre${slug}`,
            imgSrc: getImgSrc(heroImage),
            label: getLabel(sections),
            sectionName: sections[0]?.name,
          }
        })
    },
    handleShareLinksVisibilityChanged(isVisible) {
      this.showShareLinksAside = !isVisible
    },
    handleLatestListVisibilityChanged(isVisible) {
      this.showShareLinksAside = !isVisible
    },
    handleReload() {},
  },
  head() {
    const {
      brief = {},
      heroImage = {},
      isAdult = false,
      ogDescription = '',
      ogImage = {},
      ogTitle = '',
      publishedDate = Date.now(),
      updatedAt = Date.now(),
      title = '',
      topics = {},
      writers = [],
      tags = [],
    } = this.story
    const robots = isAdult ? 'noindex' : 'index'
    const metaTitle = ogTitle || title || SITE_TITLE
    const description =
      ogDescription ||
      brief.apiData
        ?.find((item) => item.type === 'unstyled')
        ?.content?.[0]?.replace(/<\/?[^>]+(>|$)/gm, '') ||
      ''
    const imgUrl =
      ogImage?.image?.resizedTargets?.tablet?.url ||
      heroImage?.image?.resizedTargets?.tablet?.url ||
      SITE_OG_IMG
    const dableImgUrl =
      ogImage?.image?.resizedTargets?.tiny?.url ||
      heroImage?.image?.resizedTargets?.tiny?.url ||
      SITE_OG_IMG
    const pageUrl = `https://${DOMAIN_NAME}${this.$route.path}`

    const publishedDateIso = new Date(publishedDate).toISOString()
    const topicId = topics?.id ?? ''
    const { name: writerName, id: writerId } = writers[0] || {}
    const tagNamesStr = tags.map((tag) => tag.name).join(', ')

    return {
      title,
      meta: [
        { hid: 'robots', name: 'robots', content: robots },
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:title', property: 'og:title', content: metaTitle },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        { hid: 'og:image', property: 'og:image', content: imgUrl },
        {
          hid: 'og:url',
          property: 'og:url',
          content: pageUrl,
        },
        tagNamesStr !== ''
          ? {
              name: 'news_keywords',
              content: tagNamesStr,
            }
          : {},
        tagNamesStr !== ''
          ? { hid: 'keywords', name: 'keywords', content: tagNamesStr }
          : {},
        this.hasSection
          ? { name: 'section-name', content: this.sectionName }
          : {},
        this.hasCategory
          ? { name: 'category-name', content: this.category.name }
          : {},
        { name: 'topic-id', content: topicId },
        { hid: 'twitter:title', name: 'twitter:title', content: metaTitle },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: imgUrl },
        { property: 'dable:item_id', content: this.storySlug },
        { property: 'dable:author', content: writerName },
        { property: 'dable:image', content: dableImgUrl },
        this.hasSection
          ? {
              property: 'article:section',
              content: this.sectionTitle,
            }
          : {},
        this.hasCategory
          ? { property: 'article:section2', content: this.categoryTitle }
          : {},
        { property: 'article:published_time', content: publishedDateIso },
      ],
      link: [
        { rel: 'canonical', href: pageUrl },
        this.isInvisible || this.isAdvertised
          ? {}
          : {
              rel: 'amphtml',
              href: `${SITE_URL}/story/amp/${this.storySlug}/`,
            },
        {
          hid: 'gptLink',
          skip: !this.canAdvertise,
          rel: 'preload',
          href: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
          as: 'script',
        },
      ],
      script: [
        ...jsonLds.bind(this)(),

        /*
         * {
         *   hid: 'gptScript',
         *   skip: !this.canAdvertise,
         *   src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
         *   async: true,
         * },
         * {
         *   hid: 'dable',
         *   skip: !this.shouldLoadDableScript,
         *   innerHTML: `
         *     (function (d, a, b, l, e, _) {
         *       if (d[b] && d[b].q) return
         *       d[b] = function () {
         *         ;(d[b].q = d[b].q || []).push(arguments)
         *       }
         *       e = a.createElement(l)
         *       e.async = 1
         *       e.charset = 'utf-8'
         *       e.src = '//static.dable.io/dist/plugin.min.js'
         *       _ = a.getElementsByTagName(l)[0]
         *       _.parentNode.insertBefore(e, _)
         *     })(window, document, 'dable', 'script')
         *     dable('setService', 'mirrormedia.mg')
         *     dable('sendLogOnce')
         *     dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.MB}')
         *     dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.PC}')
         *   `,
         * },
         * {
         *   hid: 'popinAd',
         *   skip: !this.shouldLoadPopinScript,
         *   innerHTML: `
         *     (function () {
         *       var pa = document.createElement('script')
         *       pa.type = 'text/javascript'
         *       pa.charset = 'utf-8'
         *       pa.async = true
         *
         *       pa.src =
         *         window.location.protocol +
         *         '//api.popin.cc/searchbox/mirrormedia_tw.js'
         *
         *       var s = document.getElementsByTagName('script')[0]
         *       s.parentNode.insertBefore(pa, s)
         *     })()
         *   `,
         * },
         */
      ],
      __dangerouslyDisableSanitizersByTagID: {
        dable: ['innerHTML'],
        popinAd: ['innerHTML'],
      },
    }

    function jsonLds() {
      let jsonLdNewsArticle
      const jsonLdBreadcrumbList = {
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org/',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbList.bind(this)(),
        },
      }

      {
        const hasWriter = writers[0] !== undefined
        const authorName = hasWriter ? writerName : '鏡週刊'
        const logoUrl = require('~/assets/logo.png')

        jsonLdNewsArticle = {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org/',
            '@type': 'NewsArticle',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': pageUrl,
            },
            headline: title,
            image: imgUrl,
            datePublished: publishedDateIso,
            dateModified: new Date(updatedAt).toISOString(),
            author: {
              '@type': hasWriter ? 'Person' : 'Organization',
              name: authorName,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_TITLE,
              logo: {
                '@type': 'ImageObject',
                url: logoUrl,
              },
            },
            description,
            url: pageUrl,
            thumbnailUrl: imgUrl,
            articleSection: this.hasSection ? this.sectionTitle : undefined,
          },
        }

        if (hasWriter) {
          const jsonLdPerson = {
            type: 'application/ld+json',
            json: {
              '@context': 'http://schema.org/',
              '@type': 'Person',
              name: authorName,
              url: `${SITE_URL}/author/${writerId}/`,
              brand: {
                '@type': 'Brand',
                name: SITE_TITLE,
                url: SITE_URL,
                image: logoUrl,
                logo: logoUrl,
                description: SITE_DESCRIPTION,
              },
            },
          }

          return [jsonLdNewsArticle, jsonLdPerson, jsonLdBreadcrumbList]
        }
      }

      return [jsonLdNewsArticle, jsonLdBreadcrumbList]
    }

    function breadcrumbList() {
      const items = [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_TITLE,
          item: SITE_URL,
        },
      ]

      if (this.hasSection) {
        items.push({
          '@type': 'ListItem',
          position: items.length + 1,
          name: this.sectionTitle,
          item: `${SITE_URL}/section/${this.sectionName}`,
        })
      }

      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: title,
        item: pageUrl,
      })

      return items
    }
  },
}

function getImgSrc({ image = {} } = {}) {
  return image.resizedTargets?.mobile?.url || SITE_OG_IMG
}

function getLabel([item = {}] = []) {
  return item.title || '新聞'
}
</script>

<style lang="scss" scoped>
.story {
  &__list {
    margin: 45px 0 0 0;
  }
}

.landing {
  &::v-deep {
    .landing-info {
      padding: 24px 20px 0 20px;
      @include media-breakpoint-up(xl) {
        padding: 48px 0 0 0;
      }
    }

    .landing-info__title {
      font-weight: normal;
      font-size: 24px;
      @include media-breakpoint-up(md) {
        max-width: 280px;
      }
      @include media-breakpoint-up(xl) {
        font-size: 32px;
        max-width: initial;
      }
    }

    .the-cover {
      max-width: 1200px;
    }

    .cover__hero-caption {
      @include media-breakpoint-up(xl) {
        width: 960px;
      }
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
    max-width: 720px;
    margin: 64px auto 0 auto;
  }
  @include media-breakpoint-up(xxl) {
    max-width: 774px;
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
      right: calc((100vw - 960px) / 4);
      bottom: 0;
      margin: 0 auto;
    }
  }

  &::v-deep {
    .figure {
      &__img {
        @include media-breakpoint-up(xl) {
          left: 0;
          margin: 0 auto;
        }
      }
      &__caption {
        @include media-breakpoint-up(xl) {
          width: 720px;
          margin: 16px auto 0 auto;
        }
      }
    }

    .infobox {
      @include media-breakpoint-up(xl) {
        left: 0;
        margin: 0 auto;
      }
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
      max-width: 720px;
    }
    @include media-breakpoint-up(xxl) {
      max-width: 774px;
    }
  }
}

.additional-info-wrapper {
  @include media-breakpoint-up(xl) {
    display: flex;
    justify-content: space-between;
    max-width: 720px;
    margin: 0 auto;
  }
  @include media-breakpoint-up(xxl) {
    max-width: 774px;
  }
}

.anniversary {
  margin: 0 20px;
  @include media-breakpoint-up(md) {
    max-width: 608px;
    margin: 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: initial;
    flex: 1 1 auto;
    margin: 0 20px 0 0;
  }
  @include media-breakpoint-up(xxl) {
    max-width: 774px;
  }
}

.sns {
  margin: 12.5px 20px 0 20px;
  @include media-breakpoint-up(md) {
    max-width: 608px;
    margin: 12.5px auto 0 auto;
  }
  @include media-breakpoint-up(xl) {
    margin: 0;
    min-width: 265px;
  }
}

.related-list {
  @include media-breakpoint-up(md) {
    max-width: 608px;
    margin: 12.5px auto 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1000px;
  }
}

.latest-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    align-items: flex-start;
    max-width: 608px;
    margin: 0 auto;
    padding: 0 0 36px 0;
  }
  @include media-breakpoint-up(xl) {
    align-items: center;
    max-width: initial;
  }

  &__title {
    color: #888888;
    font-size: 21px;
    line-height: 1.5;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 20px;
    }
  }
  &__latest-list {
    margin: 20px 0 0 0;
    width: 100%;
    @include media-breakpoint-up(md) {
      margin: 16px 0 0 0;
    }
    @include media-breakpoint-up(xl) {
      max-width: 1176px;
      margin: 16px auto 0 auto;
    }
  }
}

.separator {
  width: 70%;
  height: 2px;
  background-color: #000000;
  margin: 0 auto;
  @include media-breakpoint-up(md) {
    width: calc(100% - 40px);
    max-width: 618px;
  }
  @include media-breakpoint-up(xl) {
    width: 208px;
    max-width: initial;
  }
}

.popular-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    align-items: flex-start;
    max-width: 658px;
    margin: 0 auto;
  }
  @include media-breakpoint-up(xl) {
    align-items: center;
    max-width: initial;
  }

  &__title {
    color: #054f77;
    font-size: 21px;
    line-height: 1.5;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 20px;
    }
  }
  &__popular-list {
    width: 100%;
    margin: 20px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 16px 0 0 0;
    }
    @include media-breakpoint-up(xl) {
      max-width: 1176px;
      margin: 16px auto 0 auto;
    }
  }
}

.share-toggled {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 400;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}

//.micro-ad {
//  margin-top: 16px;
//  color: #808080;
//
//  &::v-deep {
//    #compass-fit-widget {
//      font-family: inherit !important;
//      margin-bottom: 0 !important;
//    }
//
//    #compass-fit-widget-content {
//      display: flex;
//
//      &::before {
//        content: '';
//        display: block;
//        width: 10px;
//        flex-shrink: 0;
//        background-color: #808080;
//      }
//    }
//
//    .pop_item_title,
//    .popListVert-list__item--text {
//      display: flex;
//      align-items: center;
//      flex-grow: 1;
//      background-color: #eee !important;
//      padding: 16px;
//      @include media-breakpoint-up(md) {
//        padding-left: 32px;
//        padding-right: 32px;
//      }
//    }
//
//    .pop_item_title a,
//    .popListVert-list__item--text h2 {
//      font-size: 18px;
//      line-height: 1.3;
//      display: block;
//      display: -webkit-box;
//      -webkit-line-clamp: 2;
//      -webkit-box-orient: vertical;
//      overflow: hidden;
//      // 2.6em = 1em * 1.3 * 2
//      max-height: 2.6em;
//    }
//
//    .pop_item_title a {
//      font-family: inherit !important;
//    }
//
//    figure,
//    .popListVert-list__item--img {
//      position: relative;
//      flex-shrink: 0;
//      order: 1;
//      width: 33%;
//      padding-top: calc(33% * 0.75);
//      @include media-breakpoint-up(md) {
//        width: 25%;
//        padding-top: calc(25% * 0.75);
//      }
//      @include media-breakpoint-up(xl) {
//        width: 20%;
//        padding-top: calc(20% * 0.75);
//      }
//
//      img {
//        position: absolute;
//        top: 0;
//        left: 0;
//        width: 100%;
//        height: 100%;
//        object-fit: cover;
//      }
//    }
//
//    .pop_item--colorBlock,
//    .popListVert-list__item--text > div {
//      display: none;
//    }
//
//    .popListVert-list__item {
//      display: flex;
//      flex-grow: 1;
//    }
//
//    .popListVert-list__item--text a {
//      font-weight: 400 !important;
//    }
//  }
//}
//
//#_popIn_recommend {
//  position: relative;
//  &::v-deep {
//    ._popIn_recommend_container {
//      padding-bottom: 0;
//    }
//
//    ._popIn_recommend_article {
//      &::before {
//        flex-shrink: 0;
//        position: static;
//        height: auto;
//      }
//    }
//
//    ._popIn_recommend_art_title {
//      flex-grow: 1;
//      margin-left: 0;
//      white-space: normal;
//      @include media-breakpoint-up(md) {
//        padding-left: 32px;
//        padding-right: 32px;
//      }
//
//      a {
//        display: block;
//        display: -webkit-box;
//        -webkit-line-clamp: 2;
//        -webkit-box-orient: vertical;
//        overflow: hidden;
//      }
//    }
//
//    ._popIn_recommend_art_img {
//      flex-shrink: 0;
//      width: 33%;
//      padding-top: calc(33% * 0.75);
//      @include media-breakpoint-up(md) {
//        width: 25%;
//        padding-top: calc(25% * 0.75);
//      }
//      @include media-breakpoint-up(xl) {
//        width: 20%;
//        padding-top: calc(20% * 0.75);
//      }
//      &::after {
//        content: '特企';
//        z-index: 2;
//        padding: 4px;
//        background: rgba(188, 188, 188, 1);
//        color: #ffffff;
//        font-weight: 300;
//        font-size: 12px;
//        line-height: 12px;
//        position: absolute;
//        transform: translate(0, -100%);
//        @include media-breakpoint-up(md) {
//          font-size: 14px;
//          line-height: 14px;
//        }
//      }
//    }
//  }
//}
</style>
