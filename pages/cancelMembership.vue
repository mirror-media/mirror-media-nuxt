<template>
  <section class="page">
    <ContainerMembershipCancelPleaseConfirm />
  </section>
</template>

<script>
import ContainerMembershipCancelPleaseConfirm from '~/components/ContainerMembershipCancelPleaseConfirm.vue'

export default {
  components: {
    ContainerMembershipCancelPleaseConfirm,
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
