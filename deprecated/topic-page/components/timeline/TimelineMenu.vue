<template>
  <section class="timelineMenu">
    <div
      class="timelineMenu-line"
      :style="[
        windowViewport > 600 ? { height: nodesAmount * 125 + 'px' } : {},
      ]"
    >
      <div class="timelineMenu-line__colorLine" />
      <div class="timelineMenu-line__bottomLine" />
    </div>
    <div
      v-for="(item, index) in highlightNodes"
      :key="`timelineMenu-${index}-${item.activity.id}`"
      class="timelineMenu-activityBox"
      :class="[index % 2 === 0 ? 'right' : 'left']"
      :style="[
        windowViewport > 600 ? { top: `calc(${index * 112}px + 1em)` } : {},
      ]"
    >
      <h2>{{ item.subtitle }}</h2>
      <a
        :href="`/activity/${item.activity.id}/${topicId}`"
        class="timelineMenu-activityBox__imgBox"
      >
        <div class="timelineMenu-activityBox__imgBox--title">
          {{ item.activity.name }}
        </div>
        <div
          class="timelineMenu-activityBox__imgBox--img"
          :style="{ backgroundImage: 'url(' + getImage(item) + ')' }"
        />
      </a>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
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
    highlightNodes() {
      return this.initialHighlightNodes
    },
    topicId() {
      return _.get(this.$route.params, ['topicId'])
    },
    nodesAmount() {
      return _.get(this.highlightNodes, ['length'])
    },
    windowViewport() {
      return this.viewport
    },
  },
  methods: {
    getImage(node) {
      let viewportTarget
      if (this.windowViewport < 600) {
        viewportTarget = 'mobile'
      } else if (this.windowViewport > 600 && this.windowViewport < 1200) {
        viewportTarget = 'tablet'
      } else {
        viewportTarget = 'desktop'
      }
      return _.get(node, [
        'activity',
        'heroImage',
        'image',
        'resizedTargets',
        viewportTarget,
        'url',
      ])
    },
  },
}
</script>

<style lang="stylus" scoped>

.timelineMenu
  position relative
  padding 20px 0
  background-color #f0f0f0
  h2
    position relative
    margin 0
    color #bf272d
    font-size 1.5rem
    font-weight bold
  h2:before
    content ''
    position absolute
    top 8.5px
    left -20px
    width 10px
    height 10px
    background-color #000
    border-radius 5px
  &-line
    display flex
    justify-content center
    position absolute
    top 1em
    left 1em
    width 10px
    height calc(100% - 2em)
    padding-top 13.5px
    &__colorLine
      width 1px
      height 100%
      background-color #000
  &-activityBox
    padding-left calc(1em + 20px)
    padding-right 1em
    &__imgBox
      display block
      position relative
      width 100%
      padding-top 56.25%
      &--title
        position absolute
        z-index 1
        top 0
        left 0
        width 100%
        padding .2em .2em .2em .4em
        color #fff
        font-size 1rem
        font-weight 300
        background-color rgba(191, 39, 45, .8)
      &--img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover

@media (min-width 600px)

  .timelineMenu
    h2
      width 250px
    h2:before
      top 6px
      left 0
      width 15px
      height 15px
      border-radius 7.5px
    h2:after
      content ''
      position absolute
      top 13px
      width 10px
      height 1px
      background-color #000
    &-line
      position relative
      top 0
      left 50%
      transform translateX(-50%)
      &__bottomLine
        position absolute
        left -5px
        bottom 0
        width 20px
        height 1px
        background-color #000
    &-activityBox
      position absolute
      width 250px
      height 224px
      padding 0
      margin 0 auto
      &.right
        left 50%
        h2
          left -7.5px
          padding-left 35px
        h2:after
          left 15px
        .timelineMenu-activityBox__imgBox
          left 27.5px
      &.left
        right 50%
        h2
          right -7.5px
          padding-right 35px
          text-align right
        h2:before
          left auto
          right 0
        h2:after
          right 15px
        .timelineMenu-activityBox__imgBox
          right 27.5px
        .timelineMenu-activityBox__imgBox:hover
          right 27.5px
        .timelineMenu-activityBox__imgBox--title
          text-align right
      &__imgBox
        width 250px
        height 166.5px
        padding 0
    &-activityBox:hover
      width 295.5px
      h2
        width 295.5px

      .timelineMenu-activityBox__imgBox
        width 295.5px
        height 197px

// CSS Color Filter

// .timelineBody
//   &.grayFilter
//     .timelineMenu-activityBox__imgBox--img
//       filter grayscale(100%)
//     .timelineMenu-activityBox__imgBox--img:hover
//       filter none
</style>
