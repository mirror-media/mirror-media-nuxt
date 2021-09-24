<template>
  <div class="wrapper">
    <article class="article-body">
      <UiPremiumBrief :brief="brief" />
      <ContentHandler v-for="item in content" :key="item.id" :item="item" />

      <ClientOnly>
        <template v-if="pageState === 'premiumPageIsLogin'">
          <div class="copyright-warning">
            <p>
              本新聞文字、照片、影片專供鏡週刊會員閱覽，未經鏡週刊授權，任何媒體、社群網站、論壇等均不得引用、改寫、轉貼，以免訟累。
            </p>
            <p>
              更多內容，歡迎<a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeqbPjhSZx63bDWFO298acE--otet1s4-BGOmTKyjG1E4t4yQ/viewform"
                >訂閱鏡週刊</a
              >、<a href="/story/webauthorize/">了解內容授權資訊</a>。
            </p>
          </div>
          <div class="magazine">
            <div>下載鏡週刊電子雜誌</div>
            <button type="button" @click="enterMagazinePage">立即下載</button>
          </div>
        </template>
      </ClientOnly>
    </article>
    <ClientOnly>
      <template v-if="!isMemberSubscribeFeatureToggled($route)">
        <div
          v-if="pageState === 'premiumPageNotLogin'"
          class="invite-to-login-wrapper"
        >
          <div class="invite-to-login-wrapper__fade-out-effect" />
          <UiPremiumInviteToLogin />
        </div>
      </template>
      <template v-else>
        <div
          v-if="
            stateMembershipSubscribe &&
            [
              '會員訂閱功能.會員文章頁.未登入',
              '會員訂閱功能.會員文章頁.已登入.未訂閱',
            ].some(stateMembershipSubscribe.matches)
          "
          class="invite-to-login-wrapper"
        >
          <div class="invite-to-login-wrapper__fade-out-effect" />
          <UiPremiumInviteToSubscribe
            :shouldShowLoginNow="
              stateMembershipSubscribe.matches('會員訂閱功能.會員文章頁.未登入')
            "
            @subscribePremium="sendMembershipSubscribe('加入Premium會員')"
            @subscribePost="
              sendMembershipSubscribe({
                type: '解鎖這篇報導',
                postId,
              })
            "
            @login="sendMembershipSubscribe('立即登入')"
          />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script>
import ContentHandler from './ContentHandler.vue'
import UiPremiumBrief from './UiPremiumBrief.vue'
import UiPremiumInviteToLogin from '~/components/UiPremiumInviteToLogin.vue'
import UiPremiumInviteToSubscribe from '~/components/UiPremiumInviteToSubscribe.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
import { isMemberSubscribeFeatureToggled } from '~/xstate/member-subscribe/util'

export default {
  name: 'UiArticleBody',

  components: {
    ContentHandler,
    UiPremiumInviteToLogin,
    UiPremiumInviteToSubscribe,
    UiPremiumBrief,
  },

  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
      isMemberSubscribeFeatureToggled,
    }
  },

  props: {
    postId: {
      type: String,
      default: '',
    },
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
  font-size: 18px;
  line-height: 36px;
  text-align: justify;
  position: relative;
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

  & p:not(:first-child) {
    margin-top: 8px;
  }

  a {
    color: #054f77;
    text-decoration: none;
  }
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

.invite-to-login-wrapper {
  position: relative;
  &__fade-out-effect {
    position: absolute;
    bottom: 100%;
    width: 100vw;
    height: 300px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 80%);
    left: -20px;
    @include media-breakpoint-up(md) {
      left: calc((100vw - 608px) / 2 * -1);
    }
    @include media-breakpoint-up(xl) {
      width: 720px;
      left: calc(((720px - 640px) / 2) * -1);
    }
  }
}
</style>
