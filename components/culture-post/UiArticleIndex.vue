<template>
  <section class="index" :class="{ active: isIndexActive }">
    <button class="index__btn open" @click="$emit('openIndex')">
      <!-- TODO: inline svg -->
      <img src="~/assets/hamburger.svg" alt="開啟" />
    </button>

    <div class="index__curtain">
      <div ref="indexContainer" class="index-container">
        <button class="index__btn close" @click="$emit('closeIndex')">
          <!-- TODO: inline svg -->
          <img src="~/assets/close-1.svg" alt="關閉" />
        </button>

        <div v-if="items.length > 0" class="index-list">
          <ul>
            <li
              v-for="(item, index) in items"
              :key="item.id"
              :class="{ active: currentIndex === index + 1 }"
            >
              <!-- eslint-disable vue/no-v-html -->
              <a
                :href="`#header-${item.id}`"
                data-scroll
                @click="$emit('closeIndex')"
                v-html="item.content"
              />
              <!-- eslint-enable vue/no-v-html -->
            </li>
          </ul>
        </div>

        <div class="share">
          <p>分享到：</p>
          <UiShareFb />
          <UiShareLine />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'

export default {
  name: 'UiArticleIndex',

  components: {
    UiShareFb,
    UiShareLine,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
    currentIndex: {
      type: Number,
      default: 0,
      required: true,
    },
    isIndexActive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      smoothScroll: undefined,
    }
  },

  watch: {
    isIndexActive(isActive) {
      isActive
        ? disableBodyScroll(this.$refs.indexContainer)
        : enableBodyScroll(this.$refs.indexContainer)
    },
  },

  mounted() {
    this.enableSmoothScroll()
  },

  beforeDestroy() {
    this.disableSmoothScroll()
  },

  methods: {
    async enableSmoothScroll() {
      const htmlElem = document.documentElement

      htmlElem.style.scrollBehavior = 'smooth'

      if (!('scrollBehavior' in htmlElem.style)) {
        const { default: SmoothScroll } = await import('smooth-scroll')

        this.smoothScroll = new SmoothScroll('a[href*="#"]')
      }
    },
    disableSmoothScroll() {
      const htmlElem = document.documentElement

      htmlElem.style.scrollBehavior = ''

      if (!('scrollBehavior' in htmlElem.style) && this.smoothScroll) {
        this.smoothScroll.destroy()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.index {
  @include media-breakpoint-up(xl) {
    position: sticky;
  }

  &.active .index__curtain {
    display: block;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 10px;
    right: 10px;
    width: 44px;
    height: 44px;
    background-color: #191919;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    outline: none;
    @include media-breakpoint-up(xl) {
      display: none;
    }

    &.open {
      position: fixed;
      z-index: 500;
    }

    &.close {
      position: absolute;
    }
  }

  &__curtain {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 510;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.8);
    @include media-breakpoint-up(xl) {
      display: inline-block;
      top: 50%;
      left: calc((100% - 634px) / 4);
      right: auto;
      bottom: auto;
      transform: translate(-50%, -50%);
      background-color: transparent;
      width: auto;
      height: auto;
    }
  }

  &-container {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    height: 100%;
    padding: 0 12px;
    background-color: #fff;
    @include media-breakpoint-up(xl) {
      position: static;
      padding: 0;
      background-color: transparent;
    }
  }
}

.index-list {
  display: inline-block;

  + * {
    margin-top: 48px;
  }

  ul {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    width: 190px;
    margin: 0;
    padding: 0;
    @include media-breakpoint-up(xl) {
      width: 240px;
    }

    li {
      display: inline;
      font-family: source-han-serif-tc, 'Songti TC', serif;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;

      &.active a {
        border-bottom: solid 2px #dec5a2;
      }

      + li {
        margin-top: 19px;
      }
    }
  }
}

.share {
  display: flex;
  align-items: center;
  font-size: 15px;

  p + a {
    margin-left: 18px;
  }

  a {
    width: 36px;

    + a {
      margin-left: 17px;
    }
  }
}
</style>
