<template>
  <div class="topic-cover topic">
    <div class="title topic-title" />

    <div class="leading">
      <div class="leading__container">
        <div
          v-if="type === 'slideshow'"
          class="leading__display leading__display--slideshow"
          data-testid="slideshow"
        >
          <UiSlideshow
            :options="{
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
            <template v-for="item in imgItems" slot="default">
              <a
                v-if="item.href"
                :key="item.id"
                :href="item.href"
                target="_blank"
                class="swiper-slide"
                rel="noopener noreferrer"
              >
                <picture :key="item.id">
                  <source
                    media="(min-width: 1200px)"
                    :srcset="item.srcs.desktop"
                  />
                  <source
                    media="(min-width: 768px)"
                    :srcset="item.srcs.tablet"
                  />
                  <img :src="item.srcs.mobile" :alt="item.alt" />
                </picture>
              </a>

              <picture v-else :key="item.id" class="swiper-slide">
                <source
                  media="(min-width: 1200px)"
                  :srcset="item.srcs.desktop"
                />
                <source media="(min-width: 768px)" :srcset="item.srcs.tablet" />
                <img :src="item.srcs.mobile" :alt="item.alt" />
              </picture>
            </template>

            <UiSlideshowButtonPrev
              slot="btnPrev"
              :class="slideshow.btnPrevClass"
            />
            <UiSlideshowButtonNext
              slot="btnNext"
              :class="slideshow.btnNextClass"
            />

            <div slot="pagination" :class="slideshow.paginationClass" />
          </UiSlideshow>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiSlideshow from '~/components/UiSlideshow.vue'
import UiSlideshowButtonPrev from '~/components/slideshow/UiSlideshowButtonPrev.vue'
import UiSlideshowButtonNext from '~/components/slideshow/UiSlideshowButtonNext.vue'

export default {
  name: 'UiTheCover',

  components: {
    UiSlideshow,
    UiSlideshowButtonPrev,
    UiSlideshowButtonNext,
  },

  props: {
    type: {
      type: String,
      required: true,
      default: undefined,
    },
    imgItems: {
      type: Array,
      required: true,
      default: () => [],
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
}
</script>

<style lang="scss" scoped>
.topic-cover {
  position: relative;
  width: 100%;
  padding-top: 66.66%;
  background-color: rgba(135, 156, 169, 0.15);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media (min-width: 900px) {
    height: 600px;
    padding-top: 0;
  }
}

.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  @media (min-width: 900px) {
    height: 200px;
    width: 400px;
    background-size: contain;
    background-position: center;
  }
}

.leading {
  margin: 0 auto;
  @include media-breakpoint-up(sm) {
    width: 90%;
  }
  @include media-breakpoint-up(md) {
    width: 70%;
  }
  @include media-breakpoint-up(lg) {
    width: 60%;
  }
  @include media-breakpoint-up(xl) {
    width: 50%;
  }

  &__container {
    position: relative;
    padding-top: 56.25%;
  }

  &__display {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &--slideshow {
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .swiper-pagination {
        line-height: 1.15;
      }

      &::v-deep {
        .swiper-container {
          height: 100%;
        }

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
}
</style>
