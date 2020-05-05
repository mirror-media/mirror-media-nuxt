<template>
  <nav class="header-nav">
    <UIHeaderNavSection :sections="sections" :partners="partners" />
    <UIHeaderNavTopic :topics="topics" />
  </nav>
</template>

<script>
import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

export default {
  name: 'UIHeaderNav',
  components: {
    UIHeaderNavSection,
    UIHeaderNavTopic,
  },
  props: {
    sections: {
      type: Array,
      required: true,
    },
    topics: {
      type: Array,
      required: true,
    },
    partners: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
.header-nav
  background-color: #f5f5f5
  box-shadow: 0 2px 1px rgba(#000, 0.2)
  z-index: 99
  @include media-breakpoint-up(xl)
    box-shadow: 0 0 5px #ccc
</style>
