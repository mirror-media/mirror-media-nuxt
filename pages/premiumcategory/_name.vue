<template>
  <section class="page">
    <div class="page-wrapper">
      <ContainerGptAd
        v-if="shouldShowAd"
        class="ad"
        pageKey="5fe15f1e123c831000ee54c2"
        adKey="HD"
      />
      <UiBreadcrumb class="category__breadcrumb" :breadcrumbs="breadcrumbs" />
      <ol class="category__list list">
        <li
          v-for="article in listData.slice(0, gptAdFTPostion)"
          :key="article.id"
          class="list__item item"
        >
          <UiArticleCardPremiumCompact
            class="item__card card"
            :href="article.href"
            :imgSrc="article.imgSrc"
            :infoTitle="article.infoTitle"
            :infoDescription="article.infoDescription"
            :infoDate="article.infoDate"
          />
        </li>
        <ContainerGptAd
          v-if="shouldShowAd"
          class="ad"
          pageKey="5fe15f1e123c831000ee54c2"
          adKey="FT"
        />
        <li
          v-for="article in listData.slice(gptAdFTPostion)"
          :key="article.id"
          class="list__item item"
        >
          <UiArticleCardPremiumCompact
            class="item__card card"
            :href="article.href"
            :imgSrc="article.imgSrc"
            :infoTitle="article.infoTitle"
            :infoDescription="article.infoDescription"
            :infoDate="article.infoDate"
          />
        </li>
      </ol>
      <UiInfiniteLoading
        v-if="shouldMountInfiniteLoading"
        @infinite="infiniteHandler"
      />
    </div>
    <ContainerGptAd
      v-if="shouldShowAd"
      class="ad"
      pageKey="5fe15f1e123c831000ee54c2"
      adKey="FT"
    />
    <UiStickyAd v-if="shouldShowAd" pageKey="5fe15f1e123c831000ee54c2" />
  </section>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { usePremiumBreadcrumbs } from '~/composition/premium-breadcrumbs'
import UiBreadcrumb from '~/components/UiBreadcrumb.vue'
import UiArticleCardPremiumCompact from '~/components/UiArticleCardPremiumCompact.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import { getStoryPath, stripHtmlTags } from '~/utils/article'
import { PREMIUM_AD_FEATURE_TOGGLE } from '~/configs/config.js'

export default {
  layout: 'premium',
  components: {
    UiBreadcrumb,
    UiArticleCardPremiumCompact,
    UiInfiniteLoading,
    ContainerGptAd,
    UiStickyAd,
  },
  setup() {
    const breadcrumbs = usePremiumBreadcrumbs()
    return {
      breadcrumbs,
    }
  },
  async fetch() {
    const response = await this.fetchList({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },

  data() {
    return {
      listData_: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
      PREMIUM_AD_FEATURE_TOGGLE,
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
      isViewportWidthUpMd: 'viewport/isViewportWidthUpMd',
    }),
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
    shouldShowAd() {
      return this.PREMIUM_AD_FEATURE_TOGGLE && !this.isPremiumMember
    },
    categoriesId() {
      const routeName = this.$route.params.name
      const categoryId = (
        this.$store.getters['sections-member/categories'].find(
          function getCategoryByName(category) {
            return category.name === routeName
          }
        ) ?? {}
      )?.id
      return [categoryId]
    },
    listData() {
      return _.uniqBy(
        this.listData_,
        function identifyDuplicatedItemById(listItem) {
          return listItem.id
        }
      )
    },
    gptAdFTPostion() {
      console.log('here')
      if (!this.isViewportWidthUpXl && this.isViewportWidthUpMd) {
        return 8
      }
      return 12
    },

    /**
     * Constraint which prevent loadmore unexpectly
     * if we navigating on client-side
     * due to the list data of the first page has not been loaded.
     */
    shouldMountInfiniteLoading() {
      return this.listDataCurrentPage >= 1
    },

    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },
  },

  methods: {
    createCategoryBreadcrumb(category) {
      return [
        {
          text: category.title,
          link: `/category/${category.name}`,
          color: '#054F77',
        },
      ]
    },
    transformListItemContent(item = {}) {
      item = item || {}
      const section = item.sections?.[0] || {}
      const brief =
        (typeof item.brief === 'string' ? item.brief : item.brief?.html) ?? ''

      return {
        id: item.id,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: section.title ?? '',
        infoTitle: item.title ?? '',
        infoDescription: stripHtmlTags(brief),
        infoDate: new Date(item.publishedDate),
      }
    },

    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.transformListItemContent)
      this.listData_.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.meta?.total ?? 0
    },

    async fetchList({ page }) {
      return await this.$fetchList({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        categories: this.categoriesId,
        page,
      })
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchList({
          page: this.listDataCurrentPage,
        })
        this.setListData(response)
        if (this.listDataCurrentPage >= this.listDataPageLimit) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (e) {
        $state.error()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #f2f2f2;
  padding: 24px 20px 48px 20px;
  @include media-breakpoint-up(md) {
    padding: 48px;
  }
  @include media-breakpoint-up(xl) {
    padding: 60px 88px;
  }

  &__category {
    & + & {
      margin: 48px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 60px 0 0 0;
      }
      @include media-breakpoint-up(xl) {
        margin: 80px 0 0 0;
      }
    }
  }
}

.page-wrapper {
  @include media-breakpoint-up(md) {
    max-width: 672px;
    margin: 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
  }
}

.category {
  &__list {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: -8px 0 0 0;
    }
    @include media-breakpoint-up(xl) {
      margin: 2px 0 0 -32px;
    }
    .ad {
      width: 100%;
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  overflow-y: hidden;
  @include media-breakpoint-up(md) {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  @include media-breakpoint-up(xl) {
    justify-content: flex-start;
  }

  &__item {
    @include media-breakpoint-up(md) {
      margin: 32px 0 0 0;
    }
    @include media-breakpoint-up(xl) {
      margin: 22px 0 0 32px;
    }
    & + & {
      margin: 40px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 32px 0 0 0;
      }
      @include media-breakpoint-up(xl) {
        margin: 22px 0 0 32px;
      }
    }
  }
}

.item {
  display: flex;
  flex-direction: column;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 10px;
  }
}

.ad {
  margin: 20px 0;
}
</style>
