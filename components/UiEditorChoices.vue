<template>
  <div class="editor-choices">
    <ul class="editor-choices__article-list">
      <li v-for="article in articles" :key="article.slug">
        <a
          :href="article.href"
          target="_blank"
          rel="noopener noreferrer"
          @click="$emit('sendGa')"
        >
          <article>
            <img :src="article.imgSrcMobile" alt="" />
            <div class="text-wrapper">
              <div class="label" :class="article.sectionName">
                {{ article.label }}
              </div>
              <h1>
                <span>{{ article.title }}</span>
              </h1>
            </div>
          </article>
        </a>
      </li>
    </ul>

    <UiArticleListAside
      class="editor-choices__article-list-aside"
      :items="articles"
      :isStyleAdjusted="false"
      @sendGa="$emit('sendGa')"
    />

    <div class="editor-choices__slideshow">
      <h2>編輯精選</h2>
      <UiSlideshow
        ref="slideshow"
        :options="{
          // Disable initializing slideshow automatically for performance
          init: false,

          navigation: {
            prevEl: `.${slideshow.btnPrevClass}`,
            nextEl: `.${slideshow.btnNextClass}`,
          },
          pagination: {
            el: `.${slideshow.paginationClass}`,
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
        }"
      >
        <template slot="default">
          <a
            v-for="article in articles"
            :key="article.slug"
            class="swiper-slide GTM-editorchoice-list"
            :href="article.href"
            target="_blank"
            rel="noopener noreferrer"
            @click="$emit('sendGa')"
          >
            <article>
              <img :src="article.imgSrc" alt="" />
              <div class="mask" />
              <h1>{{ article.title }}</h1>
            </article>
          </a>
        </template>

        <div slot="pagination" :class="slideshow.paginationClass" />

        <img
          slot="btnPrev"
          src="~/assets/arrow-prev-editor-choices.png"
          :class="slideshow.btnPrevClass"
          class="swiper-button"
        />
        <img
          slot="btnNext"
          src="~/assets/arrow-next-editor-choices.png"
          :class="slideshow.btnNextClass"
          class="swiper-button"
        />
      </UiSlideshow>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import UiSlideshow from '~/components/UiSlideshow.vue'
import UiArticleListAside from '~/components/UiArticleListAside.vue'

export default {
  name: 'UiEditorChoices',

  components: {
    UiSlideshow,
    UiArticleListAside,
  },

  props: {
    articles: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  data() {
    return {
      stopWatcher: undefined,
      slideshow: {
        btnPrevClass: 'btn-prev',
        btnNextClass: 'btn-next',
        paginationClass: 'swiper-pagination',
      },
    }
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
  },

  mounted() {
    this.addWatcherToInitSlideshow()
  },

  methods: {
    addWatcherToInitSlideshow() {
      if (this.initSlideshow()) {
        return
      }

      this.stopWatcher = this.$watch('isDesktopWidth', this.initSlideshow)
    },
    initSlideshow() {
      if (this.isDesktopWidth) {
        this.$refs.slideshow.$swiper?.init()
        this.stopWatcher?.()

        return true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-choices {
  &__article-list-aside,
  &__slideshow {
    display: none;
  }

  &__article-list {
    color: #fff;
    @include media-breakpoint-up(sm) {
      display: none;
    }

    li {
      border-bottom: 1px solid #fff;
    }

    article {
      position: relative;
      padding-top: 56.25%;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -9;
    }

    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
    }

    .label {
      display: inline-block;
      padding: 8px;
      background-color: #bcbcbc;
      font-size: 16px;
      line-height: 1;
      @each $name, $color in $sections-color {
        &.#{$name} {
          background-color: $color;
        }
      }
    }

    $font-size--h1: 20px;
    $line-height--h1: 1.28;

    h1 {
      text-shadow: 1.4px 1.4px 1.9px rgba(#000, 0.2);
      background-color: rgba(#000, 0.7);
      padding: 10px;
      font-size: 20px;
      line-height: 1.28;

      span {
        @include text-truncate(2, $font-size--h1, $line-height--h1);
      }
    }
  }

  &__article-list-aside {
    @include media-breakpoint-up(sm) {
      display: block;
    }
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }

  &__slideshow {
    @include media-breakpoint-up(xl) {
      display: block;
      position: relative;
      color: #fff;
    }

    $font-size--h1: 32px;
    $line-height--h1: 1.5;

    h2 {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 16px;
      font-weight: 500;
      z-index: 9;
      text-shadow: 1.6px 1.6px 8px #000;
    }

    h1 {
      position: absolute;
      bottom: 77px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      text-align: justify;
      font-weight: 500;
      font-size: $font-size--h1;
      line-height: $line-height--h1;
      @include text-truncate(2, $font-size--h1, $line-height--h1);
    }
  }
}

.swiper-slide {
  article {
    padding-top: 56.25%;
    position: relative;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.mask {
  position: absolute;
  width: 100%;
  height: 60%;
  left: 0;
  bottom: 0;
  background-image: linear-gradient(transparent, #000);
}

.btn-prev,
.btn-next {
  position: absolute;
  width: 30px;
  z-index: 9;
  top: 50%;
  transform: translateY(-50%);
  box-sizing: content-box;
  padding: 15px;
}

.btn-prev {
  left: 0;
}

.btn-next {
  right: 0;
}

.swiper-pagination {
  line-height: 1.15;

  &::v-deep {
    .swiper-pagination-bullet {
      background-color: #b5b5b5;
      opacity: 1;
      margin-left: 5px;
      margin-right: 5px;

      &-active {
        background-color: #fff;
      }
    }
  }
}
</style>
