<template>
  <UiMembershipButtonSecondary class="button" @click.native="handleClick">
    <div v-show="!isLoading" class="content-wrapper">
      <SvgFacebookIcon />
      <span>使用 Facebook 帳號繼續</span>
    </div>
    <UiMembershipLoadingIcon v-show="isLoading" class="loading-icon" />
  </UiMembershipButtonSecondary>
</template>

<script>
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import SvgFacebookIcon from '~/assets/membership-facebook-icon.svg?inline'
import loginDestination from '~/utils/login-destination'

export default {
  components: {
    UiMembershipButtonSecondary,
    UiMembershipLoadingIcon,
    SvgFacebookIcon,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    async handleClick() {
      this.isLoading = true
      await loginDestination.set(this.$route)
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
