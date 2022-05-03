<template>
  <div>
    <div class="topic">
      <div class="topic-title">
        <h1 />
      </div>
      <leading v-if="leadingType" :type="leadingType" :mediaData="mediaData" />
    </div>

    <PresidentElectionProgress v-if="isPresidentElectionId" />
    <PresidentElectionList
      v-if="isPresidentElectionId"
      :candidateData="candidateData"
      @loadMore="loadMorePresident"
    />

    <slot name="articleList"></slot>

    <slot name="vueDfp"></slot>
    <slot name="articleListAutoScroll"></slot>

    <Loading :show="loading" />
    <Share :right="`20px`" :bottom="`20px`" />
  </div>
</template>
<script>
import PresidentElectionProgress from '../PresidentElectionProgress.vue'
import PresidentElectionList from '../PresidentElectionList.vue'
import { getValue } from '../../util/comm'
import Leading from '../Leading.vue'
import Loading from '../Loading.vue'
import Share from '../Share.vue'

export default {
  components: {
    leading: Leading,
    Loading,
    Share,

    PresidentElectionProgress,
    PresidentElectionList,
  },
  props: [
    'mediaData',
    'isPresidentElectionId',
    'candidateData',
    'autoScrollArticles',
    'autoScrollArticlesLoadMore',
    'scrollHandler',
    'loading',
    'leadingType',
  ],

  destroyed() {},
  updated() {
    // console.log(this.$refs.articleList)
  },
  methods: { getValue },
}
</script>

<style lang="stylus" scoped>

.topic
  position relative
  width 100%
  padding-top 66.66%
  background-color rgba(135, 156, 169, 0.15)
  margin-bottom 20px
  background-repeat no-repeat
  background-position center center
  background-size cover
  &-view
    background-color #f2f2f2
  &-title
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 80%
    height 50%
    background-size cover
    background-repeat no-repeat
    h1
      margin 0

.topic-view.portraitWall
  .topic
    margin 0

.topicTimeline
  &__logo
    position fixed
    z-index 999
    top 5px
    left 5px
    width 40px
    height 40px
    > img
      width 100%
  &__projects
    width 100%
    padding 1em
    background-color #4d4d4d
    .project-container
      margin 1em 0
      background-color #fff
      .proj_title
        display none
    > h1
      margin 0
      color #fff
      text-align center
      font-weight 200

@media (min-width: 600px)
  .topic-view.wide
    .listArticleBlock
      display flex
      width 100%
      margin 0 10px
      & + .listArticleBlock
        margin-top 40px
        margin-bottom 0
      &__figure
        width 50%
        padding-top 33.33%
        &--colorBlock
          display none
      &__content
        display flex
        flex-direction column
        align-items flex-start
        width 50%
        padding 40px 30px 30px
        h2
          min-height 0
          padding 0
          font-size 1.6rem
          font-weight bold
        p
          margin-top 1em
          font-size 1.2rem
        &--colorBlock
          display block
          margin-bottom 1em
          padding .5em
          color #fff
          letter-spacing 1px

  .topicTimeline
    &__projects
      padding 5% 10%

@media (min-width: 900px)
  .topic
    height 600px
    padding-top 0
    &-title
      height 200px
      width 400px
      color #fff
      background-size contain
      background-position center center

.ad-container
  display flex
  justify-content center
  align-items center
</style>
