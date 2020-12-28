<template>
  <section class="page">
    <ContainerMembershipProfileForm
      v-if="pageState === 'form'"
      @success="handleFormSuccess"
      @error="handleFormError"
    />
    <ContainerMembershipProfileSuccess
      v-else-if="pageState === 'success'"
      @backToForm="handleBackToForm"
    />
    <ContainerMembershipProfileError
      v-else-if="pageState === 'error'"
      @backToForm="handleBackToForm"
    />
  </section>
</template>

<script>
import ContainerMembershipProfileForm from '~/components/ContainerMembershipProfileForm.vue'
import ContainerMembershipProfileSuccess from '~/components/ContainerMembershipProfileSuccess.vue'
import ContainerMembershipProfileError from '~/components/ContainerMembershipProfileError.vue'

export default {
  components: {
    ContainerMembershipProfileForm,
    ContainerMembershipProfileSuccess,
    ContainerMembershipProfileError,
  },
  middleware: ['authenticate'],
  data() {
    return {
      pageState: 'form',
    }
  },
  methods: {
    handleFormSuccess() {
      this.pageState = 'success'
    },
    handleFormError() {
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
  padding: 40px;
  min-height: calc(100vh - 118px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
