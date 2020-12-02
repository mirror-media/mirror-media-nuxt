<template>
  <section class="page">
    <ContainerMembershipProfileForm />
  </section>
</template>

<script>
import ContainerMembershipProfileForm from '~/components/ContainerMembershipProfileForm.vue'

export default {
  components: {
    ContainerMembershipProfileForm,
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 40px;
}
</style>
