<template>
  <section class="timelineHeadline">
    <div
      class="timelineHeadline__heroImage"
      :style="{ backgroundImage: `url(${topicImage})` }"
    >
      <div class="timelineHeadline__heroImage--title" />
    </div>
  </section>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    initialTimeline: {
      type: Object,
      required: true,
    },
  },
  computed: {
    timeline() {
      return this.initialTimeline
    },
    topic() {
      return _.get(this.timeline, ['topic'])
    },
    topicImage() {
      return _.get(
        this.topic,
        ['heroImage', 'image', 'resizedTargets', 'desktop', 'url'],
        ''
      )
    },
  },
}
</script>

<style lang="stylus" scoped>
.timelineHeadline
  position fixed
  z-index -1
  width 100vw
  height 100vh
  &__heroImage
    width 100%
    height 100%
    background-repeat no-repeat
    background-size cover
    background-position center
    margin 0
    display flex
    justify-content center
    align-items center
    &--title
      position absolute
      left 50%
      transform translateX(-50%)
      background-repeat no-repeat
      background-size contain
</style>
