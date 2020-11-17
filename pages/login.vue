<template>
  <section class="page">
    <ContainerMembershipLoginWithGoogle />
    <ContainerMembershipLoginWithEmail
      v-if="pageState === 'form'"
      @success="handleEmailLoginSuccess"
      @error="handleLoginError"
    />
    <UiMembershipEmailSuccess
      v-else-if="pageState === 'success'"
      class="success-wrapper"
      :emailInput="emailShowInSuccess"
    />
    <UiMembershipError
      v-else-if="pageState === 'error'"
      class="error-wrapper"
      @backToForm="handleBackToForm"
    />
  </section>
</template>

<script>
import ContainerMembershipLoginWithGoogle from '~/components/ContainerMembershipLoginWithGoogle.vue'
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'
import UiMembershipError from '~/components/UiMembershipError.vue'

export default {
  components: {
    ContainerMembershipLoginWithGoogle,
    ContainerMembershipLoginWithEmail,
    UiMembershipEmailSuccess,
    UiMembershipError,
  },
  data() {
    return {
      pageState: 'form',
      emailShowInSuccess: '',
    }
  },
  async beforeMount() {
    try {
      const result = await this.$fire.auth.getRedirectResult()
      if (result.user !== null) {
        this.$router.replace('/')
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      this.handleLoginError()
    }
  },
  methods: {
    handleEmailLoginSuccess(email) {
      this.pageState = 'success'
      this.emailShowInSuccess = email
    },
    handleLoginError() {
      this.pageState = 'error'
    },
    handleBackToForm() {
      this.pageState = 'form'
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 0 20px;
  min-height: calc(100vh - 118px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
