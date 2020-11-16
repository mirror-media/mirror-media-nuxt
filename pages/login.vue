<template>
  <section class="page">
    <ContainerMembershipLoginWithEmail
      v-if="pageState === 'form'"
      @success="handleEmailLoginSuccess"
      @error="handleEmailLoginError"
    />
    <UiMembershipEmailSuccess
      v-else-if="pageState === 'success'"
      class="success-wrapper"
      :emailInput="emailShowInSuccess"
    />
    <UiMembershipEmailError
      v-else-if="pageState === 'error'"
      class="error-wrapper"
      @backToForm="handleBackToForm"
    />
  </section>
</template>

<script>
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'
import UiMembershipEmailError from '~/components/UiMembershipEmailError.vue'

export default {
  components: {
    ContainerMembershipLoginWithEmail,
    UiMembershipEmailSuccess,
    UiMembershipEmailError,
  },
  data() {
    return {
      pageState: 'form',
      emailShowInSuccess: '',
    }
  },
  methods: {
    handleEmailLoginSuccess(email) {
      this.pageState = 'success'
      this.emailShowInSuccess = email
    },
    handleEmailLoginError() {
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
  justify-content: center;
  align-items: center;
}
</style>
