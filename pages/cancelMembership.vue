<template>
  <section class="page">
    <ContainerMembershipCancelPleaseConfirm
      v-if="pageState === 'confirmation'"
      @success="handleCancelSuccess"
    />
    <ContainerMembershipCancelSuccess v-else-if="pageState === 'success'" />
  </section>
</template>

<script>
import ContainerMembershipCancelPleaseConfirm from '~/components/ContainerMembershipCancelPleaseConfirm.vue'
import ContainerMembershipCancelSuccess from '~/components/ContainerMembershipCancelSuccess.vue'

export default {
  components: {
    ContainerMembershipCancelPleaseConfirm,
    ContainerMembershipCancelSuccess,
  },
  data() {
    return {
      pageState: 'confirmation',
    }
  },
  methods: {
    handleCancelSuccess() {
      this.pageState = 'success'
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
