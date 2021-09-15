<template>
  <div class="loading-cover">
    <UiMembershipLoadingIcon />
  </div>
</template>

<script>
import UiMembershipLoadingIcon from '~/components/UiMembershipLoadingIcon.vue'

export default {
  components: {
    UiMembershipLoadingIcon,
  },
}
</script>

<style lang="scss" scoped>
.loading-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}
</style>
