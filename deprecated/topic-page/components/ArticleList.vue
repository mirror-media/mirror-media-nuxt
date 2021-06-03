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
