<template>
  <section class="page">
    <p class="current-member-email" v-text="currentMemberEmail" />
  </section>
</template>

<script>
export default {
  computed: {
    currentMemberEmail() {
      return this.$store.state.membership.user.email
    },
  },
}
</script>

<style scoped></style>
