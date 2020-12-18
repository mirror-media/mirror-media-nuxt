<template>
  <div class="home">
    <main>
      <UiFlashNews
        class="home__flash-news"
        :articles="flashNews"
        @sendGa:article="sendGaForClick('breakingnews title')"
        @sendGa:next="sendGaForClick('breakingnews up')"
        @sendGa:prev="sendGaForClick('breakingnews down')"
      />

      <ClientOnly>
        <ContainerGptAd
          class="home__ad home__ad--hd"
          pageKey="home"
          adKey="HD"
        />
      </ClientOnly>

      <section class="editor-choices-container">
        <UiColumnHeader
          title="編輯精選"
          class="home__column-header home__column-header--editor-choices"
        />
        <UiEditorChoices
          :articles="editorChoicesArticles"
          @sendGa="sendGaForClick('choice')"
        />
      </section>

      <ClientOnly>
        <ContainerGptAd
          class="home__ad home__ad--mb-l1"
          pageKey="home"
          adKey="MB_L1"
        />
      </ClientOnly>

      <div class="column-container">
        <aside>
          <section v-if="shouldOpenMirrorTv" class="container">
            <UiColumnHeader title="鏡電視" class="home__column-header" />
            <LazyRenderer>
              <UiVideoModal
                class="mirror-tv-aside"
                :embeddedHtml="eventMod.embed"
                @sendGa:open="sendGaForClick('mod open')"
                @sendGa:close="sendGaForClick('mod close')"
              />
            </LazyRenderer>
          </section>

          <section class="container">
            <UiColumnHeader title="焦點新聞" class="home__column-header" />
            <div class="article-list-focus-container">
              <UiArticleListFocus
                v-for="article in articlesFocus"
                :key="article.slug"
                :articleMain="article"
                :articlesRelated="articlesRelatedFocus(article)"
                class="home__article-list-focus"
              />
            </div>
          </section>
        </aside>

        <div class="gallery-container">
          <ClientOnly>
            <ContainerGptAd
              class="home__ad home__ad--mb-l2"
              pageKey="home"
              adKey="MB_L2"
            />

            <ContainerGptAd
              class="home__ad home__ad--pc-b1"
              pageKey="home"
              adKey="PC_B1"
            />

            <section class="container">
              <UiColumnHeader title="最新文章" class="home__column-header" />
              <UiArticleGallery
                :items="latestItems"
                @sendGa="sendGaForClick('latest')"
              />
              <UiInfiniteLoading
                v-if="latestItems.length > 3"
                @infinite="loadMoreLatestList"
              />
            </section>
          </ClientOnly>
        </div>
      </div>

      <div v-if="shouldOpenFixedMirrorTv" class="mirror-tv-fixed">
        <UiVideoModal
          :embeddedHtml="eventMod.embed"
          @sendGa:open="sendGaForClick('mod open')"
          @sendGa:close="sendGaForClick('mod close')"
        />
        <SvgCloseIcon @click="handleCloseFixedMirrorTv" />
      </div>

      <ContainerFullScreenAds />
    </main>
  </div>
</template>

<script>
import _ from 'lodash'
import localforage from 'localforage'

import UiFlashNews from '~/components/UiFlashNews.vue'
import UiColumnHeader from '~/components/UiColumnHeader.vue'
import UiEditorChoices from '~/components/UiEditorChoices.vue'
import UiVideoModal from '~/components/UiVideoModal.vue'
import UiArticleListFocus from '~/components/UiArticleListFocus.vue'
import UiArticleGallery from '~/components/UiArticleGallery.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'

import SvgCloseIcon from '~/assets/close-black.svg?inline'

import { isTruthy } from '~/utils/index.js'
import { stripHtmlTag } from '~/utils/article.js'
import { CATEGORY_ID_MARKETING, SITE_OG_IMG } from '~/constants/index.js'

const CATEGORY_ID_POLITICAL = '5979ac0de531830d00e330a7' // 政治
const CATEGORY_ID_CITY_NEWS = '5979ac33e531830d00e330a9' // 社會
const CATEGORY_ID_BUSINESS = '57e1e16dee85930e00cad4ec' // 財經
const CATEGORY_ID_LATESTNEWS = '57e1e200ee85930e00cad4f3' // 娛樂頭條

const GA_UTM_EDITOR_CHOICES = 'utm_source=mmweb&utm_medium=editorchoice'

// 東森新聞
const PARTNER_ID_EBC = '5ea7fd55a66f9e0f00a04e9a'

const LATEST_ARTICLES_MIN_NUM = 6
const MICRO_AD_IDXES_INSERTED = [2, 4, 8]
const EXTERNALS_IDX_START_INSERTED = 12
const EXTERNALS_MAX_RESULTS = 6

export default {
  name: 'Home',
  components: {
    UiFlashNews,
    UiColumnHeader,
    UiEditorChoices,
    UiVideoModal,
    UiArticleListFocus,
    UiArticleGallery,
    UiInfiniteLoading,
    ContainerGptAd,
    ContainerFullScreenAds,

    SvgCloseIcon,
  },

  async fetch() {
    this.articleGrouped = (await this.$fetchGrouped()) || {}
    this.flashNews = await this.fetchFlashNews()
  },

  data() {
    return {
      flashNews: [],
      articleGrouped: {
        choices: [],
        grouped: [],
      },
      latestList: {
        items: [],
        total: 0,
        maxResults: 20,
        page: 1,
      },
      areMicroAdsInserted: false,
      areExternalsInserted: false,

      eventMod: {},
      hasClosedFixedMirrorTv: false,
      doesUserCloseFixedMirrorTv: false,
      hasScrolled: false,
    }
  },

  computed: {
    editorChoicesArticles() {
      const { choices: articles = [] } = this.articleGrouped

      return articles.map(function transformContent(article) {
        const {
          slug = '',
          title = '',
          style = '',
          heroImage = {},
          sections = [],
        } = article

        const { mobile = {}, tablet = {} } =
          heroImage.image?.resizedTargets || {}
        const [section = {}] = sections

        return {
          slug,
          title,
          href:
            style !== 'projects'
              ? `${getHref(article)}?${GA_UTM_EDITOR_CHOICES}`
              : getHref(article),
          imgSrc: tablet.url || SITE_OG_IMG,
          imgSrcMobile: mobile.url || SITE_OG_IMG,
          label: section.title,
          sectionName: section.name,
        }
      })
    },
    doesHaveAnyLatestItemsLeftToLoad() {
      const { total, maxResults, page: currentPage } = this.latestList
      const maxPage = Math.ceil(total / maxResults)

      return currentPage < maxPage
    },
    latestItems() {
      return this.latestList.items
    },

    shouldOpenMirrorTv() {
      if (!this.doesHaveEventMod) {
        return false
      }

      const now = Date.now()

      return (
        now >= new Date(this.eventMod.startDate) &&
        now < new Date(this.eventMod.endDate)
      )
    },
    shouldOpenFixedMirrorTv() {
      return (
        !this.hasClosedFixedMirrorTv &&
        this.shouldOpenMirrorTv &&
        this.hasScrolled &&
        !this.doesUserCloseFixedMirrorTv
      )
    },
    doesHaveEventMod() {
      return !_.isEmpty(this.eventMod)
    },

    articlesFocus() {
      return this.articleGrouped.grouped ?? []
    },
  },

  watch: {
    latestItems: [
      function insertMicroAds() {
        if (
          this.latestItems.length < LATEST_ARTICLES_MIN_NUM ||
          this.areMicroAdsInserted
        ) {
          return
        }

        MICRO_AD_IDXES_INSERTED.forEach((idxInserted, idxUnit) => {
          this.insertLatestItems(idxInserted, {
            isMicroAd: true,
            idx: idxUnit,
          })
        })

        this.areMicroAdsInserted = true
      },
      async function insertExternals() {
        if (
          this.latestItems.length < EXTERNALS_IDX_START_INSERTED ||
          this.areExternalsInserted
        ) {
          return
        }

        const { items = [] } =
          (await this.$fetchExternals({
            maxResults: EXTERNALS_MAX_RESULTS,
            page: 1,
            sort: '-publishedDate',
            partner: PARTNER_ID_EBC,
          })) || {}

        this.insertLatestItems(
          EXTERNALS_IDX_START_INSERTED,
          ...items.map(this.transformLatestItemContent)
        )

        this.areExternalsInserted = true
      },
    ],
  },

  mounted() {
    this.loadLatestListInitial()
    this.loadEventMod()

    this.checkUserHasClosedFixedMirrorTv()
  },

  methods: {
    async fetchFlashNews() {
      const { items: articles = [] } =
        (await this.$fetchPosts({
          categories: [
            CATEGORY_ID_POLITICAL,
            CATEGORY_ID_CITY_NEWS,
            CATEGORY_ID_BUSINESS,
            CATEGORY_ID_LATESTNEWS,
          ],
          clean: 'content',
          isAudioSiteOnly: false,
          maxResults: 10,
          page: 1,
          sort: '-publishedDate',
        })) || {}

      return articles.map(transformContentOfFlashNews)
    },
    async loadLatestListInitial() {
      const {
        items: articles = [],
        meta = { total: 0 },
      } = await this.fetchLatestList()

      const slugsOfChoicesAndFocus = [
        ...this.articleGrouped.choices,
        ...this.articlesFocus,
        ...this.articlesFocus.flatMap((article) => article.relateds),
      ]
        .filter(isTruthy)
        .map((article) => article.slug)

      const articlesWithoutChoicesAndFocus = articles.filter(
        (article) => !slugsOfChoicesAndFocus.includes(article.slug)
      )

      // 為了避免廣告（MicroAd）連續出現，當篩選後的最新文章小於 LATEST_ARTICLES_MIN_NUM 篇，便採用未篩選前的文章
      this.pushLatestItems(
        articlesWithoutChoicesAndFocus.length < LATEST_ARTICLES_MIN_NUM
          ? articles
          : articlesWithoutChoicesAndFocus
      )
      this.setLatestTotal(meta.total)
    },
    async fetchLatestList() {
      const { page, maxResults } = this.latestList

      return (
        (await this.$fetchList({
          maxResults,
          page,
          sort: '-publishedDate',
          isAudioSiteOnly: false,
        })) || {}
      )
    },
    async loadEventMod() {
      const { items = [] } =
        (await this.$fetchEvent({
          isFeatured: true,
          eventType: 'mod',
          maxResults: 1,
        })) || {}

      this.eventMod = Object.freeze(items[0] || {})
    },
    pushLatestItems(items = []) {
      this.latestList.items.push(...items.map(this.transformLatestItemContent))
    },
    insertLatestItems(idxStart, ...items) {
      this.latestList.items.splice(idxStart, 0, ...items)
    },
    setLatestTotal(total = 0) {
      this.latestList.total = total
    },
    transformLatestItemContent(item = {}) {
      const { id = '', title = '', brief, sections = [] } = item

      return {
        id,
        title,
        description: _.isObject(brief) ? stripHtmlTag(brief.html ?? '') : brief,
        href: getHref(item),
        imgSrc: getImg(item),
        label: getLabel(item),
        sectionName: item.partner ? 'external' : sections[0]?.name,
      }
    },
    async loadMoreLatestList(state) {
      this.latestList.page += 1

      try {
        const { items = [] } = await this.fetchLatestList()

        this.pushLatestItems(items)

        if (this.doesHaveAnyLatestItemsLeftToLoad) {
          state.loaded()
        } else {
          state.complete()
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        state.error()
      } finally {
        this.sendGa('scroll', `loadmore${this.latestList.page}`)
      }
    },

    articlesRelatedFocus(articleData = {}) {
      return articleData.relateds?.slice(0, 3) || []
    },

    async checkUserHasClosedFixedMirrorTv() {
      try {
        this.hasClosedFixedMirrorTv =
          JSON.parse(await localforage.getItem('mmHasClosedFixedMirrorTv')) ??
          false
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      if (!this.hasClosedFixedMirrorTv) {
        this.checkScrolled()
      }
    },
    handleCloseFixedMirrorTv() {
      this.doesUserCloseFixedMirrorTv = true

      localforage
        .setItem('mmHasClosedFixedMirrorTv', JSON.stringify(true))
        .catch(function rejected(err) {
          // eslint-disable-next-line no-console
          console.error(err)
        })
    },
    checkScrolled() {
      window.addEventListener(
        'scroll',
        () => {
          this.hasScrolled = true
        },
        { once: true }
      )
    },

    sendGa(eventAction, eventLabel, eventCategory = 'home') {
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
}

function transformContentOfFlashNews(article = {}) {
  const { slug = '', title = '' } = article

  return {
    slug,
    title,
    href: getHref(article),
  }
}

function getHref({ style = '', slug = '', partner, name = '' } = {}) {
  if (partner) {
    return `/external/${name}/`
  }

  switch (style) {
    case 'campaign':
      return `/campaigns/${slug}/`
    case 'projects':
      return `/projects/${slug}/`
    default:
      return `/story/${slug}/`
  }
}

function getImg({ heroImage, ogImage, heroVideo, partner, thumb } = {}) {
  if (partner) {
    return thumb
  }

  let img = {}

  if (heroImage) {
    img = heroImage.image?.resizedTargets
  } else if (ogImage) {
    img = ogImage.image?.resizedTargets
  } else if (heroVideo) {
    img = heroVideo.coverPhoto?.image?.resizedTargets
  }

  return img?.mobile?.url
}

function getLabel({ sections = [], categories = [], partner } = {}) {
  if (partner) {
    return '合作媒體'
  }

  if (sections.length > 0) {
    return sections[0]?.title
  }

  const [firstCategory = {}, secondCategory = {}] = categories

  if (firstCategory.id === CATEGORY_ID_MARKETING && categories.length >= 2) {
    return secondCategory.title
  }

  return firstCategory.title
}

export {
  GA_UTM_EDITOR_CHOICES,
  LATEST_ARTICLES_MIN_NUM,
  MICRO_AD_IDXES_INSERTED,
  EXTERNALS_IDX_START_INSERTED,
  EXTERNALS_MAX_RESULTS,
  transformContentOfFlashNews,
  getLabel,
}
</script>

<style lang="scss" scoped>
.home {
  padding-top: 8px;
  overflow: hidden;
  @include media-breakpoint-up(sm) {
    padding: 8px 32px 0 32px;
  }
  @include media-breakpoint-up(xl) {
    padding: 10px 0 0 0;
    max-width: 1024px;
    margin: 0 auto;
  }

  &__column-header {
    margin-bottom: 10px;

    &--editor-choices {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      @include media-breakpoint-up(sm) {
        width: 100%;
      }
      @include media-breakpoint-up(xl) {
        display: none;
      }
    }
  }

  &__flash-news {
    margin: 0 6px 20px 6px;
    @include media-breakpoint-up(sm) {
      margin: 0 0 40px 0;
    }
    @include media-breakpoint-up(sm) {
      margin: 0 0 20px 0;
    }
  }

  &__article-list-focus {
    + .home__article-list-focus {
      margin-top: 25px;
      @include media-breakpoint-up(xl) {
        margin-top: 30px;
      }
    }
  }

  &__ad {
    margin: 0 auto 20px auto;
    @include media-breakpoint-up(sm) {
      margin: 0 auto 40px auto;
    }
    @include media-breakpoint-up(xl) {
      margin: 0 auto 20px auto;
    }

    &--pc-b1 {
      @include media-breakpoint-up(xl) {
        margin: 0 auto 40px auto;
      }
    }
  }
}

.container {
  width: 90%;
  margin: 0 auto 20px auto;
  @include media-breakpoint-up(sm) {
    width: 100%;
    margin: 0 auto 40px auto;
  }
  @include media-breakpoint-up(sm) {
    margin: 0 auto 30px auto;
  }
}

.editor-choices-container {
  margin-bottom: 20px;
  @include media-breakpoint-up(sm) {
    margin-bottom: 40px;
  }
}

.column-container {
  @include media-breakpoint-up(xl) {
    display: flex;
  }
}

aside {
  @include media-breakpoint-up(xl) {
    order: 1;
    flex-shrink: 0;
    width: 226px;
  }
}

.mirror-tv-aside {
  padding-top: 66.67%;
}

.gallery-container {
  @include media-breakpoint-up(xl) {
    flex-grow: 1;
    margin-right: 30px;
  }
}

.article-list-focus-container {
  border: 2px solid #224f73;
  padding: 14px 18px;
  @include media-breakpoint-up(xl) {
    border: none;
    padding: 0;
  }
}

$right--mirror-tv: 10px;

.mirror-tv-fixed {
  position: fixed;
  bottom: 10px;
  right: $right--mirror-tv;
  width: calc(50% - #{$right--mirror-tv});
  z-index: 819;
  @include media-breakpoint-up(md) {
    width: 33%;
  }
  @include media-breakpoint-up(xl) {
    width: 25%;
  }

  svg {
    position: absolute;
    top: -7px;
    right: -7px;
    width: 25px;
    height: auto;
    cursor: pointer;
    user-select: none;
    z-index: 9;
  }
}
</style>
