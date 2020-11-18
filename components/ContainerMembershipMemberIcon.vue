<template>
  <div class="icon-wrapper">
    <SvgMembershipMemberIconLoggedIn
      v-if="isLoggedIn"
      class="icon logged-in-icon"
    />
    <SvgMembershipMemberIconNotLoggedIn
      v-else
      class="icon not-logged-in-icon"
    />
  </div>
</template>

<script>
import SvgMembershipMemberIconLoggedIn from '~/assets/membership-member-icon-logged-in.svg?inline'
import SvgMembershipMemberIconNotLoggedIn from '~/assets/membership-member-icon-not-logged-in.svg?inline'

export default {
  components: {
    SvgMembershipMemberIconLoggedIn,
    SvgMembershipMemberIconNotLoggedIn,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['membership/isLoggedIn']
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  width: 100%;
  height: 100%;
}
</style>
