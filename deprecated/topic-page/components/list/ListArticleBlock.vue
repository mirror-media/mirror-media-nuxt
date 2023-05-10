<template>
  <div class="listArticleBlock" :class="{ noHoverEffect: removeHoverEffect }">
    <template
      v-if="
        articleType === 'campaign' ||
        articleType === 'projects' ||
        articleType === 'readr'
      "
    >
      <figure class="listArticleBlock__figure">
        <a
          :href="getHrefFull(article)"
          target="_blank"
          @click="sendGaClickEvent('listing', 'latest')"
        >
          <LazyImage
            :src="getImage(article, 'mobile')"
            :caption="getValue(article, ['title'])"
          />
        </a>
        <div
          class="listArticleBlock__figure--colorBlock"
          :style="{ backgroundColor: sectionColor }"
          v-text="colorBlockTitle"
        />
      </figure>
      <div class="listArticleBlock__content">
        <h2>
          <a
            :href="getHrefFull(article)"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getValue(article, ['title'])"
          />
        </h2>
        <p>
          <a
            :href="getHrefFull(article)"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getBrief(article, 45)"
          />
        </p>
      </div>
    </template>
    <template v-else-if="articleType === 'video'">
      <figure class="listArticleBlock__figure">
        <a
          :href="`https://youtu.be/${getValue(article, [
            'snippet',
            'resourceId',
            'videoId',
          ])}`"
          target="_blank"
          @click="sendGaClickEvent('listing', 'latest')"
        >
          <img
            v-lazy="getValue(article, ['snippet', 'thumbnails', 'high', 'url'])"
            :alt="getValue(article, ['snippet', 'title'])"
          />
        </a>
        <div
          class="listArticleBlock__figure--colorBlock"
          :style="{ backgroundColor: sectionColor }"
        >
          Video
        </div>
      </figure>
      <div class="listArticleBlock__content">
        <h2>
          <a
            :href="`https://youtu.be/${getValue(article, [
              'snippet',
              'resourceId',
              'videoId',
            ])}`"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getValue(article, ['snippet', 'title'])"
          />
        </h2>
        <p>
          <a
            :href="`https://youtu.be/${getValue(article, [
              'snippet',
              'resourceId',
              'videoId',
            ])}`"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="
              getTruncatedVal(getValue(article, ['snippet', 'description']), 45)
            "
          />
        </p>
      </div>
    </template>
    <template v-else-if="articleType === 'audio'">
      <figure class="listArticleBlock__figure">
        <img
          v-lazy="
            getValue(
              article,
              ['coverPhoto', 'image', 'resizedTargets', 'mobile', 'url'],
              '/deprecated/topic-page/assets/mirrormedia/notImage.png'
            )
          "
          :alt="getValue(article, ['title'])"
        />
        <div class="listArticleBlock__figure--audioControl">
          <img
            v-show="!isPlaying && !isEnded"
            v-lazy="`/assets/mirrormedia/icon/play-btn@2x.png`"
            @click="audioPlay()"
          />
          <img
            v-show="isPlaying && !isEnded"
            v-lazy="`/assets/mirrormedia/icon/pause-btn@2x.png`"
            @click="audioPause()"
          />
          <img
            v-show="isEnded"
            v-lazy="`/assets/mirrormedia/icon/replay-btn@2x.png`"
            @click="audioReplay()"
          />
        </div>
        <div
          class="listArticleBlock__figure--colorBlock"
          :style="{ backgroundColor: sectionColor }"
        >
          Audio
        </div>
      </figure>
      <div class="listArticleBlock__content">
        <h2 v-text="getValue(article, ['title'])" />
        <div class="listArticleBlock__audio">
          <audio
            ref="audio"
            preload="none"
            @ended="audioEnded"
            @timeupdate="getAudioCurrent"
            @loadedmetadata="getAudioDuration"
          >
            <source
              :src="getValue(article, ['audio', 'url'])"
              :type="getValue(article, ['audio', 'filetype'])"
            />
          </audio>
          <div
            v-show="audioDuration !== 0"
            ref="audioProgress"
            class="listArticleBlock__audio--progress"
            @click="changeProgress"
          >
            <div
              class="listArticleBlock__audio--progressCurrent"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p v-show="audioDuration !== 0">
            {{ getAudioTime(audioCurrent) }} / {{ getAudioTime(audioDuration) }}
          </p>
        </div>
      </div>
    </template>
    <template v-else-if="articleType === 'topic'">
      <figure class="listArticleBlock__figure">
        <a
          :href="`/topic/${getValue(article, ['id'])}`"
          target="_blank"
          @click="sendGaClickEvent('listing', 'latest')"
        >
          <LazyImage
            :src="getImage(article, 'mobile')"
            :caption="getValue(article, ['name'])"
          />
        </a>
      </figure>
      <div class="listArticleBlock__content">
        <h2>
          <a
            :href="`/topic/${getValue(article, ['id'])}`"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getValue(article, ['name'])"
          />
        </h2>
        <p>
          <a
            :href="`/topic/${getValue(article, ['id'])}`"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getBrief(article, 45)"
          />
        </p>
      </div>
    </template>
    <template v-else>
      <figure class="listArticleBlock__figure">
        <a
          :href="getHref(article)"
          target="_blank"
          @click="sendGaClickEvent('listing', 'latest')"
        >
          <LazyImage
            :src="getImage(article, 'mobile')"
            :caption="getValue(article, ['title'])"
          />
        </a>
        <div
          class="listArticleBlock__figure--colorBlock"
          :style="{ backgroundColor: sectionColor }"
          v-text="colorBlockTitle"
        />
      </figure>
      <div class="listArticleBlock__content">
        <div
          class="listArticleBlock__content--colorBlock"
          :style="{ backgroundColor: sectionColor }"
          v-text="colorBlockTitle"
        />
        <h2>
          <a
            :href="getHref(article)"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getValue(article, ['title'])"
          />
        </h2>
        <p>
          <a
            :href="getHref(article)"
            target="_blank"
            @click="sendGaClickEvent('listing', 'latest')"
            v-text="getBrief(article, 45)"
          />
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import LazyImage from '../common/LazyImage.vue'
import { SECTION_MAP, MARKETING_CATGORY_ID } from '../../constants'
import {
  getBrief,
  getHref,
  getHrefFull,
  getImage,
  getTruncatedVal,
  getValue,
  sendGaClickEvent,
} from '../../util/comm'
import dayjs from '~/utils/dayjs'

export default {
  components: {
    LazyImage,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    initialArticle: {
      type: Object,
      required: true,
    },
    initialTogglePause: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      audioCurrent: 0,
      audioDuration: 0,
      isEnded: false,
      isPlaying: false,
      progress: 0,
    }
  },
  computed: {
    article() {
      return this.initialArticle
    },
    articleType() {
      if (_.get(this.$route, ['params', 'title']) === 'topic') {
        return 'topic'
      }
      if (this.initialArticle.kind) {
        return 'video'
      }
      if (this.initialArticle.audio && this.initialArticle.audio.url) {
        return 'audio'
      }
      return _.get(this.initialArticle, ['style'], 'article')
    },
    colorBlockTitle() {
      if (
        this.initialArticle.sections &&
        _.get(this.initialArticle, ['sections', 'length'], 0) > 0
      ) {
        return _.get(this.initialArticle, ['sections', '0', 'title'])
      } else {
        const categoriesLen = _.get(this.initialArticle, 'categories.length', 0)
        const categoryFirst = _.get(this.initialArticle, 'categories.0.id')
        return categoryFirst === MARKETING_CATGORY_ID && categoriesLen > 1
          ? _.get(this.initialArticle, 'categories.1.title')
          : _.get(this.initialArticle, 'categories.0.title')
      }
    },
    duration() {
      return _.get(this.$refs, ['audio', 'duration'])
    },
    togglePause() {
      return this.initialTogglePause
    },
    removeHoverEffect() {
      return _.get(this.$route, ['params', 'title']) === 'audio'
    },
    sectionColor() {
      return _.get(
        SECTION_MAP,
        [_.get(this.article, ['sections', '0', 'id']), 'bgcolor'],
        '#bcbcbc'
      )
    },
  },
  watch: {
    togglePause() {
      const audioEle = this.$refs.audio
      if (audioEle && !audioEle.paused && this.index !== this.togglePause) {
        this.isPlaying = false
        audioEle.pause()
      }
    },
  },
  methods: {
    audioEnded() {
      this.isEnded = true
    },
    audioPlay() {
      const audioEle = this.$refs.audio
      if (audioEle) {
        this.isPlaying = !this.isPlaying
        audioEle.play()
        this.$emit('pauseAllAudio', this.index)
      }
    },
    audioPause() {
      const audioEle = this.$refs.audio
      if (audioEle) {
        this.isPlaying = !this.isPlaying
        audioEle.pause()
      }
    },
    audioReplay() {
      const audioEle = this.$refs.audio
      if (audioEle) {
        this.isEnded = false
        this.isPlaying = true
        this.$refs.audio.currentTime = 0
        audioEle.play()
      }
    },
    changeProgress(e) {
      const audioEle = this.$refs.audio
      const newTime =
        (e.offsetX / this.$refs.audioProgress.offsetWidth) *
        this.$refs.audio.duration
      this.$refs.audio.currentTime = newTime
      this.isEnded = false
      this.isPlaying = true
      audioEle.play()
    },
    getBrief,
    getHref,
    getHrefFull,
    getImage,
    getAudioCurrent() {
      this.audioCurrent = this.$refs.audio.currentTime
      this.progress =
        (this.$refs.audio.currentTime / this.$refs.audio.duration) * 100
    },
    getAudioDuration() {
      this.audioDuration = this.$refs.audio.duration
    },
    getAudioTime(duration) {
      return dayjs.utc(duration * 1000).format('HH:mm:ss')
    },
    getTruncatedVal,
    getValue,
    sendGaClickEvent,
  },
}
</script>
<style lang="stylus">

.listArticleBlock
  width 100%
  background-color #fff
  box-shadow 5px 5px 5px #bcbcbc
  transition all .3s ease-in-out
  & + .listArticleBlock
    margin-top 40px
  &__figure
    position relative
    width 100%
    padding-top 66.66%
    margin 0
    overflow hidden
    img
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      object-fit cover
      object-position 50% 50%
      &[lazy=loading]
        object-fit contain
        width 150px
    &--colorBlock
      position absolute
      left 0
      bottom 0
      padding .5em
      color #fff
      letter-spacing 1px
    &--audioControl
      position absolute
      left 50%
      top 50%
      width 60px
      height 60px
      border-radius 50%
      transform translate(-50%, -50%)
      box-shadow 1px 1px 20px #bcbcbc
      cursor pointer
      img
        width 100%
        height 100%
  &__content
    padding 0 30px 15px
    text-align justify
    h2
      margin 0
      padding 0.5em 0
      font-size 1.3rem
      font-weight 300
      text-align justify
      line-height 1.3
    p
      margin 0
      font-size 1rem
      font-weight 300
      text-align justify
      line-height 1.5
      a
        color #999
    &--colorBlock
      display none
  &__audio
    p
      text-align right
    &--progress
      width 100%
      height 3px
      margin-top .5em
      background-color #bcbcbc
      cursor pointer
    &--progressCurrent
      height 3px
      background-color #064f77
@media (min-width: 600px)
  .listArticleBlock
    width calc( (100% - 40px) / 2 )
    margin 0 10px 40px
    & + .listArticleBlock
      margin-top 0
    &:hover
      transform translateY(-20px)
      box-shadow 5px 15px 5px #bcbcbc
    &__content
      height auto
      h2
        min-height 78px
    &.noHoverEffect
      &:hover
        transform none
        box-shadow 5px 5px 5px #bcbcbc
@media (min-width: 1200px)
  .listArticleBlock
    width calc( (100% - 60px) / 3 )
</style>
