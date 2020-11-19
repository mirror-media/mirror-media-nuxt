<template>
  <div class="icon-wrapper">
    <SvgMembershipMemberIconLoggedIn
      v-if="isLoggedIn"
      class="icon logged-in-icon"
    />
    <nuxt-link v-else to="/login" class="not-logged-in-link">登入</nuxt-link>
  </div>
</template>

<script>
import SvgMembershipMemberIconLoggedIn from '~/assets/membership-member-icon-logged-in.svg?inline'

export default {
  components: {
    SvgMembershipMemberIconLoggedIn,
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
.not-logged-in-link {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #888888;
}
</style>
