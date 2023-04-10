<template>
  <div class="wrapper">
    <article class="article-body">
      <UiPremiumBrief :brief="brief" :briefColor="briefColor" />
      <ContentHandler
        v-for="item in contentWithAd"
        :key="item.id"
        :item="item"
      />
      <UiArticleSkeleton v-show="isLoading" />

      <ClientOnly>
        <UiDonateBanner v-if="shouldShowDonate" class="donate-banner" />
        <template v-if="pageState === 'premiumPageIsLogin'">
          <UiReloadArticle
            v-show="isFail"
            :failTimes="failTimes"
            @reload="handleReload"
          />
          <div class="copyright-warning">
            <p>
              本新聞文字、照片、影片專供鏡週刊會員閱覽，未經鏡週刊授權，任何媒體、社群網站、論壇等均不得引用、改寫、轉貼，以免訟累。
            </p>
            <p>
              更多內容，歡迎<a href="https://www.mirrormedia.mg/papermag"
                >訂閱鏡週刊</a
              >、<a :href="`${storyPageBaseUrl}/webauthorize/`"
                >了解內容授權資訊</a
              >。
            </p>
          </div>

          <UiMagazineAfterArticle
            v-if="$GOExp['premium-post-related-position'].variant !== '1'"
          />
        </template>
      </ClientOnly>
    </article>
    <ClientOnly v-if="!hideInvite">
      <div
        v-if="!failTimes && isArticleContentTruncatedByGateway"
        class="invite-to-login-wrapper"
      >
        <div class="invite-to-login-wrapper__fade-out-effect" />
        <UiPremiumInviteToSubscribe
          :shouldShowLoginNow="!$store.getters['membership/isLoggedIn']"
          @subscribePremium="$router.replace('/subscribe')"
          @subscribePost="handleSubscribePost"
          @login="handleLogin"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { computed, useStore } from '@nuxtjs/composition-api'
import ContentHandler from './ContentHandler.vue'
import UiPremiumBrief from './UiPremiumBrief.vue'
import UiArticleSkeleton from '~/components/culture-post-for-premium/UiArticleSkeleton.vue'
import UiReloadArticle from '~/components/culture-post-for-premium/UiReloadArticle.vue'
import UiPremiumInviteToSubscribe from '~/components/UiPremiumInviteToSubscribe.vue'
import UiMagazineAfterArticle from '~/components/culture-post-for-premium/UiMagazineAfterArticle.vue'
import { Frequency } from '~/constants/common'
import UiDonateBanner from '~/components/UiDonateBanner.vue'
export default {
  name: 'UiArticleBody',

  components: {
    ContentHandler,
    UiPremiumInviteToSubscribe,
    UiPremiumBrief,
    UiArticleSkeleton,
    UiReloadArticle,
    UiMagazineAfterArticle,
    UiDonateBanner,
  },

  setup() {
    const store = useStore()
    const storyPageBaseUrl = computed(
      () => store?.getters?.['membership-subscribe/storyPageBaseUrl']
    )
    return {
      storyPageBaseUrl,
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
    briefColor: {
      type: String,
      default: null,
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
    isArticleContentTruncatedByGateway: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFail: {
      type: Boolean,
      default: false,
      required: true,
    },
    failTimes: {
      type: Number,
      default: 0,
    },
    hideInvite: {
      type: Boolean,
      default: false,
    },
    sectionIdFirst: {
      type: String,
      default: '5fe15f1e123c831000ee54c2',
    },
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpMd',
    }),
    shouldShowDonate() {
      const slug = this.$route?.params?.slug ?? ''
      if (/^\d{8}(mkt|cnt|prf|corpmkt)/.test(slug)) {
        return false
      }
      return this.$config.donateFeatureToggle
    },
    contentWithAd() {
      let content = this.content
      if (!this.isViewportWidthUpMd) {
        const ad = {
          type: 'gpt-ad',
          id: 'adA1',
          content: [{ pageKey: this.sectionIdFirst, adKey: 'MB_AT1' }],
        }
        for (let i = 0; i < content.length; i++) {
          if (content[i].content?.[0]) {
            content = [...content.slice(0, i + 1), ad, ...content.slice(i + 1)]
            break
          }
        }
      }
      return content
    },
  },
  methods: {
    handleReload() {
      this.$emit('reload')
    },
    handleLogin() {
      window.location.assign(`/login?destination=${this.$route.fullPath}`)
    },
    handleSubscribePost() {
      window.location.assign(
        `/subscribe/info?plan=${Frequency.OneTimeHyphen}&one-time-post-id=${this.postId}`
      )
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
    .donate-banner {
      a {
        text-decoration: none;
      }
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
  @include media-breakpoint-up(xl) {
    width: 640px;
    margin-right: auto;
    margin-left: auto;
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
      left: 0;
    }
    @include media-breakpoint-up(xxl) {
      width: 774px;
    }
  }
}
.donate-banner {
  margin: 32px 0 32px;
}
</style>
