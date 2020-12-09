<template>
  <div>
    <main>
      <UiColumnHeader
        title="編輯精選"
        class="home__column-header home__column-header--editor-choices"
      />
      <UiEditorChoices
        :articles="editorChoicesArticles"
        @sendGa="sendGaForClick('choice')"
      />

      <aside>
        <section>
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

      <ClientOnly>
        <UiColumnHeader title="最新文章" class="home__column-header" />
        <UiArticleGallery
          :items="latestItems"
          @sendGa="sendGaForClick('latest')"
        >
          <template v-slot:ad="{ item }">
            <MicroAd
              :key="microAdUnits[item.idx].name"
              :unitId="microAdUnits[item.idx].id"
            />
          </template>
        </UiArticleGallery>
        <UiInfiniteLoading
          v-if="latestItems.length > 3"
          @infinite="loadMoreLatestList"
        />
      </ClientOnly>
    </main>
  </div>
</template>

<script>
import _ from 'lodash'

import UiColumnHeader from '~/components/UiColumnHeader.vue'
import UiEditorChoices from '~/components/UiEditorChoices.vue'
import UiArticleListFocus from '~/components/UiArticleListFocus.vue'
import UiArticleGallery from '~/components/UiArticleGallery.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'

import { isTruthy } from '~/utils/index.js'
import { stripHtmlTag } from '~/utils/article.js'
import { CATEGORY_ID_MARKETING, SITE_OG_IMG } from '~/constants/index.js'

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
    UiColumnHeader,
    UiEditorChoices,
    UiArticleListFocus,
    UiArticleGallery,
    UiInfiniteLoading,
  },

  async fetch() {
    this.articleGrouped = await this.$fetchGrouped()
  },

  data() {
    return {
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
  },

  methods: {
    async loadLatestListInitial() {
      const {
        items: articles = [],
        meta = { total: 0 },
      } = await this.fetchLatestList()

      // console.log(this.articlesFocus.flatMap((article) => article.relateds))

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
  getLabel,
}
</script>

<style lang="scss" scoped>
aside {
  @include media-breakpoint-up(xl) {
    width: 25%;
  }
}
.home {
  &__column-header {
    margin-bottom: 10px;

    &--editor-choices {
      @include media-breakpoint-up(lg) {
        display: none;
      }
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
}
.article-list-focus-container {
  border: 2px solid #224f73;
  padding: 14px 18px;
  @include media-breakpoint-up(xl) {
    border: none;
    padding: 0;
  }
}
</style>
