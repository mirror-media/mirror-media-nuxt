<template>
  <nav class="header-nav">
    <UIHeaderNavSection :sections="sections" />
    <!-- <UIHeaderNavTopic :topics="topics" /> -->
  </nav>
</template>

<script>
import UIHeaderNavSection from './UIHeaderNavSection.vue'
// import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

export default {
  name: 'UIHeaderNav',
  components: {
    UIHeaderNavSection,
    // UIHeaderNavTopic,
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
  },
}
</script>

<style lang="sass" scoped>
.header-nav
  background-color: #f5f5f5
</style>
