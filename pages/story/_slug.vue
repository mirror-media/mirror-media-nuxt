<template>
  <div class="story-layout">
    <ContainerPhotoGallery v-if="isPhotographyStyle" :story="story" />

    <template v-else>
      <ContainerHeader />

      <div class="story-container">
        <ClientOnly>
          <ContainerGptAd class="story__ad" :pageKey="sectionId" adKey="HD" />
        </ClientOnly>

        <div class="story-wrapper">
          <UIStoryBody :story="story">
            <template #storyRelateds>
              <UIStoryListWithArrow
                :categoryTitle="categoryTitle"
                :items="relateds"
                :sectionName="sectionName"
              />
              <UIStoryListRelated
                :items="relatedsWithoutFirstTwo"
                :images="relatedImages"
                @show="handleShowStoryListRelated"
              >
                <template v-if="canAdvertise" #ads>
                  <ClientOnly>
                    <MicroAd
                      v-for="unit in microAdUnits[device]"
                      :key="unit.name"
                      :unitId="unit.id"
                    />

                    <div id="_popIn_recommend"></div>
                  </ClientOnly>
                </template>
              </UIStoryListRelated>
            </template>

            <template v-if="canAdvertise && isDesktopWidth" #dableWidget>
              <ClientOnly>
                <div class="dable-widget">
                  <lazy-component
                    :id="`dablewidget_${DABLE_WIDGET_IDS.PC}`"
                    :data-widget_id="DABLE_WIDGET_IDS.PC"
                    @show="handleShowDableWidget"
                  ></lazy-component>
                </div>
              </ClientOnly>
            </template>
          </UIStoryBody>

          <aside>
            <ClientOnly>
              <ContainerGptAd
                class="story__ad"
                :pageKey="sectionId"
                adKey="PC_R1"
              />

              <lazy-component class="story__fb-page">
                <FbPage />
              </lazy-component>

              <ContainerGptAd
                class="story__ad"
                :pageKey="sectionId"
                adKey="MB_E1"
              />

              <div v-if="canAdvertise && !isDesktopWidth" class="dable-widget">
                <lazy-component
                  :id="`dablewidget_${DABLE_WIDGET_IDS.MB}`"
                  :data-widget_id="DABLE_WIDGET_IDS.MB"
                  @show="handleShowDableWidget"
                ></lazy-component>
              </div>

              <div v-if="isDesktopWidth">
                <lazy-component
                  class="story__list story__list--latest"
                  :style="{ height: hasLatestStories ? undefined : '100vh' }"
                  @show="fetchLatestStories"
                >
                  <UIStoryListWithHeading
                    v-if="hasLatestStories"
                    heading="最新文章"
                    :items="latestStories"
                    :extractTitle="sectionCategory"
                  />
                </lazy-component>
              </div>

              <ContainerGptAd
                class="story__ad"
                :pageKey="sectionId"
                adKey="PC_R2"
              />

              <lazy-component
                class="story__list story__list--popular"
                @show="fetchPopularStories"
              >
                <UIStoryListWithHeading
                  v-if="hasPopularStories"
                  heading="熱門文章"
                  :items="popularStories"
                />
              </lazy-component>
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

        <UIAdultContentWarning v-if="story.isAdult" />

        <UIStickyAd v-if="!hasWineCategory && canAdvertise">
          <ContainerGptAd :pageKey="sectionId" adKey="MB_ST" />
        </UIStickyAd>

        <ClientOnly v-if="shouldOpenAdPcFloating">
          <div class="ad-pc-floating">
            <ContainerGptAd
              :pageKey="sectionCarandwatchId"
              adKey="PC_FLOATING"
            />
            <SvgCloseIcon @click="doesClickCloseAdPcFloating = true" />
          </div>
        </ClientOnly>

        <ContainerFullScreenAds v-if="!hasWineCategory && canAdvertise" />
      </div>

      <div class="footer-container">
        <UIFooter class="story__footer" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'

import { useViewport } from '~/composition/viewport.js'
import { useFbQuotePlugin } from '~/composition/fb-plugins.js'

import ContainerHeader from '~/components/ContainerHeader.vue'
import ContainerPhotoGallery from '~/components/photo-gallery/ContainerPhotoGallery.vue'
import UIAdultContentWarning from '~/components/UIAdultContentWarning.vue'
import UIStoryBody from '~/components/UIStoryBody.vue'
import UIStoryListRelated from '~/components/UIStoryListRelated.vue'
import UIStoryListWithArrow from '~/components/UIStoryListWithArrow.vue'
import FbPage from '~/components/FbPage.vue'
import UIStoryListWithHeading from '~/components/UIStoryListWithHeading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UIStickyAd from '~/components/UIStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import MicroAd from '~/components/MicroAd.vue'
import UIFooter from '~/components/UIFooter.vue'

import SvgCloseIcon from '~/assets/close-black.svg?inline'

import { DOMAIN_NAME, ENV } from '~/configs/config'
import {
  SECTION_IDS,
  SITE_OG_IMG,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
} from '~/constants/index'
import { DABLE_WIDGET_IDS, MICRO_AD_UNITS } from '~/constants/ads.js'

export default {
  name: 'Story',
  layout: 'empty',
  setup() {
    useViewport()
    useFbQuotePlugin()
  },
  components: {
    ContainerHeader,
    ContainerPhotoGallery,
    UIAdultContentWarning,
    UIStoryBody,
    UIStoryListRelated,
    UIStoryListWithArrow,
    FbPage,
    UIStoryListWithHeading,

    ContainerGptAd,
    UIStickyAd,
    ContainerFullScreenAds,
    MicroAd,

    UIFooter,

    SvgCloseIcon,
  },

  async fetch() {
    const [postResponse] = await Promise.allSettled([
      this.$fetchPosts({
        slug: this.storySlug,
        isAudioSiteOnly: false,
        clean: 'content',
      }),
      this.$store.dispatch('partners/fetchPartnersData'),
      this.$store.dispatch('topics/fetchTopicsData'),
    ])

    if (postResponse.status === 'fulfilled') {
      this.story = postResponse.value.items?.[0] ?? {}

      this.$store.commit(
        'setCanAdvertise',
        !this.story.hiddenAdvertised ?? true
      )
    }
  },

  data() {
    return {
      latestStories: [],

      popularStories: [],
      story: {},
      relatedImages: [],

      microAdUnits: MICRO_AD_UNITS.STORY,

      DABLE_WIDGET_IDS,
      shouldLoadDableScript: false,

      shouldLoadPopinScript: false,

      sectionCarandwatchId: SECTION_IDS.carandwatch,
      doesClickCloseAdPcFloating: false,
    }
  },

  computed: {
    ...mapState(['canAdvertise']),
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpLg',
    }),
    isPhotographyStyle() {
      return this.story.style === 'photography'
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
    hasWineCategory() {
      return Boolean(
        this.categories.find((category) => category.name === 'wine')
      )
    },
    relateds() {
      return (this.story.relateds ?? []).filter((item) => item.slug)
    },
    relatedsWithoutFirstTwo() {
      return this.relateds.slice(2)
    },
    section() {
      return this.story.sections?.[0] || {}
    },
    hasSection() {
      return !_.isEmpty(this.section)
    },
    sectionId() {
      return this.section.id ?? 'other'
    },
    storySlug() {
      return this.$route.params.slug
    },
    sectionName() {
      return this.section.name ?? ''
    },
    sectionTitle() {
      return this.section.title ?? ''
    },
    hasRelatedImages() {
      return this.relatedImages.length > 0
    },
    hasLatestStories() {
      return this.latestStories.length > 0
    },
    hasPopularStories() {
      return this.popularStories.length > 0
    },

    shouldOpenAdPcFloating() {
      return (
        this.sectionId === this.sectionCarandwatchId &&
        this.canAdvertise &&
        this.isDesktopWidth &&
        !this.doesClickCloseAdPcFloating
      )
    },
  },

  methods: {
    handleShowStoryListRelated() {
      this.fetchRelatedImages()

      this.shouldLoadPopinScript = true
    },
    async fetchRelatedImages() {
      if (this.hasRelatedImages) {
        return
      }

      const imageIds = this.relatedsWithoutFirstTwo.map(
        (item) => item.heroImage
      )
      const { items = [] } = await this.$fetchImages({ id: imageIds })
      this.relatedImages = items
    },
    async fetchLatestStories() {
      if (this.hasLatestStories) {
        return
      }

      const { items = [] } = await this.$fetchList({
        sort: '-publishedDate',
        sections: this.sectionId,
      })

      this.latestStories = items
        .filter(this.doesNotHaveCurrentStorySlug)
        .slice(0, 6)
    },
    async fetchPopularStories() {
      if (this.hasPopularStories || ENV === 'lighthouse') {
        return
      }

      const { report: items = [] } = await this.$fetchPopular()
      this.popularStories = items.slice(0, 9)
    },
    sectionCategory(item = {}) {
      return item.categories?.[0]?.title || '新聞'
    },
    doesNotHaveCurrentStorySlug(item) {
      return item.slug !== this.storySlug
    },
    handleShowDableWidget() {
      this.shouldLoadDableScript = true
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
      publishedDate = '',
      updatedAt = '',
      title = '',
      topics = {},
      writers = [],
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
    const pageUrl = `https://${DOMAIN_NAME}${this.$route.path}`
    const publishedDateIso = new Date(publishedDate).toISOString()
    const topicId = topics._id ?? ''
    const { name: writerName, id: writerId } = writers[0] || {}

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
        { rel: 'amphtml', href: `${SITE_URL}/story/amp/${this.storySlug}/` },
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
          skip: !this.shouldLoadPopinScript,
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
        const logoUrl = `${SITE_URL}/logo.png`

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
</script>

<style lang="scss" scoped>
@import '~/css/micro-ad/story.scss';

.story-layout {
  @include media-breakpoint-up(lg) {
    background-color: #414141;
  }
}

.story-container {
  max-width: 1160px;
  padding-top: 20px;
  padding-bottom: 40px;
  overflow: hidden;
  @include media-breakpoint-up(lg) {
    margin: 0 auto;
    padding-left: 50px;
    padding-right: 50px;
    background-color: #fff;
  }
  @include media-breakpoint-up(xl) {
    padding-bottom: 20px;
  }
}

.story-wrapper {
  position: relative;
  @include media-breakpoint-up(lg) {
    padding-top: 30px;
    display: flex;
  }
}

.story {
  &__list {
    margin-bottom: 20px;

    &--popular {
      @include media-breakpoint-up(lg) {
        order: 1;
      }
    }
  }

  &__fb-page {
    margin-bottom: 20px;
    @include media-breakpoint-up(lg) {
      order: 2;
      margin-bottom: 0;
    }
  }

  &__ad {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;

    &--ft {
      margin-bottom: 0;
    }
  }

  &__footer {
    margin-bottom: 100px;

    @include media-breakpoint-up(lg) {
      margin-bottom: 0;
    }
  }
}

aside {
  width: calc(100% - 50px);
  max-width: 645px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  @include media-breakpoint-up(lg) {
    width: 300px;
    display: flex;
    flex-direction: column;
    margin-right: 0;
    margin-bottom: 0;
  }
}

.footer-container {
  @include media-breakpoint-up(lg) {
    max-width: 1160px;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
  }
}

.dable-widget {
  margin-bottom: 20px;
  @include media-breakpoint-up(lg) {
    margin-top: 1.5em;
    margin-bottom: 0;
  }
}

.ad-pc-floating {
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

#_popIn_recommend {
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
      @include media-breakpoint-up(lg) {
        width: 20%;
        padding-top: calc(20% * 0.75);
      }
    }
  }
}
</style>
