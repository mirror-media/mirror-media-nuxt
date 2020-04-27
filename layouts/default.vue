<template>
  <div>
    <nuxt />
    <UIFooter />
  </div>
</template>

<script>
import UIFooter from '~/components/UIFooter.vue'

export default {
  components: {
    UIFooter,
  },
}
</script>

<style lang="sass" scoped>
@debug map-get($grid-breakpoints, "xl")
</style>
