<template>
  <div class="leading">
    <div class="leading-container">
      <div
        v-if="type === 'slideshow' && slideshowImgs.length > 0"
        class="leading-slideshow"
      >
        <Slider>
          <template v-for="(o, i) in slideshowImgs">
            <a
              v-if="$_leading_detectImgHref(o)"
              :key="`${i}-${Date.now()}`"
              :href="$_leading_getHref(o)"
              class="swiper-slide"
              target="_blank"
            >
              <img
                :src="getValue(o, ['image', 'url'])"
                :srcset="`${getValue(o, [
                  'image',
                  'resizedTargets',
                  'tablet',
                  'url',
                ])} 400w,
                  ${getValue(o, [
                    'image',
                    'resizedTargets',
                    'desktop',
                    'url',
                  ])} 800w`"
                sizes="(max-width: 499px) 100vw,
                  (min-width 500px) and (max-width 599px) 90vw,
                  (min-width 600px) and (max-width 767px) 80vw,
                  (min-width 768px) and (max-width 830px) 70vw,
                  (min-width 831px) and (max-width 1023px) 60vw,
                  55vw"
              />
            </a>
            <img
              v-else
              :key="`${i}-${Date.now()}`"
              :src="getValue(o, ['image', 'url'])"
              :srcset="`${getValue(o, [
                'image',
                'resizedTargets',
                'tablet',
                'url',
              ])} 600w,
                ${getValue(o, ['image', 'url'])}`"
              sizes="(max-width: 499px) 100vw,
                  (min-width 500px) and (max-width 599px) 90vw,
                  (min-width 600px) and (max-width 767px) 80vw,
                  (min-width 768px) and (max-width 830px) 70vw,
                  (min-width 831px) and (max-width 1023px) 60vw,
                  55vw"
              class="swiper-slide"
            />
          </template>
        </Slider>
      </div>
      <div v-else-if="type === 'image' && leadingImg" class="leading-image">
        <div class="img">
          <img
            :src="getValue(leadingImg, ['image', 'url'])"
            :srcset="`${getValue(leadingImg, [
              'image',
              'resizedTargets',
              'tablet',
              'url',
            ])} 400w,
              ${getValue(leadingImg, [
                'image',
                'resizedTargets',
                'desktop',
                'url',
              ])} 800w`"
            sizes="(max-width: 499px) 100vw,
              (min-width 500px) and (max-width 599px) 90vw,
              (min-width 600px) and (max-width 767px) 80vw,
              (min-width 768px) and (max-width 830px) 70vw,
              (min-width 831px) and (max-width 1023px) 60vw,
              55vw"
          />
        </div>
      </div>
      <div v-else-if="type === 'video' && leadingVideo" class="leading-video">
        <div class="video">
          <video ref="video" controls>
            <source
              :src="getValue(leadingVideo, ['video', 'url'])"
              :type="getValue(leadingVideo, ['video', 'filetype'])"
            />
          </video>
        </div>
      </div>
      <div
        v-else-if="type === 'embedded' && leadingEmedded"
        class="leading-embedded"
      >
        <div class="embedded" v-html="leadingEmedded" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { getValue } from '../util/comm'
import Slider from './Slider.vue'

export default {
  name: 'Leading',
  components: {
    Slider,
  },
  props: {
    mediaData: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    sliderOption() {
      return {
        autoplay: 3000,
        paginationable: false,
        paginationClickable: true,
        paginationHide: false,
        setNavBtn: true,
      }
    },
    slideshowImgs() {
      return _.get(this.mediaData, ['images', 'items'], [])
    },
    leadingImg() {
      return _.get(this.mediaData, ['heroImage'])
    },
    leadingVideo() {
      return _.get(this.mediaData, ['heroVideo'])
    },
    leadingEmedded() {
      return _.get(this.mediaData, ['embed'])
    },
  },
  methods: {
    $_leading_detectImgHref(item) {
      return _.indexOf(item.keywords, '@') !== -1
    },
    $_leading_getHref(item) {
      return _.split(item.keywords, '@-')[1]
    },
    getValue,
  },
}
</script>
<style lang="stylus" scoped>
.leading
  width 50%
  margin 0 auto

  .leading-container
    position relative
    padding-top 56.25%
    width 100%
    height 0

    .leading-slideshow
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      >>> .swiper-container
        height 100%
      >>> .swiper-slide
        object-fit contain
      >>> .swiper-button-prev, >>> .swiper-button-next
        width 30px
        height 40px
        margin-top -20px
        background-color rgba(245, 245, 245, .25)
        background-size 15px auto
        background-position 45% 50%
        background-repeat no-repeat
        border-radius 4px
        background-image url(/assets/mirrormedia/icon/arrow-slideshow-blue-left.png)
      >>> .swiper-button-prev
        left 5px
      >>> .swiper-button-next
        right 5px
        transform rotate(180deg)
    .img
      position absolute
      top 0
      left 0
      width 100%
      height 100%

      img
        width 100%
        object-fit contain
        max-height 100%

    .video
      position absolute
      top 0
      left 0
      width 100%
      height 100%

      video
        width 100%
        object-fit contain
        max-height 100%

    .leading-embedded
      .embedded
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        display flex
        justify-content center
        align-items center

        > iframe
          max-height 100%

  &.event
    .leading-container
      padding-top 0
      height auto

      .leading-embedded
        .embedded
          position static
          display block

@media (min-width 831px) and (max-width 1023px)
  .leading
    width 60%

@media (min-width 768px) and (max-width 830px)
  .leading
    width 70%

@media (min-width 600px) and (max-width 767px)
  .leading
    width 80%

@media (min-width 500px) and (max-width 599px)
  .leading
    width 90%

@media (min-width 0px) and (max-width 499px)
  .leading
    width 100%
</style>
