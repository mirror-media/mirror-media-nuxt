<template>
  <section class="leadingWatch">
    <div
      class="leadingWatchImg"
      :style="{ backgroundImage: 'url(' + getImageURL() + ')' }"
    >
      <div class="leadingWatchImg-headline">
        <h1 class="leadingWatchImg-headline__enName" />
        <h3 class="leadingWatchImg-headline__zhName" />
        <div class="leadingWatchImg-intro">
          <span class="leadingWatchImg-intro__title" />
          <img
            src="/deprecated/topic-page/assets/mirrormedia/icon/tag-arrow.png"
          />
        </div>
      </div>
    </div>
    <div class="leadingWatchTag">
      <router-link
        id="leadingWatchTag__first--link"
        to="/tag/57fe7bfa5eb4360e00e6116d"
        class="sihh"
      >
        <div class="leadingWatchTag__tag">
          <span
            id="leadingWatchTag__first--desktopTitle"
            class="leadingWatchTag__tag--desktop"
            >日內瓦國際高級鐘錶沙龍</span
          >
          <span
            id="leadingWatchTag__first--mobileTitle"
            class="leadingWatchTag__tag--mobile"
            >SIHH</span
          >
        </div>
      </router-link>
      <router-link
        id="leadingWatchTag__second--link"
        to="/tag/587496583c1f950d00ce359a"
        class="baselworld"
      >
        <div class="leadingWatchTag__tag">
          <span
            id="leadingWatchTag__second--desktopTitle"
            class="leadingWatchTag__tag--desktop"
            >巴塞爾世界鐘錶珠寶大展</span
          >
          <span
            id="leadingWatchTag__second--mobileTitle"
            class="leadingWatchTag__tag--mobile"
            >BASELWORLD</span
          >
        </div>
      </router-link>
      <router-link
        id="leadingWatchTag__third--link"
        to="/tag/587496cf3c1f950d00ce359b"
        class="wphh"
      >
        <div class="leadingWatchTag__tag">
          <span
            id="leadingWatchTag__third--desktopTitle"
            class="leadingWatchTag__tag--desktop"
            >WPHH世界高級鐘錶展</span
          >
          <span
            id="leadingWatchTag__third--mobileTitle"
            class="leadingWatchTag__tag--mobile"
            >WPHH</span
          >
        </div>
      </router-link>
      <router-link
        id="leadingWatchTag__fourth--link"
        to="/tag/5874971a3c1f950d00ce359c"
        class="indie"
      >
        <div class="leadingWatchTag__tag">
          <span
            id="leadingWatchTag__fourth--desktopTitle"
            class="leadingWatchTag__tag--desktop"
            >獨立製錶師專區</span
          >
          <span
            id="leadingWatchTag__fourth--mobileTitle"
            class="leadingWatchTag__tag--mobile"
            >INDIE</span
          >
        </div>
      </router-link>
    </div>
  </section>
</template>
<script>
import { getImage } from '../util/comm'

export default {
  name: 'LeadingWatch',
  props: ['tag', 'topic', 'type'],
  methods: {
    getImageURL() {
      if (this.type === 'TOPIC') {
        return getImage(this.topic, 'desktop')
      } else {
        return getImage(this.tag, 'desktop')
      }
    },
  },
}
</script>
<style lang="stylus" scoped>

.leadingWatchImg
  display flex
  justify-content center
  align-items center
  width 100%
  height calc(100vh - 200px)
  background-position center center
  background-repeat no-repeat
  background-size cover
  &-headline
    text-align center
    color #fff
    > h1
      margin 0
      font-size 42px
      font-weight 700
    > h3
      margin 7px 0 26px
      font-size 19px
      font-weight 300
    &__enName, &__zhName
      visibility hidden
    &__enName:after, &__zhName:after
      visibility visible
  &-intro
    &__title
      visibility hidden
    &__title:after
      visibility visible
    > span
      margin-right 8px
      font-size 16px
      font-weight 300
    > img
      vertical-align middle
      height 8px

.leadingWatchTag
  display flex
  width 100%
  height 48px
  background-color #000
  border-top 1px solid #fff
  &__tag
    text-align center
    > span
      color #fff
      font-size 16px
      line-height 48px
    &--desktop
      display none
    &--mobile
      display block

  > a
    border-left 1px solid #fff
  > a:first-child
    border-left none
  > a
    display block
    font-size 0

@media (min-width: 1200px)
  .leadingWatchTag
    height 52px
    &__tag
      > span
        font-size 18px
        line-height 52px
      &--desktop
        display block
      &--mobile
        display none

.sihh
  flex-grow 1

.baselworld
  flex-grow 2

.wphh
  flex-grow 1

.indie
  flex-grow 1
</style>
