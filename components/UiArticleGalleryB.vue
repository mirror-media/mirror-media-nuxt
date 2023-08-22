<template>
  <div class="article-gallery">
    <ul>
      <template v-for="(item, index) in items">
        <li v-if="!item.isMicroAd" :key="item.id">
          <a
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="GTM-homepage-latest-list"
            @click="$emit('sendGa')"
          >
            <article>
              <div class="img-wrapper">
                <img
                  v-if="index < 20"
                  :src="item.imgSrc || require('~/assets/default-og-img.png')"
                  alt=""
                />
                <img v-else v-lazy="item.imgSrc" alt="" />
              </div>

              <div
                class="label label--sm"
                :class="item.sectionName"
                :style="{ backgroundColor: !item.label && 'transparent' }"
              >
                {{ item.label }}
              </div>

              <div class="text-wrapper">
                <h1>
                  <span>{{ item.title }}</span>
                </h1>
                <p class="description">{{ item.description }}222</p>
              </div>
            </article>
          </a>
        </li>

        <MicroAd
          v-else-if="item.isMicroAd && !isPremiumMember"
          :key="microAdUnits[item.idx].name"
          :unitId="microAdUnits[item.idx].id"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import MicroAd from '~/components/MicroAd.vue'

import { MICRO_AD_UNITS } from '~/constants/ads.js'

export default {
  name: 'UiArticleGallery',

  components: {
    MicroAd,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    isPremiumMember: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },
    microAdUnits() {
      return MICRO_AD_UNITS.HOME[this.device]
    },
  },
}
</script>

<style lang="scss" scoped>
$font-size--base: 16px;
$font-size--base--xl: 16px;

.article-gallery {
  color: #8c8c8c;
  font-size: $font-size--base;
  @include media-breakpoint-up(xl) {
    font-size: $font-size--base--xl;
  }
}

ul {
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
  }
}

$padding-x--li: 15px;

li,
.micro-ad {
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(#000, 0.28);
  @include media-breakpoint-up(sm) {
    border-bottom: none;
  }
  @include media-breakpoint-up(xl) {
    width: calc((100% - #{$padding-x--li * 2}) / 3);
    padding-top: 0;
    padding-bottom: 0;
    margin-right: $padding-x--li;
    margin-bottom: 15px;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  &:last-child {
    border-bottom: none;
  }
}

article,
.micro-ad {
  position: relative;
  display: flex;
  align-items: center;
  @include media-breakpoint-up(xl) {
    align-items: flex-start;
    position: relative;
    flex-direction: column;
  }
}

$width--img-wrapper: 46.53%;
$aspect-ratio: 1;
$width--img-wrapper--sm: 34.18%;
$aspect-ratio--sm: 1.67;

.img-wrapper,
.micro-ad::v-deep > a {
  flex-shrink: 0;
  width: $width--img-wrapper;
  position: relative;
  @include media-breakpoint-up(sm) {
    width: $width--img-wrapper--sm;
  }
}

.img-wrapper {
  padding-top: math.div($width--img-wrapper, $aspect-ratio);
  margin-right: 20px;

  @include media-breakpoint-up(sm) {
    padding-top: math.div($width--img-wrapper--sm, $aspect-ratio--sm);
    margin-right: 0;
  }
  @include media-breakpoint-up(xl) {
    width: 100%;
    padding-top: 66.7%;
    z-index: -1;
  }
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.label,
.micro-ad::v-deep .latest-list_item_label {
  padding: 8px;
  // padding: 4px 10px;
  // background-color: #bcbcbc;
  color: #4a4a4a;
}

.micro-ad::v-deep .latest-list_item_label {
  display: inline-block;
  margin-bottom: 19.2px;
  @include media-breakpoint-up(xl) {
    padding: 8px;
    margin-bottom: 0;
    font-weight: 300;
  }
}

.label--sm,
.micro-ad::v-deep .latest-list_item_label {
  @include media-breakpoint-up(sm) {
    justify-content: center;
    align-items: center;
    // min-height: 60px;
    flex-shrink: 0;
    margin-right: 20px;
    line-height: 1.15;
  }
}

.label {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  @each $name, $color in $sections-color {
    &.#{$name} {
      background-color: $color;
    }
  }

  // &--xs {
  //   @include media-breakpoint-up(sm) {
  //     // display: none;
  //   }
  //   @include media-breakpoint-up(xl) {
  //     display: inline-block;
  //     line-height: 1;
  //   }
  // }

  &--sm {
    // display: none;
    z-index: 10;
    font-size: 14px;
    padding: 4px;
    @include media-breakpoint-up(sm) {
      display: flex;
      font-size: 16px;
      padding: 8px;
      // width: 60px;
    }
    @include media-breakpoint-up(xl) {
      // display: none;
    }
  }
}

.text-wrapper {
  margin: 8px 12px 8px 20px;
  @include media-breakpoint-up(xl) {
    margin: 0;
    // position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}

$line-height--title: 1.41;
$line-height--title--sm: 1.3;
$line-height--title--xl: 1.69;
$font-size--title--sm: 20.8px;
$font-size--title--xl: 16px;

h1,
.micro-ad::v-deep h3 {
  font-weight: 300;
  line-height: $line-height--title;
  @include media-breakpoint-up(sm) {
    font-size: $font-size--title--sm;
    line-height: $line-height--title--sm;
    margin-bottom: 10px;
  }
  @include media-breakpoint-up(xl) {
    color: #4a4a4a;
    font-size: $font-size--title--xl;
    line-height: $line-height--title--xl;
    margin-bottom: 0;
  }
}

h1,
.micro-ad::v-deep .latest-list_item_title a {
  @include media-breakpoint-up(xl) {
    padding: 10px;
  }
}

h1 {
  @include media-breakpoint-up(xl) {
  }
}

h1 span,
.micro-ad::v-deep h3 {
  @include text-truncate(3, $font-size--base, $line-height--title);
  @include media-breakpoint-up(sm) {
    @include text-truncate(2, $font-size--title--sm, $line-height--title--sm);
  }
  @include media-breakpoint-up(xl) {
    @include text-truncate(2, $font-size--title--xl, $line-height--title--xl);
  }
}

$font-size--description: 16px;
$line-height--description: 1.4;

.description,
.micro-ad::v-deep .brief {
  display: none;
  @include media-breakpoint-up(sm) {
    font-size: $font-size--description;
    line-height: $line-height--description;
    @include text-truncate(
      3,
      $font-size--description,
      $line-height--description
    );
  }

  @include media-breakpoint-up(xl) {
    display: none;
  }
}

$padding-top--ad-img: 100%;

.micro-ad {
  &::v-deep {
    .latest-list_item {
      @include media-breakpoint-up(xl) {
        width: 100%;
        display: flex;
        flex-direction: column;

        height: 100%;

        > a {
          flex-grow: 1;
          position: relative;
        }
      }
    }

    .latest-list_item_img {
      padding-top: math.div($padding-top--ad-img, $aspect-ratio);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      @include media-breakpoint-up(sm) {
        padding-top: math.div($padding-top--ad-img, $aspect-ratio--sm);
      }
      @include media-breakpoint-up(xl) {
        padding-top: 66.7%;
        height: 100%;
      }
    }

    .latest-list_item_title {
      width: 100%;
      padding: 8px 8px 13px 12px;
      align-self: stretch;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 18px;
      position: relative;
      @include media-breakpoint-up(sm) {
        padding: 8px 20px;
        // padding-left: 80px;
        font-size: inherit;
      }
      @include media-breakpoint-up(xl) {
        padding: 0 !important;
      }

      a {
        @include media-breakpoint-up(xl) {
          display: block;
          background-color: #fff;
          width: 100%;
        }
      }
    }

    .latest-list_item_label {
      width: auto !important;
      color: #fff;
      display: inline-block;
      transform: translate(calc(-1 * (90vw) * 0.4653), 0);
      position: absolute;
      left: 0;
      top: 0;
      font-size: 14px;
      padding: 4px;
      @include media-breakpoint-up(sm) {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        // width: 60px !important;
        transform: translate(calc(-1 * (100vw - 64px) * 0.3418), 0);
        font-size: 16px;
        padding: 8px;
      }
      @include media-breakpoint-up(xl) {
        // position: absolute;
        // top: 0;
        // bottom: 0;
        transform: translate(0, 0);
        display: inline-block;
        min-height: auto;
        width: auto !important;
        line-height: 1;
      }
    }

    h3,
    .brief {
      font-family: inherit !important;
    }
  }
}
</style>
