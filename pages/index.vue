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

      <ContainerGptAd class="home__ad home__ad--hd" pageKey="home" adKey="HD" />

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

      <ContainerGptAd
        class="home__ad home__ad--mb-l1"
        pageKey="home"
        adKey="MB_L1"
      />

      <div class="column-container">
        <aside>
          <LazyRenderer data-testid="mirror-tv" @load="loadEventMod">
            <section v-if="isValidEventModItem" class="container">
              <UiColumnHeader title="鏡電視" class="home__column-header" />
              <UiVideoModal
                class="mirror-tv"
                :embeddedHtml="eventMod.item.embed"
                @sendGa:open="sendGaForClick('mod open')"
                @sendGa:close="sendGaForClick('mod close')"
              />
            </section>
          </LazyRenderer>

          <section class="container">
            <UiColumnHeader title="焦點新聞" class="home__column-header" />
            <LazyRenderer @load="canFixLastFocusList = true">
              <div class="article-list-focus-container">
                <UiArticleListFocus
                  v-for="article in focusArticles"
                  :key="article.slug"
                  :articleMain="article"
                  :articlesRelated="article.relateds"
                  class="home__article-list-focus"
                  :class="{ fixed: shouldFixLastFocusList }"
                  @sendGa="sendGaForClick('group')"
                />
              </div>
            </LazyRenderer>
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
              <LazyRenderer
                data-testid="article-gallery"
                @load="loadLatestListInitial"
              >
                <UiArticleGallery
                  :items="latestItems"
                  @sendGa="sendGaForClick('latest')"
                />
                <UiInfiniteLoading
                  v-if="latestItems.length > 3"
                  @infinite="loadMoreLatestItems"
                />
              </LazyRenderer>
            </section>
          </ClientOnly>
        </div>
      </div>

      <div class="events-container">
        <div v-if="shouldOpenEventEmbedded" class="event event--embedded">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="eventEmbedded.item.embed"></div>

          <SvgCloseIcon
            data-testid="close-icon-embedded"
            @click="handleCloseEventEmbedded"
          />
        </div>

        <div v-if="shouldOpenEventMod" class="event">
          <UiVideoModal
            data-testid="event-mod"
            :embeddedHtml="eventMod.item.embed"
            @sendGa:open="sendGaForClick('mod open')"
            @sendGa:close="sendGaForClick('mod close')"
          />
          <SvgCloseIcon
            data-testid="close-icon-mod"
            @click="handleCloseEventMod"
          />
        </div>
      </div>

      <ContainerFullScreenAds />
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
import { stripHtmlTags } from '~/utils/article.js'
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
    const [groupedResponse, flashNewsResponse] = await Promise.allSettled([
      this.$fetchGrouped(),
      this.fetchFlashNews(),
    ])

    if (
      groupedResponse.status === 'rejected' ||
      flashNewsResponse.status === 'rejected'
    ) {
      this.$nuxt.context.error({ statusCode: 500 })
    }

    if (groupedResponse.status === 'fulfilled') {
      this.groupedArticles = groupedResponse.value || {}
    }

    if (flashNewsResponse.status === 'fulfilled') {
      this.flashNews = flashNewsResponse.value || []
    }
  },

  data() {
    return {
      flashNews: [],
      groupedArticles: {
        choices: [],
        grouped: [],
      },
      latestList: {
        items: [],
        total: 0,
        maxResults: 20,
        page: 0,
      },
      areMicroAdsInserted: false,
      areExternalsInserted: false,

      eventMod: {
        item: {},
        isLoading: false,
        hasClosed: true,
        doesUserClose: false,
      },

      eventEmbedded: {
        item: {},
        doesUserClose: false,
      },

      hasScrolled: false,

      observerOfLastSecondFocusList: undefined,
      canFixLastFocusList: false,
      shouldFixLastFocusList: false,
    }
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),

    editorChoicesArticles() {
      const { choices: articles = [] } = this.groupedArticles

      return articles.map(function transformContent(article) {
        const {
          slug = '',
          title = '',
          style = '',
          heroImage = {},
          sections = [],
        } = article

        const { mobile = {}, tablet = {} } =
          heroImage?.image?.resizedTargets || {}
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
      return _.uniqBy(this.latestList.items, function identifyDuplicateById(
        item
      ) {
        if (item.isMicroAd) {
          return `microId-${item.idx}`
        }
        return item.id
      })
    },

    isValidEventModItem() {
      if (!this.doesHaveEventModItem) {
        return false
      }

      const { startDate, endDate } = this.eventMod.item

      return inThePeriodBetween(startDate, endDate)
    },
    doesHaveEventModItem() {
      return !_.isEmpty(this.eventMod.item)
    },
    shouldOpenEventMod() {
      return (
        this.isValidEventModItem &&
        !this.eventMod.hasClosed &&
        !this.eventMod.doesUserClose
      )
    },
    shouldOpenEventEmbedded() {
      return this.isValidEventEmbeddedItem && !this.eventEmbedded.doesUserClose
    },
    isValidEventEmbeddedItem() {
      const { item: eventEmbedded } = this.eventEmbedded

      if (_.isEmpty(eventEmbedded)) {
        return false
      }

      return inThePeriodBetween(eventEmbedded.startDate, eventEmbedded.endDate)
    },

    focusArticles() {
      const { grouped: articles = [] } = this.groupedArticles

      return articles.map(transformContentOfFocus)

      function transformContentOfFocus(article) {
        const { slug = '', title = '', relateds = [] } = article

        return {
          title,
          slug,
          href: getHref(article),
          imgSrc: getImg(article),
          relateds: relateds.slice(0, 3).map(transformContentOfFocusRelated),
        }
      }

      function transformContentOfFocusRelated(article) {
        const { slug = '', title = '' } = article

        return {
          slug,
          title,
          href: getHref(article),
        }
      }
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
          ...items.map(this.transformContentOfLatestItem)
        )

        this.areExternalsInserted = true
      },
    ],

    isDesktopWidth: ['handleFixLastFocusList'],
    canFixLastFocusList: ['handleFixLastFocusList'],

    hasScrolled: ['loadFixedEventMod', 'loadEventEmbedded'],
  },

  beforeMount() {
    this.checkScrolled()
  },

  beforeDestroy() {
    this.cleanFixedLastFocusList()
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
        ...this.editorChoicesArticles,
        ...this.focusArticles,
        ...this.focusArticles.flatMap((article) => article.relateds),
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
      this.latestList.page += 1

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
    pushLatestItems(items = []) {
      this.latestList.items.push(
        ...items.map(this.transformContentOfLatestItem)
      )
    },
    insertLatestItems(idxStart, ...items) {
      this.latestList.items.splice(idxStart, 0, ...items)
    },
    setLatestTotal(total = 0) {
      this.latestList.total = total
    },
    transformContentOfLatestItem(item = {}) {
      const { id = '', title = '', brief, sections = [] } = item

      return {
        id,
        title,
        description: _.isObject(brief)
          ? stripHtmlTags(brief.html ?? '')
          : brief,
        href: getHref(item),
        imgSrc: getImg(item),
        label: getLabel(item),
        sectionName: item.partner ? 'external' : sections[0]?.name,
      }
    },
    async loadMoreLatestItems(state) {
      try {
        const { items = [] } = await this.fetchLatestList()

        this.pushLatestItems(items)

        if (this.doesHaveAnyLatestItemsLeftToLoad) {
          state.loaded()
        } else {
          state.complete()
        }

        this.sendGa('scroll', 'loadmore', this.latestList.page - 1)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        state.error()
      }
    },

    async loadFixedEventMod() {
      if (this.hasScrolled && !(await this.checkUserHasClosedEventMod())) {
        this.loadEventMod()
      }
    },
    async loadEventMod() {
      if (!this.doesHaveEventModItem && !this.eventMod.isLoading) {
        this.eventMod.isLoading = true

        const { items = [] } =
          (await this.$fetchEvent({
            isFeatured: true,
            eventType: 'mod',
            maxResults: 1,
          })) || {}
        this.eventMod.item = items[0] || {}

        this.eventMod.isLoading = false
      }
    },
    async loadEventEmbedded() {
      if (this.hasScrolled && !(await this.checkUserHasClosedEventEmbedded())) {
        const { items = [] } =
          (await this.$fetchEvent({
            isFeatured: true,
            eventType: 'embedded',
            maxResults: 1,
          })) || {}
        this.eventEmbedded.item = Object.freeze(items[0] || {})
      }
    },
    async checkUserHasClosedEventMod() {
      try {
        this.eventMod.hasClosed =
          JSON.parse(await localforage.getItem('mmHasClosedEventMod')) ?? false
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      return this.eventMod.hasClosed
    },
    handleCloseEventMod() {
      this.eventMod.doesUserClose = true

      localforage
        .setItem('mmHasClosedEventMod', JSON.stringify(true))
        .catch(function rejected(err) {
          // eslint-disable-next-line no-console
          console.error(err)
        })

      this.sendGaForClick('mod close')
    },
    async checkUserHasClosedEventEmbedded() {
      let hasClosedEventEmbedded = true

      try {
        hasClosedEventEmbedded =
          JSON.parse(await localforage.getItem('mmHasClosedEventEmbedded')) ??
          false
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      return hasClosedEventEmbedded
    },
    handleCloseEventEmbedded() {
      this.eventEmbedded.doesUserClose = true

      localforage
        .setItem('mmHasClosedEventEmbedded', JSON.stringify(true))
        .catch(function rejected(err) {
          // eslint-disable-next-line no-console
          console.error(err)
        })

      this.sendGaForClick('embedded close')
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

    handleFixLastFocusList() {
      this.isDesktopWidth && this.canFixLastFocusList
        ? this.observeToFixLastFocusList()
        : this.cleanFixedLastFocusList()
    },
    observeToFixLastFocusList() {
      import('intersection-observer').then(() => {
        this.observerOfLastSecondFocusList = new IntersectionObserver(
          function handleIntersect(entries) {
            entries.forEach(({ isIntersecting, boundingClientRect }) => {
              /**
               * 當倒數第二個焦點新聞列表結束與視窗相交，且倒數第二個焦點新聞列表底部 <= 視窗頂部
               * 開始固定倒數第一個焦點新聞列表
               */
              if (!isIntersecting && boundingClientRect.bottom <= 0) {
                this.shouldFixLastFocusList = true

                return
              }

              /**
               * 當倒數第二個焦點新聞列表開始與視窗相交，且倒數第二個焦點新聞列表頂部 < 視窗頂部
               * 結束固定倒數第一個焦點新聞列表
               */
              if (isIntersecting && boundingClientRect.top < 0) {
                this.shouldFixLastFocusList = false
              }
            })
          }.bind(this)
        )

        const lastSecondFocusList = document.querySelector(
          '.home__article-list-focus:nth-last-child(2)'
        )

        this.observerOfLastSecondFocusList.observe(lastSecondFocusList)
      })
    },
    cleanFixedLastFocusList() {
      this.shouldFixLastFocusList = false
      this.observerOfLastSecondFocusList?.disconnect()
    },

    sendGa(eventAction, eventLabel, eventValue, eventCategory = 'home') {
      this.$ga.event({
        eventAction,
        eventLabel,
        eventCategory,
        ...(eventValue === undefined ? {} : { eventValue }),
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

function inThePeriodBetween(startDate, endDate) {
  if (startDate === undefined || endDate === undefined) {
    return false
  }

  const now = Date.now()

  return now >= new Date(startDate) && now < new Date(endDate)
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
$width--aside: 226px;

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

    &:last-child.fixed {
      position: fixed;
      top: 0;
      width: $width--aside;
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
    width: $width--aside;
  }
}

.mirror-tv {
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

$right--events: 10px;

.events-container {
  position: fixed;
  bottom: 10px;
  right: $right--events;
  width: calc(50% - #{$right--events});
  z-index: 819;
  @include media-breakpoint-up(md) {
    width: 33%;
  }
  @include media-breakpoint-up(xl) {
    width: 25%;
  }
}

.event {
  position: relative;

  &--embedded {
    padding-top: 9 / 16 * 100%;

    div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  + .event {
    margin-top: 10px;
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
