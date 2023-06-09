<template>
  <div class="wrapper">
    <article
      :class="[
        'article-body',
        {
          'article-body--fade-out-bottom': pageState === 'premiumPageNotLogin',
        },
      ]"
    >
      <div v-if="doesHaveBrief" class="brief">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-for="item in brief" :key="item.id" v-html="item.content" />
      </div>

      <ContentHandler v-for="item in content" :key="item.id" :item="item" />
      <UiSupportBox v-if="shouldShowDonate" class="donate-banner" />
      <template v-if="pageState === 'premiumPageIsLogin'">
        <div class="copyright-warning">
          <p>
            本新聞文字、照片、影片專供鏡週刊會員閱覽，未經鏡週刊授權，任何媒體、社群網站、論壇等均不得引用、改寫、轉貼，以免訟累。
          </p>
        </div>
        <div class="magazine">
          <div>月費、年費會員免費線上閱讀動態雜誌</div>
          <button type="button" @click="enterMagazinePage">線上閱讀</button>
        </div>
      </template>
    </article>
    <UiPremiumInviteToLogin v-if="pageState === 'premiumPageNotLogin'" />
  </div>
</template>

<script>
import ContentHandler from './ContentHandler.vue'
import UiSupportBox from '~/components/UiSupportBoxBox.vue'
import UiPremiumInviteToLogin from '~/components/UiPremiumInviteToLogin.vue'
export default {
  name: 'UiArticleBody',

  components: {
    ContentHandler,
    UiPremiumInviteToLogin,
    UiSupportBox,
  },

  props: {
    brief: {
      type: Array,
      default: () => [],
      required: true,
    },
    content: {
      type: Array,
      default: () => [],
      required: true,
    },
    pageState: {
      type: String,
      default: 'premiumPageNotLogin',
      validator(value) {
        return [
          'premiumPageNotLogin',
          'premiumPageIsLogin',
          'storyPage',
        ].includes(value)
      },
    },
  },

  computed: {
    doesHaveBrief() {
      return this.brief.length > 0
    },
    shouldShowDonate() {
      const slug = this.$route?.params?.slug ?? ''
      if (/^\d{8}(mkt|cnt|prf|corpmkt)/.test(slug)) {
        return false
      }
      return this.$config.donateFeatureToggle
    },
  },
  methods: {
    enterMagazinePage() {
      window.location.href = '/magazine/'
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding-bottom: 60px;
}

.article-body {
  padding-bottom: 60px;
  font-size: 18px;
  line-height: 36px;
  text-align: justify;
  position: relative;
  &--fade-out-bottom {
    &:after {
      position: absolute;
      bottom: 0;
      content: '';
      display: block;
      width: 100%;
      height: 300px;
      background: linear-gradient(180deg, transparent 0%, white 80%);
      pointer-events: none;
    }
  }
  @include media-breakpoint-up(md) {
    padding-bottom: 50px;
  }

  > * {
    margin: 40px auto;
    padding-left: 27px;
    padding-right: 27px;
    @include media-breakpoint-up(md) {
      padding-left: 33px;
      padding-right: 33px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &::v-deep {
    a {
      color: rgba(199, 159, 101, 0.87);
      text-decoration: underline;
    }
    .donate-banner {
      a {
        text-decoration: none;
      }
    }
  }

  .brief {
    margin-bottom: 48px;
    @include media-breakpoint-up(lg) {
      margin-bottom: 120px;
      font-size: 18px;
      line-height: 1.67;
    }

    + * {
      margin-top: 0;
    }

    p + p {
      margin-top: 2em;
    }
  }
}

.copyright-warning {
  font-size: 14px;
  line-height: 180%;
  padding: 0;
  color: rgba(0, 0, 0, 0.5);
}

.magazine {
  margin: 24px 0;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  background-color: #fff;
  padding: 20px;
  color: #054f77;
  border: 1px solid rgba(155, 155, 155, 0.2);
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  @include media-breakpoint-up(xl) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    font-size: 20px;
  }

  button {
    width: 100%;
    background-color: #1d9fb8;
    border-radius: 2px;
    line-height: 1.38;
    color: #fff;
    padding: 12px 4px;
    margin-top: 16px;
    font-size: 18px;
    line-height: 25px;
    @include media-breakpoint-up(xl) {
      margin-top: 0;
      max-width: 170px;
      line-height: 27px;
    }
  }
}
.donate-banner {
  margin: 0 27px 24px;
  @include media-breakpoint-up(md) {
    margin: 0 33px 32px;
  }
}
</style>
