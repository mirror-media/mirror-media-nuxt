<template>
  <div>
    <error v-if="$fetchState.error" :error="$fetchState.error" />
    <div
      v-else
      class="story-slug"
      :class="{ 'story-slug--background-yellow': shouldSetBackgroundToYellow }"
    >
      <ContainerPhotoGallery v-if="isStylePhotography" :story="story" />

      <ContainerCulturePost
        v-else-if="isStyleWide"
        :story="story"
        :isPremium="false"
      />

      <div v-else class="article">
        <ContainerHeader
          :currentSectionName="sectionName"
          :currentCategoryName="categoryName"
        />

        <div class="story-container">
          <ContainerGptAd
            class="story__ad story__ad--fixed-height"
            :pageKey="sectionIdForAd"
            adKey="HD"
          />

          <div class="story-wrapper">
            <ContainerStoryBody :story="story" class="story-slug__story-body">
              <template #fixedTriggerEnd>
                <div ref="fixedTriggerEnd" />
              </template>

              <template #storyRelateds>
                <LazyRenderer
                  class="story__list"
                  @load="handleLoadStoryListRelated"
                >
                  <UiStoryListRelatedRedesignWrapper
                    v-if="
                      $GOExp['normal-post-related-redesign'].variant === '1'
                    "
                    :relateds="relateds"
                    :relatedImages="relatedImages"
                    :canAdvertise="canAdvertise"
                    :device="device"
                    @sendGa="sendGaForClick('related')"
                  />
                  <UiStoryListRelated
                    v-else
                    :items="relateds"
                    :images="relatedImages"
                    @sendGa="sendGaForClick('related')"
                  >
                    <template v-if="canAdvertise" #ads>
                      <ClientOnly>
                        <MicroAdWithLabel
                          v-for="unit in microAdUnits[device]"
                          :key="unit.name"
                          :unitId="unit.id"
                        />

                        <div id="_popIn_recommend"></div>
                      </ClientOnly>
                    </template>
                  </UiStoryListRelated>
                </LazyRenderer>
              </template>

              <template v-if="canAdvertise && isDesktopWidth" #dableWidget>
                <ClientOnly>
                  <div ref="dableWidget" class="dable-widget">
                    <LazyRenderer
                      :id="`dablewidget_${DABLE_WIDGET_IDS.PC}`"
                      :data-widget_id="DABLE_WIDGET_IDS.PC"
                      @load="handleLoadDableWidget"
                    ></LazyRenderer>
                  </div>
                </ClientOnly>
              </template>
            </ContainerStoryBody>

            <aside>
              <ClientOnly>
                <ContainerGptAd
                  class="story__ad"
                  :pageKey="sectionIdForAd"
                  adKey="PC_R1"
                />

                <LazyRenderer v-if="!isDesktopWidth" class="story__fb-page">
                  <FbPage />
                </LazyRenderer>

                <ContainerGptAd
                  class="story__ad"
                  :pageKey="sectionIdForAd"
                  adKey="MB_E1"
                />

                <div
                  v-if="canAdvertise && !isDesktopWidth"
                  ref="dableWidget"
                  key="dable-widget"
                  class="dable-widget"
                >
                  <LazyRenderer
                    :id="`dablewidget_${DABLE_WIDGET_IDS.MB}`"
                    :data-widget_id="DABLE_WIDGET_IDS.MB"
                    @load="handleLoadDableWidget"
                  ></LazyRenderer>
                </div>
              </ClientOnly>
              <div v-if="shouldOpenLatestList" ref="latestList">
                <UiArticleListAside
                  class="latest-list"
                  heading="最新文章"
                  :items="latestStories"
                  @sendGa="sendGaForClick('latest')"
                />
              </div>

              <div
                ref="fixedContainer"
                class="fixed-container"
                :class="{
                  fixed: shouldFixAside,
                }"
              >
                <ClientOnly>
                  <ContainerGptAd
                    class="story__ad"
                    :pageKey="sectionIdForAd"
                    adKey="PC_R2"
                  />
                </ClientOnly>

                <div ref="popularList" class="story__popular-list">
                  <section v-if="doesHavePopularStories">
                    <UiArticleListAsideB
                      heading="熱門文章"
                      :items="popularStories"
                      :isStyleAdjusted="true"
                      @sendGa="sendGaForClick('popular')"
                    >
                      <template v-slot:_popIn_recommend_hot
                        ><div id="_popIn_recommend_hot"></div>
                      </template>
                      <template v-slot:_popIn_recommend_hot_2>
                        <div id="_popIn_recommend_hot_2"></div>
                      </template>
                    </UiArticleListAsideB>
                  </section>
                </div>
                <ClientOnly>
                  <LazyRenderer v-if="isDesktopWidth" class="story__fb-page">
                    <FbPage />
                  </LazyRenderer>
                </ClientOnly>
              </div>
            </aside>
          </div>

          <ContainerGptAd
            class="story__ad story__ad--ft"
            :pageKey="sectionIdForAd"
            adKey="FT"
          />

          <UiAdultContentWarning v-if="story.isAdult" />

          <div v-show="shouldShowAdPcFloating" class="ad-pc-floating">
            <ContainerGptAd
              v-if="sectionIdForAd === sectionCarandwatchId"
              :pageKey="sectionCarandwatchId"
              adKey="PC_FLOATING"
              @slotRenderEnded="handleRenderEndedAdPcFloating"
            />
            <SvgCloseIcon @click="doesClickCloseAdPcFloating = true" />
          </div>

          <ContainerFullScreenAds
            v-if="!doesHaveWineCategory && canAdvertise"
          />
        </div>

        <div class="sticky-footer">
          <AppOpenNotification v-if="false" />

          <UiStickyAd
            v-if="!doesHaveWineCategory && canAdvertise"
            :pageKey="sectionIdForAd"
          />

          <UiWineWarning v-if="doesHaveWineCategory" />
        </div>

        <div class="footer-container">
          <UiFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'

import { useViewport } from '~/composition/viewport.js'
import { useFbQuotePlugin } from '~/composition/fb-plugins.js'

import ContainerHeader from '~/components/ContainerHeader.vue'
import ContainerPhotoGallery from '~/components/photo-gallery/ContainerPhotoGallery.vue'
import ContainerCulturePost from '~/components/culture-post/ContainerCulturePost.vue'
import ContainerStoryBody from '~/components/ContainerStoryBody.vue'
import UiAdultContentWarning from '~/components/UiAdultContentWarning.vue'
import UiStoryListRelated from '~/components/UiStoryListRelated.vue'
import UiStoryListRelatedRedesignWrapper from '~/components/UiStoryListRelatedRedesignWrapper.vue'
import FbPage from '~/components/FbPage.vue'
import UiArticleListAside from '~/components/UiArticleListAside.vue'
import UiArticleListAsideB from '~/components/UiArticleListAsideB.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import MicroAdWithLabel from '~/components/MicroAdWithLabel.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import AppOpenNotification from '~/components/AppOpenNotification.vue'
import UiFooter from '~/components/UiFooter.vue'

import SvgCloseIcon from '~/assets/close-black.svg?inline'

import error from '~/layouts/error.vue'
import { DOMAIN_NAME, ENV, PREVIEW_QUERY } from '~/configs/config'
import {
  SECTION_IDS,
  SITE_OG_IMG,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
} from '~/constants/index'
import { DABLE_WIDGET_IDS, MICRO_AD_UNITS } from '~/constants/ads.js'
import {
  checkCategoryHasMemberOnly,
  doesContainWineName,
} from '~/utils/article'

import handleStoryPremiumRedirect from '~/middleware/handle-story-premium-redirect'
import saveMemberArticleHistoryLocally from '~/mixins/save-member-article-history-locally'

const PROJECTS_2022_SEA_TURTLE_SLUG = [
  'sea_turtle2022_seaghost',
  'sea_turtle2022_timetraveling',
]

const DEFAULT_SECTION_ID = 'other'

export default {
  name: 'Story',
  layout: 'empty',
  middleware: ['handle-story-premium-redirect'],
  setup() {
    useViewport()
    useFbQuotePlugin()
  },
  components: {
    error,
    ContainerHeader,
    ContainerPhotoGallery,
    ContainerCulturePost,
    ContainerStoryBody,
    UiAdultContentWarning,
    UiStoryListRelated,
    UiStoryListRelatedRedesignWrapper,
    FbPage,
    UiArticleListAside,
    UiArticleListAsideB,

    ContainerGptAd,
    UiStickyAd,
    ContainerFullScreenAds,
    MicroAdWithLabel,

    AppOpenNotification,
    UiWineWarning,

    UiFooter,

    SvgCloseIcon,
  },
  mixins: [saveMemberArticleHistoryLocally],

  async fetch() {
    const processPostResponse = (response) => {
      if (response.status === 'fulfilled') {
        this.story = response.value?.items?.[0] ?? {}

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
            this.$nuxt.context.redirect(`/story/${redirectHref}`)
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

    const [popularStoriesResponse, latestStoriesResponse] =
      await Promise.allSettled([
        this.fetchPopularStories(),
        this.fetchLatestStories(),
      ])
    if (popularStoriesResponse.status === 'fulfilled') {
      this.popularStories = popularStoriesResponse.value
    } else {
      this.popularStories = []
    }
    if (latestStoriesResponse.status === 'fulfilled') {
      this.latestStories = latestStoriesResponse.value
    } else {
      this.latestStories = []
    }
  },

  data() {
    return {
      latestStories: [],
      popularStories: [],
      story: {},
      membershipTokenState: undefined,
      relatedImages: [],

      microAdUnits: MICRO_AD_UNITS.STORY,

      DABLE_WIDGET_IDS,
      shouldLoadDableScript: false,

      shouldLoadPopinScript: false,

      sectionCarandwatchId: SECTION_IDS.carandwatch,
      doesClickCloseAdPcFloating: false,
      doesHaveAdPcFloating: false,
      shouldFixAside: false,
      scrollDepthObserver: undefined,
    }
  },

  computed: {
    ...mapState({
      canAdvertise: (state) => state.canAdvertise,
      viewportHeight: (state) => state.viewport.height,
    }),
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
    isAdvertised() {
      return this.story.isAdvertised || false
    },
    isInvisible() {
      return this.story.state === 'invisible'
    },
    isStyleDefault() {
      return !this.isStylePhotography && !this.isStyleWide
    },
    isStylePhotography() {
      return this.story.style === 'photography'
    },
    isStyleWide() {
      return this.story.style === 'wide'
    },
    doesCategoryHaveMemberOnly() {
      return checkCategoryHasMemberOnly(this.story)
    },
    shouldShowPremiumStory() {
      return this.doesCategoryHaveMemberOnly
    },

    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },
    categories() {
      return this.story.categories || []
    },
    category() {
      return this.categories[0] || {}
    },
    hasCategory() {
      return !_.isEmpty(this.category)
    },
    categoryTitle() {
      return this.category.title ?? ''
    },
    categoryName() {
      return this.category.name ?? ''
    },
    doesHaveWineCategory() {
      return doesContainWineName(this.categories)
    },
    relateds() {
      return (this.story.relateds ?? []).filter((item) => item.slug)
    },
    section() {
      return this.story.sections?.[0] || {}
    },
    hasSection() {
      return !_.isEmpty(this.section)
    },
    sectionId() {
      return this.section.id ?? DEFAULT_SECTION_ID
    },

    // if section name is "mirrorcolumn", should render ad which belongs to "culture" section
    sectionIdForAd() {
      if (this.section.name === 'mirrorcolumn') {
        return '5964418a4bbe120f002a3198'
      }
      if (this.section.name === 'life') {
        return 'other'
      }
      return this.sectionId
    },
    storySlug() {
      return this.$route?.params.slug
    },
    sectionName() {
      return this.section.name ?? ''
    },
    sectionTitle() {
      return this.section.title ?? ''
    },
    customCss() {
      return _.get(this.story, ['css'], null)
    },
    shouldOpenLatestList() {
      return this.sectionId !== DEFAULT_SECTION_ID && this.doesHaveLatestStories
    },
    doesHaveLatestStories() {
      return this.latestStories.length > 0
    },
    doesHavePopularStories() {
      return this.popularStories.length > 0
    },

    shouldShowAdPcFloating() {
      return (
        this.canAdvertise &&
        this.isDesktopWidth &&
        this.doesHaveAdPcFloating &&
        !this.doesClickCloseAdPcFloating
      )
    },
    shouldSetBackgroundToYellow() {
      return (
        this.isStyleWide &&
        PROJECTS_2022_SEA_TURTLE_SLUG?.includes(this.storySlug)
      )
    },
  },

  watch: {
    isDesktopWidth() {
      if (this.isStyleDefault) {
        this.isDesktopWidth
          ? window.addEventListener('scroll', this.handleFixAside)
          : this.cleanFixedAside()
      }
    },
  },

  async beforeMount() {
    await handleStoryPremiumRedirect(this.$nuxt.context)
  },

  mounted() {
    this.insertCustomizedMarkup()
    if (this.isStyleDefault) {
      this.observeScrollDepthForGa()
      if (this.isDesktopWidth) {
        window.addEventListener('scroll', this.handleFixAside)
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleFixAside)

    this.scrollDepthObserver.disconnect()
  },

  methods: {
    handleLoadStoryListRelated() {
      this.fetchRelatedImages()

      this.shouldLoadPopinScript = true
    },
    async fetchRelatedImages() {
      const imageIds = this.relateds.map((item) => item.heroImage)

      const { items = [] } = await this.$fetchImages({
        id: imageIds,
        maxResults: this.relateds.length,
      })
      this.relatedImages = items
    },
    async fetchLatestStories() {
      if (this.sectionId === DEFAULT_SECTION_ID) {
        return
      }

      const { items = [] } = await this.$fetchList({
        sort: '-publishedDate',
        sections: this.sectionId,
      })

      return items
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
            href: `/story/${slug}/`,
            imgSrc: heroImage
              ? getImgSrc(heroImage)
              : require('~/assets/default-og-img.png'),
            label: getLabel(categories),
            sectionName: sections[0]?.name,
          }
        })
    },
    async fetchPopularStories() {
      if (ENV === 'lighthouse') {
        return
      }

      const { report: items = [] } = await this.$fetchPopular()
      return items
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
            href: slug,
            imgSrc: getImgSrc(heroImage),
            label: getLabel(sections),
            sectionName: sections[0]?.name,
          }
        })
    },
    doesNotHaveCurrentStorySlug(item) {
      return item.slug !== this.storySlug
    },
    handleLoadDableWidget() {
      this.shouldLoadDableScript = true
    },
    handleFixAside: _.throttle(function () {
      const { latestList, fixedContainer, fixedTriggerEnd } = this.$refs

      if (!latestList) {
        return
      }

      const { bottom: latestListBottom } = latestList.getBoundingClientRect()
      const { top: fixedTriggerEndTop } =
        fixedTriggerEnd.getBoundingClientRect()

      // 當視窗頂部 <= latestList 底部，結束 fix
      if (latestListBottom > 0) {
        this.shouldFixAside = false
        fixedContainer.style.marginTop = ''

        return
      }

      // 當視窗頂部 > latestList 底部，且視窗底部 <= fixedTriggerEnd 頂部，開始 fix
      if (
        latestListBottom <= 0 &&
        fixedTriggerEndTop - this.viewportHeight > 0
      ) {
        this.shouldFixAside = true
        fixedContainer.style.marginTop = ''

        return
      }

      // 當視窗底部 > fixedTriggerEnd 頂部，結束 fix
      if (fixedTriggerEndTop - this.viewportHeight <= 0) {
        this.shouldFixAside = false
        fixedContainer.style.marginTop = `${
          fixedTriggerEndTop - latestListBottom - this.viewportHeight
        }px`
      }
    }, 100),
    cleanFixedAside() {
      const { fixedContainer } = this.$refs

      this.shouldFixAside = false
      fixedContainer.style.marginTop = ''

      window.removeEventListener('scroll', this.handleFixAside)
    },
    handleRenderEndedAdPcFloating({ isEmpty }) {
      if (!isEmpty) {
        this.doesHaveAdPcFloating = true
      }
    },
    insertCustomizedMarkup() {
      const custCss = document.createElement('style')
      custCss.setAttribute('id', 'custCss')

      if (this.customCss) {
        custCss.appendChild(document.createTextNode(this.customCss))
      }

      if (!document.getElementById('custCss')) {
        document.querySelector('body').appendChild(custCss)
      } else {
        document.querySelector('#custCss').innerHTML = this.customCss
      }
    },

    sendGa(eventAction, eventLabel, eventCategory = 'article') {
      this.$ga.event({
        eventAction,
        eventLabel,
        eventCategory,
      })
    },
    sendGaForClick(eventLabel) {
      this.sendGa('click', eventLabel)
    },
    observeScrollDepthForGa() {
      import('intersection-observer').then(() => {
        const { dableWidget, popularList } = this.$refs

        const triggers = [
          {
            elem: document.getElementById('story-end'),
            eventLabel: 'end',
          },
          {
            elem: dableWidget,
            eventLabel: 'matched',
          },
          {
            elem: popularList?.$el,
            eventLabel: 'popular',
          },
        ]

        this.scrollDepthObserver = new IntersectionObserver(
          function handleIntersect(entries) {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const { eventLabel, elem } = triggers.find(isTheSameElem) ?? {}

                // 桌機版的熱門文章不用送 GA
                if (elem === popularList.$el && this.isDesktopWidth) {
                  return
                }

                this.sendGa('visible', eventLabel)

                this.scrollDepthObserver.unobserve(elem)
              }

              function isTheSameElem({ elem }) {
                return elem === entry.target
              }
            })
          }.bind(this)
        )

        triggers.forEach(({ elem }) => {
          if (elem) {
            this.scrollDepthObserver.observe(elem)
          }
        })
      })
    },
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
        {
          hid: 'gptScript',
          skip: !this.canAdvertise,
          src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
          async: true,
        },
        {
          hid: 'dable',
          skip: !this.shouldLoadDableScript,
          innerHTML: `
            (function (d, a, b, l, e, _) {
              if (d[b] && d[b].q) return
              d[b] = function () {
                ;(d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
            dable('setService', 'mirrormedia.mg')
            dable('sendLogOnce')
            dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.MB}')
            dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.PC}')
          `,
        },
        {
          hid: 'popinAd',
          innerHTML: `
            (function () {
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true

              pa.src =
                window.location.protocol +
                '//api.popin.cc/searchbox/mirrormedia_tw.js'

              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
            })()
          `,
        },
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
$story-max-width: 1220px;

$aside-width: 365px;

.story-slug {
  &--background-yellow {
    background-color: #f8f3e8;
  }
  &__story-body {
    max-width: 645px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(xl) {
      width: calc(100% - #{$aside-width});
      max-width: 695px;
      padding-bottom: 0;
      margin-left: 0;
    }
  }
}

.article {
  @include media-breakpoint-up(xl) {
    background: #fff;
  }
}

.story-container {
  max-width: $story-max-width;
  padding-top: 20px;
  padding-bottom: 40px;
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
    max-width: $story-max-width;
  }
}

.story-wrapper {
  position: relative;
  @include media-breakpoint-up(xl) {
    padding-top: 30px;
    padding-bottom: 20px;
    display: flex;
  }
}

::v-deep {
  .story {
    &__list {
      margin-top: 20px;
    }

    &__popular-list {
      margin-bottom: 20px;
    }

    &__fb-page {
      margin-bottom: 20px;
      @include media-breakpoint-up(xl) {
        margin-bottom: 0;
      }
    }

    &__ad {
      width: 100%;
      margin-bottom: 20px;

      &--ft {
        margin-bottom: 0;
      }
      //When page is initialized, the ad is unmounted and the container of which is empty,
      //However, when the ad is mounted, the container's height is resize to ad height (normally is 250px),
      //which cause serious CLS problem.
      //The current solution is set the height of container by CSS, make it unable resized by ad.
      //But if user is using ad blocking plugins of browser, the container will show as a huge empty div on page,
      //which influence user experience.
      //We decide to adopt current solution to solve CLS problem, despite it is not perfect.
      //The perfect solution need more survey and discussion, we will start to dig in ASAP.

      &--fixed-height {
        height: 250px;
      }
    }
  }
}

aside {
  max-width: 645px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    width: $aside-width;
    margin-right: 0;
    margin-bottom: 0;
  }

  > * {
    width: calc(100% - 50px);
    margin-left: auto;
    margin-right: auto;

    @include media-breakpoint-up(xl) {
      width: 100%;
    }
  }
}

.fixed-container {
  @include media-breakpoint-up(xl) {
    padding-top: 20px;

    &.fixed {
      position: fixed;
      top: 0;
      width: $aside-width;
    }
  }
}

.footer-container {
  margin-bottom: 100px;
  @include media-breakpoint-up(xl) {
    margin-bottom: 0;
    max-width: $story-max-width;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
  }
}

.sticky-footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 419;

  > * {
    position: relative;
  }
}

.dable-widget {
  margin-bottom: 20px;
  @include media-breakpoint-up(xl) {
    margin-top: 1.5em;
    margin-bottom: 0;
  }
}

.ad-pc-floating {
  z-index: 2147483647;
  position: fixed;
  top: 175px;
  right: 15px;

  svg {
    position: absolute;
    top: -12.5px;
    right: -12.5px;
    width: 25px;
    height: auto;
    cursor: pointer;
    user-select: none;
  }
}

.micro-ad {
  margin-top: 16px;
  color: #808080;

  &::v-deep {
    #compass-fit-widget {
      font-family: inherit !important;
      margin-bottom: 0 !important;
    }

    #compass-fit-widget-content {
      display: flex;

      &::before {
        content: '';
        display: block;
        width: 10px;
        flex-shrink: 0;
        background-color: #808080;
      }
    }

    .pop_item_title,
    .popListVert-list__item--text {
      display: flex;
      align-items: center;
      flex-grow: 1;
      background-color: #eee !important;
      padding: 16px;
      @include media-breakpoint-up(md) {
        padding-left: 32px;
        padding-right: 32px;
      }
    }

    .pop_item_title a,
    .popListVert-list__item--text h2 {
      font-size: 18px;
      line-height: 1.3;
      display: block;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      // 2.6em = 1em * 1.3 * 2
      max-height: 2.6em;
    }

    .pop_item_title a {
      font-family: inherit !important;
    }

    figure,
    .popListVert-list__item--img {
      position: relative;
      flex-shrink: 0;
      order: 1;
      width: 33%;
      padding-top: calc(33% * 0.75);
      @include media-breakpoint-up(md) {
        width: 25%;
        padding-top: calc(25% * 0.75);
      }
      @include media-breakpoint-up(xl) {
        width: 20%;
        padding-top: calc(20% * 0.75);
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .pop_item--colorBlock,
    .popListVert-list__item--text > div {
      display: none;
    }

    .popListVert-list__item {
      display: flex;
      flex-grow: 1;
    }

    .popListVert-list__item--text a {
      font-weight: 400 !important;
    }
  }
}

#_popIn_recommend {
  position: relative;
  &::v-deep {
    ._popIn_recommend_container {
      padding-bottom: 0;
    }

    ._popIn_recommend_article {
      &::before {
        flex-shrink: 0;
        position: static;
        height: auto;
      }
    }

    ._popIn_recommend_art_title {
      flex-grow: 1;
      margin-left: 0;
      white-space: normal;
      @include media-breakpoint-up(md) {
        padding-left: 32px;
        padding-right: 32px;
      }

      a {
        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    ._popIn_recommend_art_img {
      flex-shrink: 0;
      width: 33%;
      padding-top: calc(33% * 0.75);
      @include media-breakpoint-up(md) {
        width: 25%;
        padding-top: calc(25% * 0.75);
      }
      @include media-breakpoint-up(xl) {
        width: 20%;
        padding-top: calc(20% * 0.75);
      }
      &::after {
        content: '特企';
        z-index: 2;
        padding: 4px;
        background: rgba(188, 188, 188, 1);
        color: #ffffff;
        font-weight: 300;
        font-size: 12px;
        line-height: 12px;
        position: absolute;
        transform: translate(0, -100%);
        @include media-breakpoint-up(md) {
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
  }
}
.latest-list {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
  }
}
</style>
