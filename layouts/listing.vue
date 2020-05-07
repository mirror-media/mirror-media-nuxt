<template>
  <div class="listing">
    <nuxt />
    <UIFooter class="footer" />
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
.listing
  background-color: #f2f2f2
  padding: 0 0 60px 0
  @include media-breakpoint-up(xl)
    padding: 0

.footer
  margin: 0 32px
  @include media-breakpoint-up(xl)
    max-width: 1024px
    margin: 60px auto 0 auto
</style>
