<template>
  <section class="page">
    <ContainerMembershipCancelPleaseConfirm
      v-if="pageState === 'confirmation'"
      @success="handleCancelSuccess"
      @error="handleCancelError"
    />
    <ContainerMembershipCancelSuccess v-else-if="pageState === 'success'" />
    <ContainerMembershipCancelError v-else-if="pageState === 'error'" />
  </section>
</template>

<script>
import ContainerMembershipCancelPleaseConfirm from '~/components/ContainerMembershipCancelPleaseConfirm.vue'
import ContainerMembershipCancelSuccess from '~/components/ContainerMembershipCancelSuccess.vue'
import ContainerMembershipCancelError from '~/components/ContainerMembershipCancelError.vue'

export default {
  components: {
    ContainerMembershipCancelPleaseConfirm,
    ContainerMembershipCancelSuccess,
    ContainerMembershipCancelError,
  },
  middleware: ['authenticate'],
  data() {
    return {
      pageState: 'error',
    }
  },
  methods: {
    handleCancelSuccess() {
      this.pageState = 'success'
    },
    handleCancelError() {
      this.pageState = 'error'
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: calc(100vh - 118px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
