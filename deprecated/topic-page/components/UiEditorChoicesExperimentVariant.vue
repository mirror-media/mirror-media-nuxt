<template>
  <div class="editor-choices">
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
            class="swiper-slide"
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
        />
        <img
          slot="btnNext"
          src="~/assets/arrow-next-editor-choices.png"
          :class="slideshow.btnNextClass"
        />
      </UiSlideshow>
    </div>
  </div>
</template>

<script>
import UiSlideshow from '~/components/UiSlideshow.vue'

export default {
  name: 'UiEditorChoices',

  components: {
    UiSlideshow,
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
      slideshow: {
        btnPrevClass: 'btn-prev',
        btnNextClass: 'btn-next',
        paginationClass: 'swiper-pagination',
      },
    }
  },

  mounted() {
    this.initSlideshow()
  },

  methods: {
    initSlideshow() {
      this.$refs.slideshow.$swiper?.init()
      this.stopWatcher?.()

      return true
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-choices {
  &__slideshow {
    display: block;
    position: relative;
    color: #fff;

    $font-size--h1: 32px;
    $line-height--h1: 1.5;

    h2 {
      position: absolute;
      top: 8px;
      left: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 9;
      text-shadow: 1.6px 1.6px 8px #000;
      @include media-breakpoint-up(xl) {
        top: 20px;
        left: 20px;
        font-size: 16px;
      }
    }

    h1 {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      text-align: justify;
      font-weight: normal;
      font-size: 20px;
      line-height: 1.3;
      @include text-truncate(2, $font-size--h1, $line-height--h1);

      @include media-breakpoint-up(xl) {
        bottom: 77px;
        width: 80%;
        font-size: $font-size--h1;
        font-weight: 500;
        line-height: $line-height--h1;
      }
    }
  }
}

.swiper-slide {
  article {
    padding-top: 62.5%;
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
  width: 15px;
  z-index: 9;
  top: 50%;
  transform: translateY(-50%);
  box-sizing: content-box;
  padding: 8px;

  @include media-breakpoint-up(xl) {
    width: 30px;
    padding: 15px;
  }
}

.btn-prev {
  left: 0;
}

.btn-next {
  right: 0;
}

.swiper-pagination {
  display: none;
  @include media-breakpoint-up(xl) {
    display: initial;
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
}
</style>
