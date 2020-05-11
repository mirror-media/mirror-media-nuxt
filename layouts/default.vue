<template>
  <div :class="[{ listing: isListing }]">
    <nuxt />
    <UIFooter :class="[{ 'footer--listing': isListing }]" />
  </div>
</template>

<script>
import UIFooter from '~/components/UIFooter.vue'

export default {
  components: {
    UIFooter,
  },
  computed: {
    isListing() {
      const listingRouteNames = ['section-name']
      return listingRouteNames.includes(this.$route.name)
    },
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
  &--listing
    margin: 0 32px
    @include media-breakpoint-up(xl)
      max-width: 1024px
      margin: 60px auto 0 auto
</style>
