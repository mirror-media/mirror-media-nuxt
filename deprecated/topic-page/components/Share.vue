<template>
  <div
    class="share"
    :class="direction"
    :style="[
      isTimeline ? { display: 'block' } : {},
      {
        top: `${top}`,
        right: `${right}`,
        bottom: `${bottom}`,
        left: `${left}`,
      },
    ]"
  >
    <a
      class="share__icon share--toggle"
      :style="{ backgroundColor: `${color}` }"
      @click="toggleShare()"
      ><img
        :src="
          isOpen
            ? '/assets/mirrormedia/icon/close_white.png'
            : '/assets/mirrormedia/icon/share-white.png'
        "
        :alt="isOpen ? '關閉' : '開啟'"
    /></a>
    <a
      class="share__icon share__icon--list share--line"
      :class="[isOpen ? 'open' : '']"
      @click="shareLine"
      ><img src="/assets/mirrormedia/icon/line_white_v2.png" alt="Line"
    /></a>
    <a
      class="share__icon share__icon--list share--fb"
      :class="[isOpen ? 'open' : '']"
      @click="shareFacebook"
      ><img src="/assets/mirrormedia/icon/facebook_white.png" alt="Facebook"
    /></a>
  </div>
</template>

<script>
import _ from 'lodash'
import { TOPIC_PROTEST_ID } from '../constants/index'
import { sendGaClickEvent, shareLine, shareFacebook } from '../util/comm'

export default {
  name: 'Share',
  props: {
    direction: {
      type: String,
      default: 'top',
    },
    top: {
      type: String,
      default: 'auto',
    },
    right: {
      type: String,
      default: 'auto',
    },
    bottom: {
      type: String,
      default: 'auto',
    },
    left: {
      type: String,
      default: 'auto',
    },
    color: {
      type: String,
      default: '#356d9c',
    },
    sharePath: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    isTimeline() {
      return (
        _.get(this.$store.state.deprecatedStore, [
          'route',
          'params',
          'topicId',
        ]) === TOPIC_PROTEST_ID
      )
    },
    link() {
      return _.get(
        this,
        ['sharePath'],
        this.$store.state.deprecatedStore.route.path
      )
    },
  },
  methods: {
    sendGaClickEvent,
    shareLine() {
      shareLine({
        route: this.link,
        title: document
          .querySelector('meta[property="og:title"]')
          .getAttribute('content'),
      })
      sendGaClickEvent('listing', 'share line')
    },
    shareFacebook() {
      shareFacebook({ route: this.link })
      sendGaClickEvent('listing', 'share fb')
    },
    toggleShare() {
      this.isOpen = !this.isOpen
    },
  },
}
</script>

<style lang="stylus" scoped>

.share
  display none
  position fixed
  z-index 500
  right 20px
  bottom 20px
  width 40px
  height 40px
  &__icon
    display flex
    justify-content center
    align-items center
    position absolute
    top 0
    left 0
    width 38px
    height 38px
    border-radius 19px
    font-size 0
    transition transform .2s ease-out
    > img
      width auto
      height 20px
    &--list
      top 1px
      left 1px

  &--toggle
    width 40px
    height 40px
    border-radius 20px
    z-index 500

  &--line
    z-index 400
    background-color #00c300
    &.open
      transition-duration .19s

  &--fb
    z-index 400
    background-color #3b5998
    &.open
      transition-duration .19s

  &--google
    z-index 400
    background-color #dd4b39
    &.open
      transition-duration .19s

    > img
      width 20px
      height auto
.activity
    &__share
      display block
      z-index 999

.share
  &.top
    .share--line
      &.open
        transform translate3d(0,-100px,0)
    .share--fb
      &.open
        transform translate3d(0,-50px,0)
    .share--google
      &.open
        transform translate3d(0,-50px,0)
  &.right
    .share--line
      &.open
        transform translate3d(100px,0,0)
    .share--fb
      &.open
        transform translate3d(50px,0,0)
    .share--google
      &.open
        transform translate3d(50px,0,0)
  &.bottom
    .share--line
      &.open
        transform translate3d(0,100px,0)
    .share--fb
      &.open
        transform translate3d(0,50px,0)
    .share--google
      &.open
        transform translate3d(0,50px,0)
  &.left
    .share--line
      &.open
        transform translate3d(-100px,0,0)
    .share--fb
      &.open
        transform translate3d(-50px,0,0)
    .share--google
      &.open
        transform translate3d(-50px,0,0)
@media (min-width 600px)
  .share
    display block

@media only screen and (max-width: 736px) and (orientation: landscape)
  .activity
    &__share
      display none
</style>
