<template>
  <div class="wrapper">
    <article
      :class="[
        'article-body',
        {
          'article-body--fade-out-bottom': shouldInviteVisitorToJoinMembership,
        },
      ]"
    >
      <div v-if="doesHaveBrief" class="brief">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-for="item in brief" :key="item.id" v-html="item.content" />
      </div>

      <ContentHandler v-for="item in content" :key="item.id" :item="item" />

      <div v-if="!shouldInviteVisitorToJoinMembership" class="magazine">
        <div>下載鏡週刊電子雜誌</div>
        <button type="button" @click="enterMagazinePage">立即下載</button>
      </div>
    </article>
    <UiPremiumInviteToLogin v-if="shouldInviteVisitorToJoinMembership" />
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
  },

  computed: {
    doesHaveBrief() {
      return this.brief.length > 0
    },
    isCurrentPagePremium() {
      return this.$route.name === 'premium-slug'
    },
    shouldInviteVisitorToJoinMembership() {
      return (
        this.isCurrentPagePremium &&
        !this.$store.getters['membership/isLoggedIn']
      )
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

.magazine {
  margin: 24px 27px;
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
