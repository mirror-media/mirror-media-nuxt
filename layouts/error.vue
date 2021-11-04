<template>
  <div class="page">
    <div class="message-container">
      <div class="page__info">
        <h1 v-text="errorState.statusCode" />
        <h2>抱歉！<br />{{ errorState.message }}</h2>
        <!-- 首頁改用 nuxt 後可以改成 NuxtLink -->
        <a href="/">| 回首頁 |</a>
        <!-- <NuxtLink to="/">| 回首頁 |</NuxtLink> -->
      </div>
      <picture class="page__info-bg">
        <source
          type="image/png"
          media="(min-width: 768px)"
          srcset="~/assets/404-md.png"
        />
        <img src="~/assets/404-sm.png" alt="" />
      </picture>
    </div>
    <div v-if="hasLatestStories" class="latest-container">
      <h2>熱門文章</h2>
      <div class="latest-container__list">
        <UiArticleCard
          v-for="item in latestStories"
          :key="item.href"
          :class="item.sectionName"
          :href="item.href"
          :imgSrc="item.imgSrc"
          :imgText="item.sectionTitle"
          :infoTitle="item.title"
          target="_self"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { SITE_OG_IMG } from '~/constants/index'
import UiArticleCard from '~/components/UiArticleCard.vue'

export default {
  layout: 'empty',
  components: {
    UiArticleCard,
  },
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      latestStories: [],
    }
  },
  computed: {
    hasLatestStories() {
      return this.latestStories?.length > 0
    },
    errorState() {
      switch (this.error.statusCode) {
        case 404:
          return {
            statusCode: 404,
            message: '找不到這個網址',
          }
        case 500:
        default:
          return {
            statusCode: 500,
            message: '系統忙碌中',
          }
      }
    },
  },
  mounted() {
    this.fetchPopularStories()
  },
  methods: {
    async fetchPopularStories() {
      const { report: items = [] } = await this.$fetchPopular()
      this.latestStories = items
        ?.slice(0, 3)
        .map(function transformContent({
          slug = '',
          title = '',
          heroImage = {},
          sections = [],
        }) {
          return {
            title,
            href: slug,
            imgSrc: heroImage?.image.resizedTargets?.mobile?.url || SITE_OG_IMG,
            sectionName: sections[0]?.name,
            sectionTitle: sections[0]?.title,
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 100px 20px 20px;
  color: #fff;
  background-color: #2c5970;
  @include media-breakpoint-up(md) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px;
  }
  h1,
  h2 {
    line-height: normal;
  }
  h1 {
    font-size: 60px;
    font-family: 'PT Mono', monospace, -apple-system, 'Helvetica Neue',
      sans-serif;
    @include media-breakpoint-up(md) {
      font-size: 70px;
    }
    @include media-breakpoint-up(lg) {
      font-size: 80px;
    }
  }
  h2,
  a {
    font-size: 20px;
  }
  h2 {
    @include media-breakpoint-up(md) {
      br {
        display: none;
      }
    }
  }
  .message-container {
    position: relative;
    + * {
      margin-top: 30px;
    }
  }
  .latest-container {
    @include media-breakpoint-up(md) {
      padding: 0 30px;
      &__list {
        display: flex;
      }
    }
    @include media-breakpoint-up(lg) {
      width: 75%;
      padding: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }
  &__info {
    position: absolute;
    left: 10%;
    bottom: 15%;
    h1,
    h2 {
      color: #f89228;
    }
    a {
      display: inline-block;
      margin: 10px 0 0;
      font-weight: 300;
    }
    @include media-breakpoint-up(md) {
      display: flex;
      align-items: flex-end;
      h2,
      a {
        padding-bottom: 13px;
        margin: 0 0 0 20px;
      }
    }
    @include media-breakpoint-up(lg) {
      h2,
      a {
        margin: 0 0 0 40px;
      }
      h2 {
        padding-bottom: 9px;
        font-size: 40px;
      }
      a {
        padding-bottom: 15px;
      }
    }
  }
  ::v-deep {
    .article {
      margin: 16px 0 0;
      box-shadow: none;
      @each $name, $color in $sections-color {
        &.#{$name} {
          .top-wrapper__text {
            background-color: $color !important;
          }
        }
      }
      .bottom-wrapper {
        padding: 16px;
      }
      @include media-breakpoint-up(md) {
        flex: 1;
        height: auto;
        + .article {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
