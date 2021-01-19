<!-- 先複製 story/_slug.vue 中所需的部分，之後要與 story/_slug.vue 重構 -->
<template>
  <div class="story-slug">
    <div class="article">
      <ContainerHeader />

      <div class="story-container">
        <ClientOnly>
          <ContainerGptAd class="story__ad" :pageKey="sectionId" adKey="HD" />
        </ClientOnly>

        <div class="story-wrapper">
          <ContainerStoryBody
            :story="story"
            class="story-slug__story-body external"
          >
            <template #fixedTriggerEnd>
              <div ref="fixedTriggerEnd" />
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
                  @load="fetchLatestStories"
                >
                  <UiArticleListAside
                    class="latest-list"
                    heading="最新文章"
                    :items="latestStories"
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
                  <UiArticleListAside
                    v-if="doesHavePopularStories"
                    heading="熱門文章"
                    :items="popularStories"
                    @sendGa="sendGaForClick('popular')"
                  />
                </LazyRenderer>

                <LazyRenderer v-if="isDesktopWidth" class="story__fb-page">
                  <FbPage />
                </LazyRenderer>
              </div>
            </ClientOnly>
          </aside>
        </div>

        <ClientOnly>
          <ContainerGptAd
            class="story__ad story__ad--ft"
            :pageKey="sectionId"
            adKey="FT"
          />
        </ClientOnly>

        <ContainerFullScreenAds />
      </div>

      <div class="sticky-footer">
        <UiStickyAd>
          <ContainerGptAd :pageKey="sectionId" adKey="MB_ST" />
        </UiStickyAd>
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
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiFooter from '~/components/UiFooter.vue'

import { ENV } from '~/configs/config'
import { SITE_OG_IMG } from '~/constants/index'
import { DABLE_WIDGET_IDS } from '~/constants/ads.js'

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

    ContainerGptAd,
    UiStickyAd,
    ContainerFullScreenAds,

    UiFooter,
  },

  async fetch() {
    try {
      const response = await this.$fetchExternals({
        name: [this.$route.params.slug],
      })
      this.story = response.items?.[0] ?? {}
      this.story.extendByline = `文｜${this.story.extendByline}`
      this.story.categories = [{ title: '合作媒體' }]
    } catch (error) {
      this.$nuxt.error({ statusCode: error.code, message: error.message })
    }
  },

  data() {
    return {
      latestStories: [],
      hasLoadedLatestStories: false,

      sectionId: 'other',

      popularStories: [],
      story: {},

      DABLE_WIDGET_IDS,
      shouldLoadDableScript: false,

      shouldFixAside: false,

      scrollDepthObserver: undefined,
    }
  },
  computed: {
    ...mapState({
      viewportHeight: (state) => state.viewport.height,
    }),
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
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
    async fetchLatestStories() {
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
            href: `/story/${slug}/`,
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
      const {
        top: fixedTriggerEndTop,
      } = fixedTriggerEnd.getBoundingClientRect()

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
        const { popularList } = this.$refs

        const triggers = [
          {
            elem: document.getElementById('story-end'),
            eventLabel: 'end',
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
}

function getImgSrc({ image = {} } = {}) {
  return image.resizedTargets?.mobile?.url || SITE_OG_IMG
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
</style>
