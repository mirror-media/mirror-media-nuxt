<template>
  <main>
    <aside>
      <section>
        <UIColumnHeader title="焦點新聞" class="home__column-header" />
        <div class="article-list-focus-container">
          <UIArticleListFocus
            v-for="article in articlesFocus"
            :key="article.slug"
            :articleMain="article"
            :articlesRelated="articlesRelatedFocus(article)"
            class="home__article-list-focus"
          />
        </div>
      </section>
    </aside>
  </main>
</template>

<script>
import UIColumnHeader from '~/components/UIColumnHeader.vue'
import UIArticleListFocus from '~/components/UIArticleListFocus.vue'

export default {
  name: 'Home',
  components: {
    UIColumnHeader,
    UIArticleListFocus,
  },
  async fetch() {
    this.articleGrouped = await this.$fetchGrouped()
  },
  data() {
    return {
      articleGrouped: {},
    }
  },
  computed: {
    articlesFocus() {
      return this.articleGrouped.grouped ?? []
    },
  },
  methods: {
    articlesRelated(articleData) {
      return articleData.relateds ?? []
    },
    articlesRelatedFocus(articleData) {
      return this.articlesRelated(articleData).slice(0, 3)
    },
  },
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
