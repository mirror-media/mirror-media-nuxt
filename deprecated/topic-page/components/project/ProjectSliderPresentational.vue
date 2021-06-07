<template>
  <div :class="[{ dark: isStyleDark }, 'project-slider']">
    <Slider
      :autoplay="false"
      :initialSlide="1"
      :showSwiperPagination="false"
      :slidesPerView="3"
    >
      <div
        v-for="project in projects"
        :key="`swiper-slide-${project.slug}`"
        class="swiper-slide project"
      >
        <a
          :href="getHrefFull(project)"
          :target="linkTarget"
          class="project__image"
          @click="sendGaEvent"
        >
          <img :src="getImage(project, 'mobile')" :alt="project.title" />
        </a>
        <a
          :href="getHrefFull(project)"
          :target="linkTarget"
          class="project__title"
          @click="sendGaEvent"
          v-text="getTruncatedVal(project.title, 20)"
        />
        <a
          :href="getHrefFull(project)"
          :target="linkTarget"
          class="project__desc"
          @click="sendGaEvent"
          v-text="getDescrption(project.brief)"
        />
      </div>
    </Slider>
  </div>
</template>
<script>
import { get } from 'lodash'
import sanitizeHtml from 'sanitize-html'
import { getHrefFull, getImage, getTruncatedVal } from '../../util/comm'
import Slider from '../Slider.vue'

export default {
  name: 'ProjectSliderPresentational',
  components: {
    Slider,
  },
  props: {
    isStyleDark: {
      type: Boolean,
      required: true,
    },
    linkTarget: {
      type: String,
      required: true,
    },
    projects: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getHrefFull,
    getImage,
    getTruncatedVal,
    getDescrption(brief) {
      return getTruncatedVal(
        sanitizeHtml(get(brief, 'html', ''), { allowedTags: [] }),
        20
      )
    },
    sendGaEvent() {
      this.$emit('sendGaEvent')
    },
  },
}
</script>
<style lang="stylus" scoped>
.project-slider
  .swiper-container
    border 1px solid rgba(0, 0, 0, .29)
  .swiper-slide
    justify-content flex-start
  .swiper-slide-visible
    & + .swiper-slide-visible
      border-left 1px solid rgba(0, 0, 0, .18)
  >>> .swiper-button-prev, >>> .swiper-button-next
    width 25px
    height 50px
    background-size contain
    background-repeat no-repeat
    background-position center center
  >>> .swiper-button-prev
    left 0
    background-image url(/assets/mirrormedia/icon/B-left.png)
  >>> .swiper-button-next
    right 0
    background-image url(/assets/mirrormedia/icon/B-right.png)

  &.dark
    background-color #000
    .swiper-container
      border 1px solid rgba(255, 255, 255, 0.49)
    .swiper-slide-visible
      & + .swiper-slide-visible
        border-left 1px solid rgba(255, 255, 255, 0.49)
    >>> .swiper-button-prev, >>> .swiper-button-next
      opacity 0.75
      &:hover
        opacity 1
    >>> .swiper-button-prev
      background-image url(/assets/mirrormedia/icon/B-left-white.png)
    >>> .swiper-button-next
      background-image url(/assets/mirrormedia/icon/B-right-white.png)
    .project
      &__title
        color #fff
      &__desc
        color rgba(255, 255, 255, 0.8)
.project
  max-width 33.33%
  margin 20px 0
  padding 0 30px
  > *
    & + *
      margin-top 10px
  > a
    align-self flex-start
    font-size 1.1rem
    text-align justify
    text-decoration none
  &__image
    position relative
    display block
    width 100%
    padding-top 66.66%
    font-size .75rem
    overflow hidden
    img
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      object-fit cover
      object-position center
  &__title
    color #3195b3
  &__desc
    color rgba(0, 0, 0, .49)
</style>
