<template>
  <section class="timelineBody">
    <article>
      <div class="timelineBody__brief" v-html="getBrief()" />
      <timeline-menu
        :initialHighlightNodes="highlightNodes"
        :viewport="windowViewport"
      />
    </article>
  </section>
</template>

<script>
import _ from 'lodash'
import TimelineMenu from '../../components/timeline/TimelineMenu.vue'

export default {
  components: {
    'timeline-menu': TimelineMenu,
  },
  props: {
    initialTimeline: {
      type: Object,
      required: true,
    },
    initialHighlightNodes: {
      type: Array,
      default: () => [],
    },
    viewport: {
      type: Number,
      required: true,
    },
  },
  computed: {
    timeline() {
      return this.initialTimeline
    },
    highlightNodes() {
      return this.initialHighlightNodes
    },
    windowViewport() {
      return this.viewport
    },
  },
  methods: {
    getBrief() {
      return _.get(this.timeline, ['topic', 'brief', 'html'])
    },
  },
}
</script>

<style lang="stylus" scoped>

article
  padding-top 1em
  text-align justify

.timelineBody
  z-index 10
  padding-top 100vh
  background-color transparent
  &__brief
    width calc(100% - 2em)
    margin 0 auto
    padding-bottom 1em
    color #000
    line-height 1.5
    letter-spacing 2px
  > article
    background-color #fff

@media (min-width 600px)
  article
    > p
      width 80%
      padding 0
      margin 1em auto
  .timelineBody
    &__brief
      width 70%
      p:nth-child(1)
        color grey
        margin 0
</style>
