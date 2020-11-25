<template>
  <section class="page">
    <p class="current-member-email" v-text="currentMemberEmail" />
    <input type="text" class="input" />
    <UiMembershipDropdownMenu
      :options="['男', '女', '不透露']"
      style="width: 90px"
    />
    <UiMembershipDropdownMenu
      :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
      :height="50"
      style="width: 104px"
    />
    <UiMembershipDropdownMenu
      :options="['男', '女', '不透露']"
      :isDisable="true"
      style="width: 90px"
    />
  </section>
</template>

<script>
import UiMembershipDropdownMenu from '~/components/UiMembershipDropdownMenu.vue'
export default {
  components: {
    UiMembershipDropdownMenu,
  },
  computed: {
    currentMemberEmail() {
      return this.$store.state.membership.user.email
    },
  },
}
</script>

<style lang="scss" scoped>
.input {
  height: 50px;
  background-color: #f2f2f2;
  padding: 15px 20px;
  font-size: 16px;
  color: #4a4a4a;
}
</style>
