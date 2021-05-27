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
      <ContentHandler
        v-for="item in contentWithBriefAhead"
        :key="item.id"
        :item="item"
      />

      <template v-if="pageState === 'premiumPageIsLogin'">
        <div class="copyright-warning">
          <p>
            本新聞文字、照片、影片專供鏡週刊會員閱覽，未經鏡週刊授權，任何媒體、社群網站、論壇等均不得引用、改寫、轉貼，以免訟累。
          </p>
        </div>
        <div class="magazine">
          <div>下載鏡週刊電子雜誌</div>
          <button type="button" @click="enterMagazinePage">立即下載</button>
        </div>
      </template>
    </article>
    <UiPremiumInviteToLogin v-if="pageState === 'premiumPageNotLogin'" />
  </div>
</template>

<script>
import ContentHandler from './ContentHandler.vue'
import UiPremiumInviteToLogin from '~/components/UiPremiumInviteToLogin.vue'

export default {
  name: 'UiArticleBody',

  components: {
    ContentHandler,
    UiPremiumInviteToLogin,
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
    contentWithBriefAhead() {
      return this.brief.concat(this.content)
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

  //> * {
  //  margin: 40px auto;
  //  padding-left: 27px;
  //  padding-right: 27px;
  //  @include media-breakpoint-up(md) {
  //    padding-left: 33px;
  //    padding-right: 33px;
  //  }
  //
  //  &:last-child {
  //    margin-bottom: 0;
  //  }
  //}

  &::v-deep {
    a {
      color: rgba(199, 159, 101, 0.87);
      text-decoration: underline;
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
</style>
