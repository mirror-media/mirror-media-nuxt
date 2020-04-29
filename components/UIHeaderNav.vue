<template>
  <nav class="header-nav">
    <UIHeaderNavSection :sections="sections" />
    <UIHeaderNavTopic />
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
  },
}
</script>

<style lang="sass" scoped></style>
