<template>
  <UiMembershipButtonSecondary class="button" @click.native="handleClick">
    <div v-show="!shouldShowLoading" class="content-wrapper">
      <SvgGoogleIcon />
      <span>使用 Google 帳號繼續</span>
    </div>
    <UiMembershipLoadingIcon v-show="shouldShowLoading" class="loading-icon" />
  </UiMembershipButtonSecondary>
</template>

<script>
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import SvgGoogleIcon from '~/assets/membership-google-icon.svg?inline'
import redirectDestination from '~/utils/redirect-destination'
import {
  isMemberSubscribeFeatureToggled,
  persistStorageState,
} from '~/xstate/member-subscribe/util'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  components: {
    UiMembershipButtonSecondary,
    UiMembershipLoadingIcon,
    SvgGoogleIcon,
  },
  props: {
    isFederatedRedirectResultLoading: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    shouldShowLoading() {
      return this.isFederatedRedirectResultLoading || this.isLoading
    },
  },
  methods: {
    async handleClick() {
      this.isLoading = true
      const isNavigatingMemberSubscribeFlow = this.stateMembershipSubscribe?.matches(
        '登入功能（獨立頁或 lightbox）'
      )
      if (
        isMemberSubscribeFeatureToggled(this.$route) &&
        isNavigatingMemberSubscribeFlow
      ) {
        this.sendMembershipSubscribe('送出')
        persistStorageState(this.stateMembershipSubscribe)
      } else {
        await redirectDestination.set(this.$route)
      }
      const provider = new this.$fireModule.auth.GoogleAuthProvider()
      this.$fire.auth.signInWithRedirect(provider)
    },
  },
}
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
}

.content-wrapper {
  display: flex;
  align-items: center;
  span {
    margin: 0 0 0 10px;
  }
}

.loading-icon {
  ::v-deep.dot {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
}
</style>
