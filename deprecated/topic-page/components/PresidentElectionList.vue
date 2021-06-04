<template>
  <article class="candidates">
    <section
      v-for="(cand, idx) in candidateData"
      :key="cand.tagId"
      class="candidate-card"
    >
      <div class="candidate-card__wrapper">
        <div class="candidate-card__content">
          <div class="candidate-card__head">
            <div
              class="candidate-card__img"
              :style="{ backgroundImage: `url(${cand.img})` }"
            />
            <h2 :style="{ backgroundColor: cand.color }">
              {{ cand.title }}
            </h2>
          </div>
          <div class="candidate-card__body">
            <template v-for="art in beginningArts(cand.articles)">
              <a
                :key="`a-${art.id}`"
                :href="`/story/${art.slug}`"
                target="_blank"
                >{{ getArtTitle(art.title) }}</a
              >
              <hr
                :key="`hr-${art.id}`"
                :style="{ backgroundColor: cand.color }"
              />
            </template>
          </div>
        </div>

        <div
          class="candidate-card__load-more-body"
          :style="loadMoreBodyStyle(idx)"
        >
          <template v-for="art in loadMoreArts(cand.articles)">
            <a
              :key="`a-${art.id}`"
              :href="`/story/${art.slug}`"
              target="_blank"
              >{{ getArtTitle(art.title, true) }}</a
            >
            <hr
              :key="`hr-${art.id}`"
              :style="{ backgroundColor: cand.color }"
            />
          </template>
        </div>

        <div
          :class="[
            'candidate-card__load-more-btn',
            isTouchDevice ? '' : 'no-touch',
          ]"
          @click="loadMore(cand.tagId, idx)"
        >
          <img
            src="/deprecated/topic-page/assets/mirrormedia/refresh.png"
            alt="refresh"
          />
          <div>看更多</div>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
import { debounce, isTouchDevice } from '../util/comm.js'

export default {
  name: 'PresidentElectionList',
  props: ['candidateData'],
  data() {
    return {
      artTitleEl: null,

      // LM = Load More
      artTitleLMEl: null,
      artTitleW: 0,
      artTitleLMW: 0,
      wEl: null,

      // ww = window width
      ww: 0,
      pages: [1, 1, 1],
      isTouchDevice: isTouchDevice(),
    }
  },
  computed: {
    isLap() {
      return this.ww >= 768
    },
  },
  mounted() {
    this.wEl = window
    this.ww = this.wEl.innerWidth
    this.artTitleEl = document.querySelector('.candidate-card__body')
    this.artTitleLMEl = document.querySelector(
      '.candidate-card__load-more-body'
    )
    this.artTitleW = this.artTitleEl.clientWidth
    this.artTitleLMW = this.artTitleLMEl.clientWidth
    this.wEl.addEventListener('resize', debounce(this.handleWWChange, 300))
    this.wEl.addEventListener(
      'orientationChange',
      debounce(this.handleWWChange, 300)
    )
  },
  methods: {
    beginningArts(arts) {
      return arts ? arts.slice(0, 3) : []
    },
    loadMoreArts(arts) {
      return arts ? arts.slice(3) : []
    },
    loadMore(tagId, idx) {
      this.pages[idx] += 1
      this.$emit('loadMore', tagId, this.pages[idx])
    },
    loadMoreBodyStyle(idx) {
      const page = this.pages[idx]
      const height = this.isLap ? 260 : 180
      const addedH = this.isLap ? 13.6 : 4.8
      const marginTop = this.isLap ? 13.6 : 12.8
      return {
        height: `${height * (page - 1) + addedH * (page > 2 ? page - 2 : 0)}px`,
        marginTop: page - 1 ? `${marginTop}px` : 0,
      }
    },
    handleWWChange() {
      this.ww = this.wEl.innerWidth
      this.artTitleW = this.artTitleEl.clientWidth
      this.artTitleLMW = this.artTitleLMEl.clientWidth
    },
    getArtTitle(title, isLoadMore = false) {
      const titleFontSize = this.isLap ? 18 : 15
      const titleW = isLoadMore ? this.artTitleLMW : this.artTitleW
      const titleFontNum = Math.floor(titleW / titleFontSize) * 2 - 3
      return title.length <= titleFontNum
        ? title
        : title.substr(0, titleFontNum).concat('⋯')
    },
  },
}
</script>

<style lang="stylus" scoped>
.candidates
  max-width 1920px
  display flex
  flex-wrap wrap
  padding 0 8px 16px 8px
  margin-left auto
  margin-right auto
.candidate-card
  flex 0 0 100%
  // @media (min-width: 768px)
  //   flex-basis 50%
  //   padding-right 8px
  //   padding-left 8px
  // @media (min-width: 992px)
  //   flex-basis 25%
  @media (min-width: 768px)
    flex-basis 33.33%
    padding-right 8px
    padding-left 8px
  // @media (min-width: 768px) and (max-width: 991.98px)
  //   &:nth-child(1), &:nth-child(2)
  //     margin-bottom 16px
  &__wrapper
    // display: flex
    // align-items center
    background-color #fff
    box-shadow 0 0 6px 0 rgba(0, 0, 0, 0.1)
    padding 15px
    // @media (min-width: 768px)
    //   flex-wrap wrap
    // & > div
    //   flex 1 1 50%
    //   @media (min-width 768px)
    //     flex-basis 100%
  &__content
    display flex
    align-items center
    @media (min-width 768px)
      flex-wrap wrap
    & > div
      flex 1 1 50%
      @media (min-width 768px)
        flex-basis 100%
  &__load-more-body
    display flex
    flex-direction column
    justify-content space-between
  &__load-more-btn
    display flex
    align-items center
    justify-content center
    background-color #d8d8d8
    border-radius 4px
    margin-top 10px
    font-size 15px
    color #000
    padding-top 7px
    padding-bottom 7px
    cursor pointer
    user-select none
    transition background-color 0.2s ease-out
    @media (min-width: 768px)
      margin-top 15px
    &.no-touch:hover, &:not(.no-touch):active
      background-color #9b9b9b
    & img
      width 13.5px
      height 14.6px
      margin-right 5px
      &.active
        animation rotate 0.8s linear infinite
        @keyframes rotate
          100%
            transform rotate(180deg)
  &__head
    margin-right 8px
    @media (min-width 768px)
      margin-right 0
      margin-bottom 15px
  &__body
    height 180px
    margin-left 8px
    display flex
    flex-direction column
    justify-content space-between
    @media (min-width 768px)
      margin-left 0
      height 260px
  &__img
    border-top-right-radius 8px
    border-top-left-radius 8px
    height 146px
    background-size cover
    background-position center
    background-repeat no-repeat
    @media (min-width 992px)
      height 248px
  & + &
    margin-top 10px
    @media (min-width 768px)
      margin-top 0
h2
  height 34px
  display flex
  justify-content center
  align-items center
  margin 0
  border-bottom-right-radius 8px
  border-bottom-left-radius 8px
  font-size 15px
  font-weight 600
  color #fff
  text-shadow 0 0 1px rgba(0, 0, 0, 0.2)
  padding-right 8px
  padding-left 8px
  text-align center
  @media (min-width 345px)
    font-size 17px
  @media (min-width 768px)
    font-size 22px
    height 52px
a
  height 50px
  text-align justify
  display flex
  align-items center
  cursor pointer
  font-size 15px
  line-height 1.67
  color rgba(0, 0, 0, 0.9)
  @media (min-width 768px)
    font-size 18px
    line-height 1.89
    height 62px
hr
  margin 0
  height 2px
  border 0
  border-radius 1px
</style>
