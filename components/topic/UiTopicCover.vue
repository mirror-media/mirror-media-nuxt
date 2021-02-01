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

            <div slot="btnPrev" :class="slideshow.btnPrevClass">
              <SvgArrowPrev class="arrow" />
            </div>
            <div slot="btnNext" :class="slideshow.btnNextClass">
              <SvgArrowNext class="arrow" />
            </div>

            <div slot="pagination" :class="slideshow.paginationClass" />
          </UiSlideshow>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiSlideshow from '~/components/UiSlideshow.vue'

import SvgArrowPrev from '~/assets/arrow-prev-slideshow.svg?inline'
import SvgArrowNext from '~/assets/arrow-next-slideshow.svg?inline'

export default {
  name: 'UiTheCover',

  components: {
    UiSlideshow,

    SvgArrowPrev,
    SvgArrowNext,
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

      .btn-prev,
      .btn-next {
        width: 30px;
        height: 40px;
        background-color: rgba(245, 245, 245, 0.25);
        border-radius: 4px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;

        &:hover {
          background-color: #084f77;

          .arrow {
            fill: #fff;
          }
        }
      }

      .btn-prev {
        left: 5px;

        .arrow {
          transform: translateX(-1px);
        }
      }

      .btn-next {
        right: 5px;

        .arrow {
          transform: translateX(1px);
        }
      }

      .arrow {
        width: 15px;
        height: auto;
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
