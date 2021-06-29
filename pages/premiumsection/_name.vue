<template>
  <section class="page">
    <div class="page-wrapper">
      <UiBreadcrumb class="category__breadcrumb" :breadcrumbs="breadcrumbs" />
      <ol class="category__list list">
        <li
          v-for="article in listData"
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
  </section>
</template>

<script>
import _ from 'lodash'
import { usePremiumBreadcrumbs } from '~/composition/premium-breadcrumbs'
import UiBreadcrumb from '~/components/UiBreadcrumb.vue'
import UiArticleCardPremiumCompact from '~/components/UiArticleCardPremiumCompact.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import { getStoryPath, stripHtmlTags } from '~/utils/article'

export default {
  layout: 'premium',
  components: {
    UiBreadcrumb,
    UiArticleCardPremiumCompact,
    UiInfiniteLoading,
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
      breadcrumbs: [],
      listData_: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
    }
  },

  computed: {
    categoriesId() {
      const routeName = this.$route.params.name
      const categoriesId = (
        this.$store.state['sections-member'].data.find(
          function getSectionByName(section) {
            return section.name === routeName
          }
        ) ?? {}
      )?.categories?.map(function getCategoryById(category) {
        return category.id
      })
      return categoriesId
    },
    listData() {
      return _.uniqBy(this.listData_, function identifyDuplicatedItemById(
        listItem
      ) {
        return listItem.id
      })
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
</style>
