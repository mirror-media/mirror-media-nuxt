<template>
  <section class="page">
    <ContainerMembershipProfileForm
      v-if="pageState === 'form'"
      @success="handleFormSuccess"
    />
    <ContainerMembershipProfileSuccess
      v-else-if="pageState === 'success'"
      @backToForm="handleBackToForm"
    />
  </section>
</template>

<script>
import ContainerMembershipProfileForm from '~/components/ContainerMembershipProfileForm.vue'
import ContainerMembershipProfileSuccess from '~/components/ContainerMembershipProfileSuccess.vue'

export default {
  components: {
    ContainerMembershipProfileForm,
    ContainerMembershipProfileSuccess,
  },
  data() {
    return {
      pageState: 'form',
    }
  },
  methods: {
    handleFormSuccess() {
      this.pageState = 'success'
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
