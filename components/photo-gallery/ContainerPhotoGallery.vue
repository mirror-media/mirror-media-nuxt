<!-- 
  注意：
  此元件絕大部分是直接從舊專案 plate-vue 搬過來
  未來若要複用，請重構並加上測試
-->
<template>
  <div ref="photos" class="photos">
    <div class="sharebox">
      <a href="/">
        <div class="mm-icon" />
      </a>
      <div class="share-icons">
        <div class="share">
          <SvgShareIcon />
        </div>
        <a :href="sharedFbUrl" target="_blank" rel="noopener noreferrer">
          <SvgFbIcon class="fb" />
        </a>
        <a :href="sharedLineUrl" target="_blank" rel="noopener noreferrer">
          <SvgLineIcon class="line" />
        </a>
      </div>
      <UiDonateButtonCircle v-if="shouldShowDonate" class="donate" />
      <UiBeSubscriberButton v-if="shouldShowDonate" class="subscribe-btn" />
    </div>

    <div
      class="btn-toggle-description"
      :class="switchStatus"
      @click="toggleDesc"
    >
      <div class="hint">開啟／關閉圖說</div>
    </div>

    <div class="go-next-page" :class="goNextPageClass" @click="goNextPage" />

    <div class="progress-wrap progress mobile-only" data-progress-percent="25">
      <div class="progress-bar progress" />
    </div>

    <ClientOnly>
      <div v-if="isViewportWidthUpXl" class="progress-sidebar desktop-only">
        <div class="stick-container">
          <div
            v-for="(o, i) in imgArr"
            :key="`stick-${o.id}`"
            :style="stickBottom(i)"
            class="stick"
            :class="{ passed: stickflag[i] }"
            :index="i"
            @click="goPage"
          />
        </div>
      </div>
    </ClientOnly>

    <div class="leading widthDesc">
      <div class="leading_wrapper" :class="{ hide: leadingWrapperHide }">
        <div class="title">
          <span>
            <h2>{{ title }}</h2>
          </span>
        </div>

        <div class="brief">
          <div :class="captionStyle">
            <div>{{ heroCaption }}</div>
            <span v-for="paragraph in brief" :key="paragraph.id">
              {{ paragraph.content[0] }}
            </span>
          </div>
        </div>

        <div class="img">
          <img
            :src="heroImgSrc"
            :class="landscapeClass"
            :srcset="heroImgSrcset"
          />
        </div>
      </div>
    </div>

    <div class="article_body">
      <div class="pic-wrapper" :class="{ active: picContainerActive }">
        <div class="pic-container">
          <section
            v-for="(o, i) in imgArr"
            :key="`pic-${o.id}-${o.content[0].url}`"
            class="pic-section"
            :class="{ active: i <= 0 }"
          >
            <div class="brief">
              <div :class="captionStyle">
                <span>{{ o.content[0].description }}</span>
              </div>
            </div>

            <div class="img">
              <img
                :src="o.content[0].url"
                :class="landscapeClass"
                :srcset="photoSrcset(o)"
              />
            </div>
          </section>
        </div>
      </div>
    </div>

    <div class="credit-comment" :class="creditCommentClass">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="credit" class="credit" v-html="credit"></div>

      <LazyRenderer v-if="doesHaveAnyRelateds" @load="fetchRelatedImgs">
        <UiArticleList
          class="photos__article-list"
          :items="relateds"
          :itemImgs="relatedImgs"
        />
      </LazyRenderer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import UiArticleList from './UiArticleList.vue'
import UiBeSubscriberButton from '~/components/UiBeSubscriberButton.vue'
import {
  OnePageScroller,
  currentYPosition,
  elmYPosition,
  smoothScroll,
} from '~/deprecated/kc-scroll.js'
import { getClientOS, addClass } from '~/deprecated/comm.js'
import { useShareLine, useShareFb } from '~/composition/share.js'
import { creditHtml } from '~/utils/article.js'

import SvgShareIcon from '~/assets/share.svg?inline'
import SvgFbIcon from '~/assets/fb-logo.svg?inline'
import SvgLineIcon from '~/assets/line-logo.svg?inline'
import UiDonateButtonCircle from '~/components/UiDonateButtonCircle.vue'
export default {
  name: 'ContainerPhotoGallery',

  setup() {
    const sharedLineUrl = useShareLine()
    const sharedFbUrl = useShareFb()

    return {
      sharedLineUrl,
      sharedFbUrl,
    }
  },

  components: {
    UiArticleList,

    SvgShareIcon,
    SvgFbIcon,
    SvgLineIcon,
    UiDonateButtonCircle,
    UiBeSubscriberButton,
  },

  props: {
    story: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },

  data() {
    return {
      relatedImgs: [],

      touchLock: false,
      currIndex: 1,
      currOS: '',
      creditCommentShow: false,
      creditCommentFixed: false,
      descHide: false,
      descSwitch: this.story.isAdvertised ?? false,
      lastAnimation: 0,
      leadingWrapperHide: false,
      isLandscape: false,
      goNextPageHide: false,
      onePageScroll: new OnePageScroller(),
      picContainerActive: false,
      quietPeriod: 700,
      scrollingFlag: false,
      stickflag: [],
      touchDelta: 0,
      touchStartY: 0,
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpMd: 'viewport/isViewportWidthUpMd',
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),

    shouldShowDonate() {
      const slug = this.$route?.params?.slug ?? ''
      if (/^\d{8}(mkt|cnt|prf|corpmkt)/.test(slug)) {
        return false
      }
      return this.$config.donateFeatureToggle
    },

    brief() {
      return this.story.brief?.apiData || []
    },
    captionStyle() {
      return {
        show:
          this.descSwitch || (!this.isViewportWidthUpMd && !this.isLandscape),
        hide: !this.descSwitch,
      }
    },
    contentArr() {
      return this.story.content?.apiData || []
    },
    creditCommentClass() {
      return {
        show: this.creditCommentShow,
        active: this.creditCommentFixed,
      }
    },
    goNextPageClass() {
      return {
        center: !this.isViewportWidthUpMd && !this.isLandscape,
        hidden: this.goNextPageHide,
      }
    },
    heroCaption() {
      return this.story.heroCaption ?? ''
    },
    heroImg() {
      return this.story.heroImage || {}
    },
    heroImgSrc() {
      return this.heroImg.image?.url ?? ''
    },
    heroImgSrcset() {
      const {
        mobile = {},
        tablet = {},
        desktop = {},
      } = this.heroImg.image?.resizedTargets || {}
      return `${mobile.url} 800w, ${tablet.url} 1200w, ${desktop.url} 2000w`
    },
    landscapeClass() {
      return {
        landscape: this.isLandscape,
      }
    },
    imgArr() {
      return this.contentArr.filter(function isImgType(item) {
        return item.type === 'image'
      })
    },

    relateds() {
      return this.story.relateds || []
    },
    doesHaveAnyRelateds() {
      return this.story.relateds.length > 0
    },

    switchStatus() {
      return {
        on: this.descSwitch,
        off: !this.descSwitch,
        hide: !this.isLandscape || this.descHide,
      }
    },
    title() {
      return this.story.title ?? ''
    },
    credit() {
      return creditHtml(this.story)
    },
  },

  mounted() {
    this.updateIsLandscape()
    smoothScroll(null, 0)

    this.currOS = getClientOS()

    Promise.all([
      this.setUpHtmlHeight(),
      this.setUpResizeHandler(),
      this.setUpScrollHandler(),
      this.setUpSelectorPreventor(),
    ])

    if (window === undefined) {
      window.addEventListener('load', () => {
        this.initOnepage()
        this.onePageScroll.doPause()

        if (this.currOS !== 'iOS' && this.currOS !== 'Android') {
          document.addEventListener('mousewheel', this.mouseWheelHandlerN)
        }
        if (this.currOS !== 'iOS' && this.currOS !== 'Android') {
          document.addEventListener('DOMMouseScroll', this.mouseWheelHandlerN)
        }
        if (this.currOS === 'iOS' || this.currOS === 'Android') {
          document.addEventListener('touchstart', this.touchStartHandlerN)
        }
        if (this.currOS === 'iOS' || this.currOS === 'Android') {
          document.addEventListener('touchend', this.touchEndHandlerN)
        }
      })
    } else {
      this.initOnepage()
      this.onePageScroll.doPause()

      if (this.currOS !== 'iOS' && this.currOS !== 'Android') {
        document.addEventListener('mousewheel', this.mouseWheelHandlerN)
      }
      if (this.currOS !== 'iOS' && this.currOS !== 'Android') {
        document.addEventListener('DOMMouseScroll', this.mouseWheelHandlerN)
      }
      if (this.currOS === 'iOS' || this.currOS === 'Android') {
        document.addEventListener('touchstart', this.touchStartHandlerN)
      }
      if (this.currOS === 'iOS' || this.currOS === 'Android') {
        document.addEventListener('touchend', this.touchEndHandlerN)
      }
    }
  },

  methods: {
    async fetchRelatedImgs() {
      const imgIds = this.relateds.map(function extractImgId(item) {
        return item.heroImage
      })
      const { items = [] } = await this.$fetchImages({ id: imgIds })

      this.relatedImgs = items
    },

    goNextPage() {
      const nextPage =
        this.currIndex <= this.imgArr.length
          ? this.currIndex + 1
          : this.currIndex

      if (this.currIndex < this.imgArr.length) {
        this.onePageScroll.moveTo(nextPage)
      } else {
        smoothScroll('.credit-comment')
        this.onePageScroll.pauseToggle()
      }
    },
    goPage(e) {
      const targIndex = Number(e.target.getAttribute('index')) + 1
      let loopCount = this.currIndex

      this.onePageScroll.moveTo(targIndex)
      this.onePageScroll.cancelPause()

      while (loopCount !== targIndex) {
        if (this.currIndex < targIndex) {
          this.sideProgressHandler('pass', loopCount)
          loopCount++
        } else if (this.currIndex > targIndex) {
          this.sideProgressHandler('back', loopCount)
          loopCount--
        }
      }
    },
    initOnepage() {
      this.onePageScroll.init('.pic-wrapper', {
        afterMove: (index) => {
          this.currIndex = parseInt(index)
          this.updateProgressbar(
            ((this.currIndex - 1) * 100) / this.imgArr.length
          )
          if (this.currIndex === this.imgArr.length) {
            this.creditCommentShow = true
          } else {
            this.creditCommentShow = false
          }
        },
        animationTime: 500,
        beforeMove: (index) => {
          smoothScroll('.article_body')

          if (parseInt(index) > this.currIndex) {
            this.sideProgressHandler('pass', parseInt(index) - 1)
          } else {
            this.sideProgressHandler('back', parseInt(index))
          }
        },
        defaultInitialPage: 1,
        easing: 'ease',
        pageContainer: '.pic-section',
        quietPeriod: 550,
      })
    },
    mouseWheelHandlerN(evt) {
      const delta = evt.wheelDelta || -evt.detail

      if (delta < 0) {
        if (this.currIndex === this.imgArr.length) {
          this.picContainerActive = false
          this.onePageScroll.doPause()
        }
      } else if (delta > 0) {
        if (this.currIndex === 1) {
          this.picContainerActive = false
          this.onePageScroll.doPause()
          this.leadingWrapperHide = false
        } else {
          this.leadingWrapperHide = true
        }
      }
    },
    scrollHandler() {
      const deviceHeight = window.innerHeight
      const currTop = currentYPosition()
      const currBtm = currTop + deviceHeight
      const articleBodyTopY = elmYPosition('.article_body')
      const articleBodyBtmY = articleBodyTopY + deviceHeight

      if (
        (articleBodyTopY <= currTop && this.currIndex === 1) ||
        (articleBodyBtmY >= currBtm && this.currIndex === this.imgArr.length)
      ) {
        this.picContainerActive = true
        this.touchLock = true

        if (this.onePageScroll.pauseFlag) {
          setTimeout(() => {
            this.onePageScroll.cancelPause()
          }, 1000)
        }
      } else {
        this.touchLock = false
        this.picContainerActive = false
      }
    },
    setUpHtmlHeight() {
      return new Promise((resolve) => {
        if (process.browser) {
          addClass(document.body, 'limited-height')
          addClass(document.documentElement, 'limited-height')
        }

        resolve()
      })
    },
    setUpScrollHandler() {
      return new Promise((resolve) => {
        window.removeEventListener('scroll', this.scrollHandler)
        window.addEventListener('scroll', this.scrollHandler)

        resolve()
      })
    },
    setUpSelectorPreventor() {
      return new Promise(() => {
        this.$refs.photos.ondragstart = () => false
        this.$refs.photos.onselectstart = () => false
      })
    },
    setUpResizeHandler() {
      return new Promise((resolve) => {
        window.removeEventListener('resize', this.updateIsLandscape)
        window.addEventListener('resize', this.updateIsLandscape)

        resolve()
      })
    },
    sideProgressHandler(action, index) {
      return new Promise(() => {
        const _targContainer = document.querySelector('.stick-container')

        if (!_targContainer) {
          return
        }

        const _targElement = _targContainer.querySelector(
          `.stick:nth-child(${index})`
        )

        if (!_targElement) {
          return
        }

        switch (action) {
          case 'pass':
            _targElement.setAttribute(
              'style',
              `bottom: ${_targContainer.offsetHeight - index * 7}px;`
            )
            break
          case 'back':
            _targElement.setAttribute(
              'style',
              `bottom: ${(this.imgArr.length - index + 1) * 7}px;`
            )
            break
        }
      })
    },
    stickBottom(index) {
      return {
        bottom: `${(this.imgArr.length - index) * 7}px`,
      }
    },
    toggleDesc() {
      this.descSwitch = !this.descSwitch
      this.descShowDefault = false
    },
    touchEndHandlerN(event) {
      document.removeEventListener('touchmove', this.touchMoveHandlerN)

      const deltaY = event.pageY - this.touchStartY

      if (deltaY >= 50) {
        if (this.currIndex === 1) {
          this.picContainerActive = false
          this.onePageScroll.doPause()
          this.touchLock = false
          this.leadingWrapperHide = false
        } else {
          this.leadingWrapperHide = true
        }
      } else if (deltaY <= -50) {
        if (this.currIndex === this.imgArr.length) {
          this.picContainerActive = false
          this.onePageScroll.doPause()
          this.touchLock = false
          this.leadingWrapperHide = true
        }
      }
    },
    touchStartHandlerN(event) {
      const { target, touches } = event

      if (touches && touches.length) {
        this.touchStartY = touches[0].pageY

        document.addEventListener('touchmove', this.touchMoveHandlerN)

        if (this.touchLock) {
          const targClass = target.getAttribute('class') || ''

          if (
            !targClass.includes('go-next-page') &&
            !targClass.includes('mm-icon') &&
            !targClass.includes('icon line') &&
            !targClass.includes('icon facebook') &&
            !targClass.includes('btn-toggle-description')
          ) {
            return event.preventDefault()
          }
        }
      }
    },
    touchMoveHandlerN(event) {
      return event.preventDefault()
    },
    updateProgressbar(percentage) {
      return new Promise(() => {
        document
          .querySelector('.progress-bar')
          .setAttribute('style', `left: ${percentage}%;`)
      })
    },
    updateIsLandscape() {
      this.isLandscape =
        process.browser && window.innerHeight < window.innerWidth
    },
    photoSrcset(img = {}) {
      const { mobile = {}, tablet = {}, desktop = {} } = img.content?.[0] || {}

      return `${mobile.url} 800w, ${tablet.url} 1200w, ${desktop.url} 2000w`
    },
  },
}
</script>

<style lang="scss">
html,
body {
  &.limited-height {
    height: 100%;
    background-color: #000;
  }
}
</style>

<style lang="scss" scoped>
.photos {
  user-select: none;
  -webkit-touch-callout: none;
  overflow: hidden;

  &__article-list {
    max-width: 900px;
    padding-left: 20px;
    padding-right: 20px;
    @include media-breakpoint-up(md) {
      margin: 40px auto;
    }
    @include media-breakpoint-up(lg) {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.leading {
  height: 180vh;

  &_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;

    &.hide {
      opacity: 0;
    }

    .title {
      position: relative;

      span {
        position: absolute;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        padding-top: 10%;
        z-index: 10;
        background-image: linear-gradient(0deg, transparent, rgba(#000, 0.5));

        h2 {
          font-size: 2.5rem;
          color: #fff;
          text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
          line-height: 1.15;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
      }
    }

    .brief > div {
      position: absolute;
      z-index: 10;
      width: 100vw;
      padding: 2em 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      background-image: linear-gradient(180deg, transparent, rgba(#000, 0.7));
      bottom: 0;

      div {
        margin-bottom: 20px;
        color: #d1d1d1;
        text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
      }

      span {
        width: 70%;
        color: #fff;
        text-align: center;
        word-break: break-all;
        line-height: 20px;
        text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
        font-size: 16px;

        + span {
          margin-top: 1em;
        }
      }

      &.hide {
        display: none;
      }

      &.show {
        display: flex;
      }
    }
  }
}

.sharebox {
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  z-index: 99;
  display: flex;

  .subscribe-btn {
    padding: 8px 12px;
    height: 40px;
    margin-top: 4px;
    margin-left: 8px;
  }

  .mm-icon {
    width: 48px;
    height: 48px;
    background-image: url(~assets/logo@2x.png);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  .share-icons {
    display: flex;
    margin-left: 10px;

    svg {
      width: 100%;
      height: auto;
    }

    a,
    .share {
      width: 48px;
      border-radius: 50%;
      border: 1px solid #fff;
      transition: all 0.1s ease-out;
      cursor: pointer;

      &:hover {
        box-shadow: 0 4px 8px rgba(#000, 0.7);
      }
    }

    > a {
      width: 0;
      opacity: 0;

      .fb {
        transition-delay: 20ms;
      }

      .line {
        transition-delay: 40ms;
      }
    }

    .share {
      height: 48px;
      background-color: #2068b2;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 26px;
      }
    }

    &:hover > a {
      width: 48px;
      opacity: 1;
      margin-left: 10px;
    }
  }
}
.donate {
  margin-left: 10px;
}
.btn-toggle-description {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 5px;
  bottom: 20px;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  left: 20px;
  height: 40px;
  width: 40px;
  position: fixed;
  transition: all 0.1s;
  z-index: 23;

  &.on {
    background-image: url(~assets/caption-on.png);
    opacity: 0.65;
  }

  &.off {
    background-image: url(~assets/caption-off.png);
  }

  &.hide {
    display: none;
  }

  &:hover {
    background-image: url(~assets/caption-on.png);
    opacity: 1;

    .hint {
      display: block;
    }
  }

  .hint {
    font-size: 1rem;
    width: 150px;
    position: absolute;
    top: -22px;
    left: 5px;
    color: rgba(#fff, 0.8);
    cursor: auto;
    display: none;
  }
}

.progress {
  width: 100%;
  height: 10px;
}

.progress-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background: #5b7d9e;
  overflow: hidden;
  z-index: 100;

  .progress-bar {
    background: rgba(#000, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    transition: left 1s;
  }
}

.progress-sidebar {
  position: fixed;
  right: 10px;
  bottom: 60px;
  height: 80vh;
  width: 35px;
  z-index: 99;

  .stick-container {
    position: relative;
    width: 100%;
    height: 100%;

    .stick {
      border-top: 3px solid rgba(#fff, 0.5);
      width: 100%;
      transform: rotate(25deg);
      margin: 10px auto;
      position: absolute;
      transition: bottom 0.5s;
      cursor: pointer;

      &:hover {
        border-top: 3px solid rgba(#fff, 1);
      }
    }
  }
}

.credit-comment {
  width: 100vw;
  position: relative;
  padding: 5% 0;
  background-color: #333333;
  overflow: auto;
  height: auto;
  display: none;
  z-index: 21;

  .credit {
    color: #fff;
    max-width: 900px;
    display: flex;
    height: 100px;
    vertical-align: top;
    margin: 40px auto;
    align-items: center;
    position: relative;
    text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
    justify-content: flex-start;
    padding-right: 20px;
    padding-left: 20px;
    @include media-breakpoint-up(lg) {
      padding-left: 0;
      padding-right: 0;
    }

    a,
    a:hover,
    a:link,
    a:visited {
      color: #fff;
    }
  }

  &.show {
    display: block;
  }

  &.active {
    position: fixed;
    top: 0;
    left: 0;
  }
}

.go-next-page {
  position: fixed;
  width: 35px;
  height: 35px;
  bottom: 20px;
  background-color: rgba(218, 218, 218, 0.37);
  background-image: url(~assets/arrow-down.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  border-radius: 10px;
  z-index: 23;
  cursor: pointer;
  transition: all 0.1s;
  right: 10px;

  &:hover {
    background-color: rgba(240, 240, 240, 0.8);
    text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
  }

  &.hidden {
    display: none;
  }
}

.article_body {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  > .pic-wrapper {
    width: 100vw;
    height: 100vh;

    &.active {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 22;
    }

    > .pic-container {
      &.active {
        position: fixed;
        top: 0;
        left: 0;
      }

      > .pic-section {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
        background-color: #000;

        .img img {
          object-fit: contain;
          max-height: 100%;
          position: absolute;
          z-index: 0;
          height: 100vh;
          width: 100vw;
        }
      }
    }
  }

  .brief {
    > div {
      position: absolute;
      z-index: 10;
      height: 20vh;
      width: 100vw;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      background-image: linear-gradient(180deg, transparent, rgba(#000, 0.7));
      bottom: 0;

      div {
        margin-bottom: 20px;
        color: #d1d1d1;
        text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
      }

      span {
        width: 70%;
        color: #fff;
        text-align: left;
        word-break: break-all;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0;
        line-height: 20px;
        text-shadow: 0.9px 0.5px 0 rgba(#000, 0.8);
        font-size: 16px;
      }

      &.hide {
        display: none;
      }

      &.show {
        display: flex;
      }
    }
  }
}

@media (min-width: 768px) {
  .mobile-only {
    display: none !important;
  }
}

@media screen and (-webkit-min-device-pixel-ratio: 0) and (max-width: 767px) and (orientation: landscape) {
  .go-next-page {
    bottom: auto;
    top: 23px;
  }

  .btn-toggle-description {
    bottom: auto;
    left: auto;
    top: 20px;
    right: 55px;

    .hint {
      top: 45px;
      left: auto;
    }
  }
}

@media (max-width: 767px) {
  .leading {
    &.widthDesc {
      background-image: linear-gradient(180deg, transparent, rgba(#000, 0.7));
    }

    &_wrapper {
      .title span {
        text-align: center;
        padding: 80px 20px 0;
        margin-bottom: 0 !important;
        position: relative;
        height: auto;
        width: 100%;
        display: inline-block;
      }

      .img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        img:not(.landscape) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #696969;
        }
      }

      .brief {
        position: relative;

        > div {
          height: auto;
          background-image: none;
          position: relative;

          span {
            width: 80%;

            &:not(:nth-child(2)) {
              display: none;
            }
          }
        }
      }
    }
  }

  .go-next-page.center {
    left: 50%;
    margin-left: -20px;
    height: 40px;
    width: 40px;
  }

  .credit-comment .credit {
    width: 100%;
    display: block;
  }

  .article_body > .pic-wrapper {
    padding: 0 !important;

    > .pic-container > .pic-section {
      .img img:not(.landscape) {
        object-fit: contain;
        object-position: 0 20%;
        background-color: #696969;
      }

      .brief > div {
        height: 40vh;
      }
    }
  }
}
</style>
