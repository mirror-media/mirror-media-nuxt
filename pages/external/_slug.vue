<!-- 先複製 story/_slug.vue 中所需的部分，之後要與 story/_slug.vue 重構 -->
<template>
  <div class="story-slug">
    <div class="article">
      <ContainerHeader />

      <div class="story-container">
        <ContainerGptAd class="story__ad" :pageKey="sectionId" adKey="HD" />

        <div class="story-wrapper">
          <ContainerStoryBody
            :story="story"
            class="story-slug__story-body external"
          >
            <template #fixedTriggerEnd>
              <div ref="fixedTriggerEnd" />
            </template>

            <template #storyRelateds>
              <LazyRenderer
                class="story__list"
                @load="handleLoadStoryListRelated"
              >
                <UiStoryListRelatedRedesignWrapper
                  v-if="$GOExp['normal-post-related-redesign'].variant === '1'"
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

            <template v-if="isDesktopWidth" #dableWidget>
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
                :pageKey="sectionId"
                adKey="PC_R1"
              />

              <LazyRenderer v-if="!isDesktopWidth" class="story__fb-page">
                <FbPage />
              </LazyRenderer>

              <ContainerGptAd
                class="story__ad"
                :pageKey="sectionId"
                adKey="MB_E1"
              />

              <div
                v-if="!isDesktopWidth"
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

              <div v-if="shouldOpenLatestList" ref="latestList">
                <LazyRenderer
                  class="lazy-latest-list"
                  :style="{
                    height: doesHaveLatestStories ? undefined : '100vh',
                  }"
                  @load="fetchLatestStories(storyPageBaseUrl)"
                >
                  <UiArticleListAside
                    class="latest-list"
                    heading="最新文章"
                    :items="latestStories"
                    :isStyleAdjusted="true"
                    @sendGa="sendGaForClick('latest')"
                  />
                </LazyRenderer>
              </div>

              <div
                ref="fixedContainer"
                class="fixed-container"
                :class="{ fixed: shouldFixAside }"
              >
                <ContainerGptAd
                  class="story__ad"
                  :pageKey="sectionId"
                  adKey="PC_R2"
                />

                <LazyRenderer
                  ref="popularList"
                  class="story__popular-list"
                  @load="fetchPopularStories"
                >
                  <UiArticleListAsideB
                    v-if="doesHavePopularStories"
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
                </LazyRenderer>

                <LazyRenderer v-if="isDesktopWidth" class="story__fb-page">
                  <FbPage />
                </LazyRenderer>
              </div>
            </ClientOnly>
          </aside>
        </div>

        <ContainerGptAd
          class="story__ad story__ad--ft"
          :pageKey="sectionId"
          adKey="FT"
        />

        <ContainerFullScreenAds />
      </div>

      <div class="sticky-footer">
        <UiStickyAd :pageKey="sectionId" />
      </div>

      <div class="footer-container">
        <UiFooter />
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
import ContainerStoryBody from '~/components/ContainerStoryBody.vue'
import FbPage from '~/components/FbPage.vue'
import UiArticleListAside from '~/components/UiArticleListAside.vue'
import UiArticleListAsideB from '~/components/UiArticleListAsideB.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiFooter from '~/components/UiFooter.vue'
import MicroAdWithLabel from '~/components/MicroAdWithLabel.vue'
import UiStoryListRelated from '~/components/UiStoryListRelated.vue'
import UiStoryListRelatedRedesignWrapper from '~/components/UiStoryListRelatedRedesignWrapper.vue'

import { DOMAIN_NAME, ENV } from '~/configs/config'
import { SITE_OG_IMG, SITE_TITLE } from '~/constants/index'
import { DABLE_WIDGET_IDS, MICRO_AD_UNITS } from '~/constants/ads.js'
import { SECTION_IDS } from '~/constants/index.js'

export default {
  name: 'External',
  layout: 'empty',
  setup() {
    useViewport()
    useFbQuotePlugin()
  },
  components: {
    ContainerHeader,
    ContainerStoryBody,
    FbPage,
    UiArticleListAside,
    UiArticleListAsideB,
    ContainerGptAd,
    UiStickyAd,
    ContainerFullScreenAds,
    MicroAdWithLabel,
    UiStoryListRelated,
    UiStoryListRelatedRedesignWrapper,

    UiFooter,
  },

  async fetch() {
    const [externalResponse] = await Promise.allSettled([
      this.$fetchExternals({
        name: [this.$route.params.slug],
      }),
      this.$store.dispatch('partners/fetchPartnersData'),
      this.$store.dispatch('topics/fetchTopicsData'),
    ])

    if (externalResponse.status === 'rejected') {
      const { message, statusCode } = externalResponse.reason
      this.$nuxt.error({ statusCode, message })
    }

    this.story = externalResponse.value?.items?.[0] ?? {}
    this.story.extendByline = `文｜${this.story.extendByline}`
    this.story.categories = [{ title: '時事' }]
    this.story.sections = [{ id: '57e1e0e5ee85930e00cad4e9' }]
  },

  data() {
    return {
      latestStories: [],
      hasLoadedLatestStories: false,

      sectionId: SECTION_IDS.news,
      microAdUnits: MICRO_AD_UNITS.STORY,

      popularStories: [],
      story: {},

      DABLE_WIDGET_IDS,
      shouldLoadDableScript: false,

      shouldFixAside: false,

      scrollDepthObserver: undefined,
      relatedImages: [],
    }
  },
  computed: {
    ...mapState({
      viewportHeight: (state) => state.viewport.height,
      canAdvertise: (state) => state.canAdvertise,
    }),
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
      displayedPartners: 'partners/displayedPartners',
      storyPageBaseUrl: 'membership-subscribe/storyPageBaseUrl',
    }),
    storySlug() {
      return this.$route.params.slug
    },
    shouldOpenLatestList() {
      return (
        this.isDesktopWidth &&
        (this.hasLoadedLatestStories ? this.doesHaveLatestStories : true)
      )
    },
    doesHaveLatestStories() {
      return this.latestStories.length > 0
    },
    doesHavePopularStories() {
      return this.popularStories.length > 0
    },
    partner() {
      const partnerName = this.storySlug.split('_')[0]
      return this.displayedPartners.find((item) => item.name === partnerName)
    },
    relateds() {
      return (this.story.relateds ?? []).filter((item) => item.slug)
    },
    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },
  },

  watch: {
    isDesktopWidth() {
      this.isDesktopWidth
        ? window.addEventListener('scroll', this.handleFixAside)
        : this.cleanFixedAside()
    },
  },

  mounted() {
    this.observeScrollDepthForGa()
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleFixAside)

    this.scrollDepthObserver.disconnect()
  },
  methods: {
    async fetchRelatedImages() {
      const imageIds = this.relateds.map((item) => item.heroImage)

      const { items = [] } = await this.$fetchImages({
        id: imageIds,
        maxResults: this.relateds.length,
      })
      this.relatedImages = items
    },
    handleLoadStoryListRelated() {
      this.fetchRelatedImages()
    },
    async fetchLatestStories(baseUrl) {
      const { items = [] } = await this.$fetchList({
        sort: '-publishedDate',
      })

      this.latestStories = items
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
            href: `${baseUrl}/${slug}/`,
            imgSrc: getImgSrc(heroImage),
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
      try {
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
              href: slug,
              imgSrc: getImgSrc(heroImage),
              label: getLabel(sections),
              sectionName: sections[0]?.name,
            }
          })
      } catch (err) {
        this.popularStories = []
      }
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
            elem: popularList.$el,
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
      brief = '',
      publishedDate = Date.now(),
      thumb = SITE_OG_IMG,
      title = '',
    } = this.story

    const metaTitle = title || SITE_TITLE
    const pageUrl = `https://${DOMAIN_NAME}${this.$route.path}`

    const publishedDateIso = new Date(publishedDate).toISOString()
    const partnerDisplay = this.partner?.display
    return {
      title,
      meta: [
        { hid: 'robots', name: 'robots', content: 'index' },
        { hid: 'description', name: 'description', content: brief },
        { hid: 'og:title', property: 'og:title', content: metaTitle },
        {
          hid: 'og:description',
          property: 'og:description',
          content: brief,
        },
        { hid: 'og:image', property: 'og:image', content: thumb },
        {
          hid: 'og:url',
          property: 'og:url',
          content: pageUrl,
        },
        { hid: 'section-name', name: 'section-name', content: 'externals' },
        {
          hid: 'category-name',
          name: 'category-name',
          content: this.partner?.name,
        },
        { hid: 'twitter:title', name: 'twitter:title', content: metaTitle },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: brief,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: thumb },
        { property: 'dable:item_id', content: this.storySlug },
        { property: 'dable:author', content: partnerDisplay },
        { property: 'dable:image', content: thumb },
        { property: 'article:section', content: '時事' },
        { property: 'article:section2', content: partnerDisplay },
        { property: 'article:published_time', content: publishedDateIso },
      ],
      link: [{ rel: 'canonical', href: pageUrl }],

      script: [
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
  },
}

function getImgSrc({ image = {} } = {}) {
  return image?.resizedTargets?.mobile?.url || SITE_OG_IMG
}

function getLabel([item = {}] = []) {
  return item.title || '新聞'
}
</script>

<style lang="scss" scoped>
$story-max-width: 1160px;

$aside-width: 300px;

$link-color: #3195b3;

.story-slug {
  &__story-body {
    max-width: 645px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(xl) {
      width: calc(100% - #{$aside-width} - 20px);
      max-width: 695px;
      padding-bottom: 0;
      margin-left: 0;
    }
    &.external {
      &::v-deep {
        .story__external-content {
          margin-top: 1.5em;
          font-size: 18px;
          line-height: 36px;
          > * + p {
            margin-top: 1.5em;
          }
          p {
            color: #171717;
          }
          a {
            &:link,
            &:visited,
            &:hover,
            &:active {
              padding-bottom: 5px;
              color: $link-color;
              border-bottom: border(1px, $link-color);
            }

            * {
              text-decoration: none;
            }
          }
        }
      }
    }
  }
}

.article {
  @include media-breakpoint-up(xl) {
    background-color: #414141;
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
</style>
