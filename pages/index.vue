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

      <section
        v-show="!showHomepageEditorChoiceB"
        class="editor-choices-container"
      >
        <UiColumnHeader
          title="編輯精選"
          class="home__column-header home__column-header--editor-choices"
        />
        <UiEditorChoices
          :articles="editorChoicesArticles"
          @sendGa="sendGaForClick('choice')"
        />
      </section>

      <section
        v-show="showHomepageEditorChoiceB"
        class="editor-choices-and-latest-container"
      >
        <section class="editor-choices-container">
          <UiColumnHeader
            title="編輯精選"
            class="home__column-header home__column-header--editor-choices"
          />
          <UiEditorChoicesB
            :articles="editorChoicesArticles"
            @sendGa="sendGaForClick('choice')"
          />
        </section>
        <div
          v-show="itemsBesideEditorChoices.length"
          class="latest-beside-editor-choices-container"
        >
          <UiArticleListAsideItem
            v-for="(item, index) in itemsBesideEditorChoices"
            :key="`${item.slug}-aside-${index}`"
            :item="item"
          />
        </div>
      </section>

      <ContainerGptAd
        class="home__ad home__ad--mb-l1"
        pageKey="home"
        adKey="MB_L1"
      />

      <div class="column-container">
        <aside v-if="shouldShowFocus">
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
              class="home__ad home__ad--pc-b1"
              pageKey="home"
              adKey="PC_B1"
            />
          </ClientOnly>

          <section class="container">
            <UiColumnHeader title="最新文章" class="home__column-header" />
            <UiArticleGallery
              v-if="shouldShowFocus"
              :isPremiumMember="isPremiumMember"
              :items="itemsOfLatestList"
              @sendGa="sendGaForClick('latest')"
            />
            <UiArticleGalleryWithoutFocus
              v-else
              :isPremiumMember="isPremiumMember"
              :items="latestItems"
              :showTopFive="!showHomepageEditorChoiceB"
              @sendGa="sendGaForClick('latest')"
            />
            <UiInfiniteLoading
              v-if="hasLoadedFirstGroupedArticle && latestItems.length > 3"
              @infinite="handleInfiniteLoad"
            />
          </section>
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
import UiEditorChoicesB from '~/components/UiEditorChoicesB.vue'
import UiVideoModal from '~/components/UiVideoModal.vue'
import UiArticleListFocus from '~/components/UiArticleListFocus.vue'
import UiArticleGallery from '~/components/UiArticleGallery.vue'

import UiArticleGalleryWithoutFocus from '~/components/UiArticleGalleryWithoutFocus.vue'

import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiArticleListAsideItem from '~/components/UiArticleListAsideItem.vue'

import SvgCloseIcon from '~/assets/close-black.svg?inline'

// import { isTruthy } from '~/utils/index.js'
import { stripHtmlTags } from '~/utils/article.js'
import { removeArticleWithExternalLink } from '~/utils/index.js'
import { CATEGORY_ID_MARKETING, SITE_OG_IMG } from '~/constants/index.js'
const CATEGORY_ID_POLITICAL = '5979ac0de531830d00e330a7' // 政治
const CATEGORY_ID_CITY_NEWS = '5979ac33e531830d00e330a9' // 社會
const CATEGORY_ID_BUSINESS = '57e1e16dee85930e00cad4ec' // 財經
const CATEGORY_ID_LATESTNEWS = '57e1e200ee85930e00cad4f3' // 娛樂頭條

const GA_UTM_EDITOR_CHOICES = 'utm_source=mmweb&utm_medium=editorchoice'

/*
 * 東森新聞
 * const PARTNER_ID_EBC = '5ea7fd55a66f9e0f00a04e9a'
 */

const LATEST_ARTICLES_MIN_NUM = 6
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

    UiArticleGalleryWithoutFocus,
    SvgCloseIcon,
    UiArticleListAsideItem,
    UiEditorChoicesB,
  },

  async fetch() {
    const [groupedResponse, flashNewsResponse] = await Promise.allSettled([
      this.$fetchGroupedWithExternal('post_external01'),
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
    this.groupedArticles.choices = removeArticleWithExternalLink(
      this.groupedArticles.choices
    )
    this.getGroupedArticlesWithoutExternalLink()

    this.loadLatestListInitial()
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
      latestWithExternal: {
        items: [],
        total: 0,
        maxResults: 20,
        page: 0,
      },
      areMicroAdsInserted: false,
      areExternalsInserted: false,
      fileId: 0,

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
      hasLoadedFirstGroupedArticle: false,
      isNoNeedToFetchLatestList: false,
      observerOfLastSecondFocusList: undefined,
      canFixLastFocusList: false,
      shouldFixLastFocusList: false,
      microAdIndexInserted: [],
    }
  },

  computed: {
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),

    shouldShowFocus() {
      return false
    },

    editorChoicesArticles() {
      const { choices: articles = [] } = this.groupedArticles
      function transformContent(article, isPremiumMember) {
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
          style,
          slug,
          title,
          href:
            style !== 'projects'
              ? `${getHref(article, isPremiumMember)}?${GA_UTM_EDITOR_CHOICES}`
              : getHref(article, isPremiumMember),
          imgSrc: tablet.url || SITE_OG_IMG,
          imgSrcMobile: mobile.url || SITE_OG_IMG,
          label: section.title,
          sectionName: section.name,
        }
      }
      return articles.map((article) =>
        transformContent(article, this.isPremiumMember)
      )
    },
    latestItems() {
      const listWithUniqueItems = _.uniqBy(
        this.latestList.items,
        function identifyDuplicateById(item) {
          if (item.isMicroAd) {
            return `microId-${item.idx}`
          }
          return item.id
        }
      )
      return listWithUniqueItems.sort(function (currentItem, nextItem) {
        return nextItem.publishedTimeStamp - currentItem.publishedTimeStamp
      })
    },

    itemsOfLatestList() {
      return this.latestItems.slice(6)
    },
    itemsBesideEditorChoices() {
      return this.latestItems.slice(0, 5)
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

      return articles.map((article) =>
        transformContentOfFocus(article, this.isPremiumMember)
      )

      function transformContentOfFocus(article, isPremiumMember) {
        const { slug = '', title = '', relateds = [] } = article

        return {
          title,
          slug,
          href: getHref(article, isPremiumMember),
          imgSrc: getImg(article),
          relateds: relateds
            .slice(0, 3)
            .map((related) =>
              transformContentOfFocusRelated(related, this.isPremiumMember)
            ),
        }
      }

      function transformContentOfFocusRelated(article, isPremiumMember) {
        const { slug = '', title = '' } = article

        return {
          slug,
          title,
          href: getHref(article, isPremiumMember),
        }
      }
    },
    showHomepageEditorChoiceB() {
      return (
        this.$GOExp?.['homepage-editor-choices-redesigned']?.variant === '1' &&
        this.isDesktopWidth
      )
    },
  },

  watch: {
    isDesktopWidth: ['handleFixLastFocusList'],
    canFixLastFocusList: ['handleFixLastFocusList'],

    hasScrolled: ['loadFixedEventMod', 'loadEventEmbedded'],
    showHomepageEditorChoiceB: ['insertMicroAds'],
  },

  beforeMount() {
    this.checkScrolled()
  },
  async mounted() {
    try {
      if (this.shouldUpdateLatestArticle()) {
        const groupedResponse = await this.$fetchGroupedWithExternal(
          'post_external01'
        )
        this.groupedArticles = groupedResponse
        this.getGroupedArticlesWithoutExternalLink()
        this.loadLatestListInitial()
      }
    } catch (err) {
      console.error(err)
    }
    this.hasLoadedFirstGroupedArticle = true

    this.microAdIndexInserted = this.showHomepageEditorChoiceB
      ? [7, 10, 13]
      : [2, 5, 8]

    this.insertMicroAds()
  },
  beforeDestroy() {
    this.cleanFixedLastFocusList()
  },

  methods: {
    shouldUpdateLatestArticle() {
      /*
       * Safari can't accept original format of time ("YYYY-MM-DD hh:mm:ss") in groupedArticles to generate Date object,
       * should convert to certain format("YYYY-MM-DDThh:mm:ss") first.
       */
      const formattedTimeStamp = this.groupedArticles?.timestamp.replace(
        / /g,
        'T'
      )
      const articlesUpdateTimestamp = new Date(formattedTimeStamp).getTime()
      const currentTimestamp = new Date().getTime()
      return currentTimestamp - articlesUpdateTimestamp > 1000 * 180
    },
    insertMicroAds() {
      const newIndex = this.showHomepageEditorChoiceB ? [7, 10, 13] : [2, 5, 8]
      if (newIndex[0] !== this.microAdIndexInserted[0]) {
        this.areMicroAdsInserted = false
      }
      this.microAdIndexInserted = newIndex
      if (
        this.latestItems.length < LATEST_ARTICLES_MIN_NUM ||
        this.areMicroAdsInserted
      ) {
        return
      }

      this.latestList.items = this.latestList.items.filter(
        (item) => !item.isMicroAd
      )
      this.microAdIndexInserted.forEach((idxInserted, idxUnit) => {
        this.insertLatestItems(idxInserted, {
          isMicroAd: true,
          idx: idxUnit,
        })
      })

      this.areMicroAdsInserted = true
    },

    getGroupedArticlesWithoutExternalLink() {
      this.groupedArticles.latest = removeArticleWithExternalLink(
        this.groupedArticles.latest
      )
    },
    async fetchFlashNews() {
      const { items: articles = [] } =
        (await this.$fetchPostsFromMembershipGateway({
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
    loadLatestListInitial() {
      const list = [...this.groupedArticles.latest]
      this.pushLatestItems(list.splice(0, 20))
      this.setLatestTotal(20)

      this.fileId += 1
    },
    async fetchLatestList() {
      if (this.fileId === 5) {
        this.isNoNeedToFetchLatestList = true
        return []
      }
      try {
        const { latest = [] } = await this.$fetchGroupedWithExternal(
          `post_external0${this.fileId}`
        )
        this.fileId += 1
        return latest
      } catch (err) {
        this.fileId += 1
        return []
      }
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
      const {
        id = '',
        title = '',
        brief,
        publishedDate = '',
        redirect = '',
      } = item

      return {
        id,
        title,
        description: _.isObject(brief)
          ? stripHtmlTags(brief.html ?? '')
          : brief,
        href: getHref(item, this.isPremiumMember),
        imgSrc: getImg(item),
        label: getLabel(item),
        sectionName: getSectionName(item),
        publishedTimestamp: new Date(publishedDate).getTime(),
        redirect,
      }
    },
    async handleInfiniteLoad(state) {
      if (this.isNoNeedToFetchLatestList) {
        state.complete()
      } else {
        await this.loadMoreLatestItems()
        state.loaded()
      }
      this.sendGa('scroll', 'loadmore', this.latestList.page)
    },
    async loadMoreLatestItems() {
      this.latestList.page += 1
      if (
        this.groupedArticles?.latest.length <=
        this.latestList.maxResults * (this.latestList.page + 1)
      ) {
        const newLatest = await this.fetchLatestList()
        this.groupedArticles.latest?.push(
          ...newLatest.map((item) => {
            return {
              id: item.slug,
              ...item,
            }
          })
        )
        this.getGroupedArticlesWithoutExternalLink()
      }
      this.pushLatestItems(
        this.groupedArticles.latest.slice(
          this.latestList.maxResults * this.latestList.page,
          this.latestList.maxResults * (this.latestList.page + 1)
        )
      )
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

function getHref(
  { style = '', slug = '', partner, name = '' } = {},
  isPremiumMember = false
) {
  if (partner) {
    return `/external/${slug}/`
  }
  if (style === 'campaign') {
    return `/campaigns/${slug}/index.html`
  } else if (style === 'projects') {
    return `/projects/${slug}/index.html`
  } else if (isPremiumMember) {
    return `pre/story/${slug}`
  }
  return `/story/${slug}/`
}

function getImg({ heroImage, ogImage, heroVideo, partner } = {}) {
  if (partner) {
    return heroImage
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
    if (partner.name === 'healthnews') {
      return '生活'
    } else if (partner.name === 'ebc') {
      return '時事'
    } else {
      return '時事'
    }
  }

  if (sections.length > 0) {
    if (sections.some((section) => section.name === 'member')) {
      return '會員專區'
    } else {
      return sections[0]?.title
    }
  }

  const [firstCategory = {}, secondCategory = {}] = categories

  if (firstCategory.id === CATEGORY_ID_MARKETING && categories.length >= 2) {
    return secondCategory.title
  }

  return firstCategory.title
}
function getSectionName({ sections = [], partner } = {}) {
  if (partner) {
    return 'external'
  } else if (sections?.some((section) => section.name === 'member')) {
    return 'member'
  }
  return sections[0]?.name
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

    .column-header__top-five {
      display: span;
      ul {
        display: span;
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

.editor-choices-and-latest-container {
  display: flex;
  .editor-choices-container {
    width: 640px;
  }
}

.editor-choices-container {
  margin-bottom: 20px;

  @include media-breakpoint-up(sm) {
    margin-bottom: 40px;
  }
}

.latest-beside-editor-choices-container {
  width: 368px;
  margin-left: 16px;
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
    padding-top: math.div(9, 16) * 100%;

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
