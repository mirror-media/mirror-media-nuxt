<template>
  <section class="page">
    <div class="page-wrapper">
      <div
        v-for="category in data"
        :key="category.id"
        class="page__category category"
      >
        <UiBreadcrumb
          class="category__breadcrumb"
          :breadcrumbs="createCategoryBreadcrumb(category)"
          :separatorColor="'#054F77'"
        />
        <ol class="category__list list">
          <li
            v-for="article in category.latest"
            :key="article.id"
            class="list__item item"
          >
            <UiArticleCardPremium
              class="item__card card"
              :href="transformListItemContent(article).href"
              :imgSrc="transformListItemContent(article).imgSrc"
              :infoTitle="transformListItemContent(article).infoTitle"
              :infoDescription="
                transformListItemContent(article).infoDescription
              "
              :infoDate="transformListItemContent(article).infoDate"
            />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
import UiBreadcrumb from '~/components/UiBreadcrumb.vue'
import UiArticleCardPremium from '~/components/UiArticleCardPremium.vue'
import { getStoryPath, stripHtmlTags } from '~/utils/article'

export default {
  layout: 'premium',
  components: {
    UiBreadcrumb,
    UiArticleCardPremium,
  },

  async fetch() {
    this.data = await this.$fetchMemberSectionsArticles()
  },

  data() {
    return {
      data: [],
    }
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
  },
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #f2f2f2;
  padding: 24px 0 48px 20px;
  @include media-breakpoint-up(md) {
    padding: 48px 0 48px 48px;
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
  max-width: 1024px;
  margin: 0 auto;
}

.category {
  &__list {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 24px 0 0 0;
    }
    @include media-breakpoint-up(xl) {
      margin: 18px 0 0 -32px;
    }
  }
}

.list {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  @include media-breakpoint-up(xl) {
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  &__item {
    @include media-breakpoint-up(xl) {
      margin: 22px 0 0 32px;
    }
    & + & {
      margin: 0 0 0 12px;
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
    @include media-breakpoint-up(xl) {
      //display: none;
    }
  }
}
</style>
