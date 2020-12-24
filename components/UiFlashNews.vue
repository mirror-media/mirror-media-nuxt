<template>
  <div class="flash-news">
    <h2>快訊</h2>

    <div class="container">
      <div
        class="titles"
        :class="{ transitioning: shouldTransition }"
        :style="{ transform: `translateY(${move * 100}%)` }"
        @transitionend="handleTransitionend"
        @webkitTransitionEnd="handleTransitionend"
        @oTransitionEnd="handleTransitionend"
      >
        <a
          v-for="article in displayedArticles"
          :key="article.slug"
          class="truncate-text-one-line"
          :href="article.href"
          target="_blank"
          rel="noopener noreferrer"
          @click="$emit('sendGa:article')"
          >{{ article.title }}</a
        >
      </div>

      <div class="arrows">
        <span class="next" @click="handleClickNext" />
        <span class="prev" @click="handleClickPrev" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiFlashNews',

  props: {
    articles: {
      type: Array,
      default: () => [],
      required: true,
      validator: (values) => values.length >= 3,
    },
  },

  data() {
    return {
      currentIdx: 0,
      move: -1,
      shouldTransition: false,
      timeoutIdOfAuto: undefined,
    }
  },

  computed: {
    displayedArticles() {
      const len = this.articles.length

      // 處理 currentIdx 為負數的情況
      const curIdxPositive = (this.currentIdx % len) + len

      /**
       * 當 articles 小於 3 篇時會出問題（duplicate keys），但因為快訊不太可能小於 3 篇
       * 因此目前不處理小於 3 篇的情況，未來有需求再做
       */
      return [
        this.articles[(curIdxPositive - 1) % len],
        this.articles[curIdxPositive % len],
        this.articles[(curIdxPositive + 1) % len],
      ]
    },
  },

  mounted() {
    this.autoToNext()
  },

  methods: {
    handleClickNext() {
      this.toNext()
      this.$emit('sendGa:next')
    },
    toNext() {
      if (this.shouldTransition) {
        return
      }

      this.cancelAutoToNext()
      this.shouldTransition = true
      this.move -= 1
    },
    handleClickPrev() {
      this.toPrev()
      this.$emit('sendGa:prev')
    },
    toPrev() {
      if (this.shouldTransition) {
        return
      }

      this.cancelAutoToNext()
      this.shouldTransition = true
      this.move += 1
    },
    handleTransitionend() {
      this.shouldTransition = false

      switch (this.move) {
        case -2: // next
          this.move = -1
          this.currentIdx += 1
          break
        case 0: // prev
          this.move = -1
          this.currentIdx -= 1
          break
      }

      this.autoToNext()
    },
    autoToNext() {
      this.timeoutIdOfAuto = setTimeout(() => {
        this.toNext()
      }, 3000)
    },
    cancelAutoToNext() {
      clearTimeout(this.timeoutIdOfAuto)
    },
  },
}
</script>

<style lang="scss" scoped>
.flash-news {
  display: flex;
  overflow: hidden;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  @include media-breakpoint-up(md) {
    height: 54px;
    line-height: 54px;
    font-size: 20px;
  }
}

$h2--width: 52px;
$h2--margin-right: 4px;
$h2--width--md: 92px;
$h2--margin-right--md: 8px;

h2 {
  background-color: #e51731;
  color: #fff;
  border-radius: 2px;
  text-align: center;
  font-weight: 600;
  width: $h2--width;
  margin-right: $h2--margin-right;
  @include media-breakpoint-up(md) {
    width: $h2--width--md;
    margin-right: $h2--margin-right--md;
  }
}

.container {
  background-color: #eee;
  border-radius: 2px;
  display: flex;
  width: calc(100% - #{$h2--width + $h2--margin-right});
  padding-right: 6px;
  @include media-breakpoint-up(md) {
    width: calc(100% - #{$h2--width--md + $h2--margin-right--md});
    padding-right: 14px;
  }
}

$width--arrows: 52px;
$width--arrows--md: 70px;

.titles {
  width: calc(100% - #{$width--arrows});
  padding-right: 10px;
  padding-left: 10px;
  @include media-breakpoint-up(md) {
    padding-right: 20px;
    padding-left: 20px;
    width: calc(100% - #{$width--arrows--md});
  }

  &.transitioning {
    transition: transform 0.3s ease-in-out;
  }
}

a {
  display: block;
  color: #e51731;
  font-weight: 500;
}

.arrows {
  width: $width--arrows;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  @include media-breakpoint-up(md) {
    width: $width--arrows--md;
  }
}

.arrows span {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @include media-breakpoint-up(md) {
    width: 30px;
    height: 30px;
  }

  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }

  $width--arrow: 10px;
  $height--arrow: 5px;
  $width-half--arrow: $width--arrow / 2;

  $width--arrow--md: 13px;
  $height--arrow--md: 6px;
  $width-half--arrow--md: $width--arrow--md / 2;

  &.next::before {
    border-width: 0 $width-half--arrow $height--arrow $width-half--arrow;
    border-color: transparent transparent #4a4a4a transparent;
    @include media-breakpoint-up(md) {
      border-width: 0 $width-half--arrow--md $height--arrow--md
        $width-half--arrow--md;
    }
  }

  &.prev::before {
    border-width: $height--arrow $width-half--arrow 0 $width-half--arrow;
    border-color: #4a4a4a transparent transparent transparent;
    @include media-breakpoint-up(md) {
      border-width: $height--arrow--md $width-half--arrow--md 0
        $width-half--arrow--md;
    }
  }
}
</style>
