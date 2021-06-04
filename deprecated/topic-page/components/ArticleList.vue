<template>
  <section class="articleList container">
    <template v-for="(item, index) in articles">
      <listArticle-block
        :id="`list-item-${index}`"
        :key="getValue(item, ['id'], Date.now())"
        :index="index"
        :initialArticle="item"
        :initialTogglePause="togglePause"
        @pauseAllAudio="pauseAllAudio"
      />
      <slot
        v-if="(index === 1 || index === 2 || index === 5) && hasDFP"
        :name="`microAd${getMicroAdName(index)}`"
      />
    </template>
  </section>
</template>

<script>
import verge from 'verge'
import { currentYPosition, elmYPosition } from '../../kc-scroll'
import { getValue } from '../util/comm'
import ListArticleBlock from './list/ListArticleBlock.vue'

const showAdCover = (store) => store.dispatch('deprecatedStore/SHOW_AD_COVER')
const debugDFP = require('debug')('CLIENT:DFP')

export default {
  name: 'ArticleList',
  components: {
    'listArticle-block': ListArticleBlock,
  },
  props: ['articles', 'hasDFP', 'currEnv'],
  data() {
    return {
      togglePause: undefined,
    }
  },
  mounted() {
    /**
     *  Have ad-cover be rendered as soon as #list-item-${index} gets visible.
     */
    /**
     *  Dont show ad cover on listing page for now.
     *  window.addEventListener('scroll', this.scrollEventHandlerForAd)
     */
  },
  methods: {
    getMicroAdName(index) {
      return index === 1 ? 0 : index === 2 ? 1 : 2
    },
    getValue,
    pauseAllAudio(index) {
      this.togglePause = index
    },
    scrollEventHandlerForAd() {
      if (this.isAdCoverCalledYet) {
        return
      }
      const currentTop = currentYPosition()
      const eleTop = elmYPosition('#list-item-2')
      const deviceHeight = verge.viewportH()
      if (currentTop + deviceHeight > eleTop) {
        debugDFP('SHOW ADCOVER!')
        showAdCover(this.$store)
        this.isAdCoverCalledYet = true
        window.removeEventListener('scroll', this.scrollEventHandlerForAd)
      }
    },
  },
}
</script>
<style lang="stylus" scoped>

.articleList
  &.container
    flex-direction column
    flex-wrap wrap
    margin-top 20px

  &__dfp
    &--l1
      width calc( 100% - 20px )
      margin 0 10px 40px

.nativeDFP
  width 100%
  margin-bottom 40px
  background-color #f4f1e9
  box-shadow 5px 5px 5px #bcbcbc
  transition all .3s ease-in-out

#articleListAutoScroll
  .listArticleBlock:last-child
    margin-bottom 40px

@media (min-width: 600px)
  .articleList
    &.container
      flex-direction row
      justify-content flex-start
      width calc(100% - 30px)

  .nativeDFP
    width calc( (100% - 40px) / 2 )
    margin 0 10px 40px
    &:hover
      transform translateY(-20px)
      box-shadow 5px 15px 5px #bcbcbc

@media (min-width: 1200px)
  .articleList
    &.container
      width 1044px
  .nativeDFP
    width calc( (100% - 60px) / 3 )
</style>

<style lang="stylus">
video::-internal-media-controls-download-button
  display none

video::-webkit-media-controls-enclosure
  overflow hidden

video::-webkit-media-controls-panel
  width calc(100% + 30px)

html
  box-sizing border-box
  font-size 16px

*, *:before, *:after
  box-sizing inherit

body
  font-family -apple-system, Microsoft JhengHei,"Segoe UI", Roboto, Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif;
  background-color #fff
  color #34495e
  overflow-y scroll

a
  display inline
  color #34495e
  text-decoration none
  cursor pointer

  u
    text-decoration none

  &.white
    &, &:hover, &:link, &:visited
      color #fff
  &.blue
    &, &:hover, &:link, &:visited
      color #0b4fa2

p, h2, h3
  font-weight normal

section.tweet
  .content
    a, a:hover, a:link, a:visited
      color #0b4fa2

button
  cursor pointer

button:disabled
  cursor not-allowed

input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none
}

#app
  overflow hidden

.desktop-only
  display none !important

.container
  width 100%
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin 0 auto

.grid-1-fourth
  width 25%

.grid-2-fourth
  width 50%

.grid-1-fifth
  width 20%

.grid-2-fifth
  width 40%

.grid-3-fifth
  width 60%

.grid-4-fifth
  width 80%

.view
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

.leading-embedded
  .embedded
    > iframe
      max-height 100%

.dfp-cover
  &:not(.vpon)
    height 100vh
    width 100vw
    position fixed
    top 0
    left 0
    z-index 9997
    background-color rgba(0, 0, 0, 0.7)
    display flex
    justify-content center
    align-items center

  > .ad
    position relative
    width 320px
    height 480px

    > .close
      position absolute
      top -16px
      right -16px
      width 32px
      height 32px
      background-image url(/assets/mirrormedia/icon/close-btn.png)
      background-repeat no-repeat
      background-size contain
      background-position center center
      cursor pointer

  &.vpon, &.ad2
    margin 0
    padding 0

.limited-height
  // height calc(100vh + 1px)
  height 100%
  background-color #000
  // overflow hidden
  &.no-scroll
    overflow hidden

[lazy=loading]
  margin 0 auto
  object-fit contain
  object-position center center
  background-size 40% 40%

@media (min-width 0px) and (max-width 320px)
  .dfp-cover
    > .ad
      > .close
        right 0
@media (min-width 600px)
  .container
    width 90%

@media (min-width 900px)
  .container
    width 768px

@media (max-width 1199px)
  .mobile-hide
    display none !important

@media (min-width 1200px)
  .mobile-only
    display none !important

  .desktop-only
    display flex !important

  .container
    width 1024px

@media only screen and (min-width 0px) and (max-width 1199px)
  .dfp-desktop
    display none !important

@media only screen and (min-width 1200px)
  .dfp-mobile
    display none !important
</style>
