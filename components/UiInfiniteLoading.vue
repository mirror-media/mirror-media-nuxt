<template>
  <client-only>
    <infinite-loading @infinite="infiniteHandler">
      <UiLoadmoreLoadingIcon slot="spinner" class="spinner" />
      <!-- provide empty slot if we want to disable load messages locally -->
      <!-- see: https://peachscript.github.io/vue-infinite-loading/guide/configure-load-msg.html#via-slot-sepcial-attribute -->
      <div slot="no-more" />
      <div slot="no-results" />
      <div slot="error" />
    </infinite-loading>
  </client-only>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import UiLoadmoreLoadingIcon from '~/components/UiLoadmoreLoadingIcon.vue'

export default {
  name: 'UiInfiniteLoading',
  components: {
    InfiniteLoading,
    UiLoadmoreLoadingIcon,
  },
  methods: {
    infiniteHandler($state) {
      this.$emit('infinite', $state)
    },
  },
}
</script>

<style lang="scss" scoped>
.spinner {
  margin: 20px 0 0 0;
}
</style>
