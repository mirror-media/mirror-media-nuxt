<template>
  <UiMembershipButtonSecondary class="button" @click.native="handleClick">
    <div v-show="!shouldShowLoading" class="content-wrapper">
      <SvgFacebookIcon />
      <span>使用 Facebook 帳號繼續</span>
    </div>
    <UiMembershipLoadingIcon v-show="shouldShowLoading" class="loading-icon" />
  </UiMembershipButtonSecondary>
</template>

<script>
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import SvgFacebookIcon from '~/assets/membership-facebook-icon.svg?inline'
import redirectDestination from '~/utils/redirect-destination'

export default {
  components: {
    UiMembershipButtonSecondary,
    UiMembershipLoadingIcon,
    SvgFacebookIcon,
  },
  props: {
    isFederatedRedirectResultLoading: {
      type: Boolean,
      default: true,
    },
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
      await redirectDestination.set(this.$route)
      const provider = new this.$fireModule.auth.FacebookAuthProvider()
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
