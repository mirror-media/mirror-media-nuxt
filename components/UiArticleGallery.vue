<template>
  <div class="article-gallery">
    <ul>
      <template v-for="item in items">
        <li v-if="!item.isMicroAd" :key="item.id">
          <a
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            @click="$emit('sendGa')"
          >
            <article>
              <div class="img-wrapper">
                <img v-lazy="item.imgSrc" alt="" />
              </div>

              <div
                v-if="item.label"
                class="label label--sm"
                :class="item.sectionName"
              >
                {{ item.label }}
              </div>

              <div class="text-wrapper">
                <div
                  v-if="item.label"
                  class="label label--xs"
                  :class="item.sectionName"
                >
                  {{ item.label }}
                </div>
                <h1>{{ item.title }}</h1>
                <p class="description">{{ item.description }}</p>
              </div>
            </article>
          </a>
        </li>

        <MicroAd
          v-else
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
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpLg',
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
$font-size--base: 19.2px;
$font-size--base--lg: 16px;

.article-gallery {
  color: #8c8c8c;
  font-size: $font-size--base;
  @include media-breakpoint-up(lg) {
    font-size: $font-size--base--lg;
  }
}

ul {
  @include media-breakpoint-up(lg) {
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
  @include media-breakpoint-up(lg) {
    width: calc((100% - #{$padding-x--li * 2}) / 3);
    padding-top: 0;
    padding-bottom: 0;
    margin-right: $padding-x--li;
    margin-bottom: 15px;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
  }
}

article,
.micro-ad {
  display: flex;
  align-items: flex-start;
  @include media-breakpoint-up(lg) {
    position: relative;
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
  padding-top: $width--img-wrapper / $aspect-ratio;
  margin-right: 20px;
  @include media-breakpoint-up(sm) {
    padding-top: $width--img-wrapper--sm / $aspect-ratio--sm;
    margin-right: 0;
  }
  @include media-breakpoint-up(lg) {
    width: 100%;
    padding-top: 100%;
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
  padding: 4px 10px;
  background-color: #bcbcbc;
  color: #fff;
}

.label--xs,
.micro-ad::v-deep .latest-list_item_label {
  display: inline-block;
  margin-bottom: 19.2px;
  @include media-breakpoint-up(lg) {
    line-height: 1;
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
    min-height: 60px;
    flex-shrink: 0;
    margin-right: 20px;
    line-height: 1.15;
  }
}

.label {
  @each $name, $color in $sections-color {
    &.#{$name} {
      background-color: $color;
    }
  }

  &--xs {
    @include media-breakpoint-up(sm) {
      display: none;
    }
    @include media-breakpoint-up(lg) {
      display: inline-block;
    }
  }

  &--sm {
    display: none;
    @include media-breakpoint-up(sm) {
      display: flex;
      width: 60px;
    }
    @include media-breakpoint-up(lg) {
      display: none;
    }
  }
}

.text-wrapper {
  @include media-breakpoint-up(lg) {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}

$line-height--title: 1.41;
$line-height--title--sm: 1.3;
$font-size--title--sm: 20.8px;
$font-size--title--lg: 16px;

h1,
.micro-ad::v-deep h3 {
  font-weight: 300;
  line-height: $line-height--title;
  @include text-truncate(3, $font-size--base, $line-height--title);
  @include media-breakpoint-up(sm) {
    font-size: $font-size--title--sm;
    line-height: $line-height--title--sm;
    margin-bottom: 10px;
    @include text-truncate(2, $font-size--title--sm, $line-height--title--sm);
  }
  @include media-breakpoint-up(lg) {
    padding: 10px;
    color: #fff;
    font-size: $font-size--title--lg;
    line-height: 1.69;
    margin-bottom: 0;
    box-sizing: content-box;
    @include text-truncate(2, $font-size--title--lg, 1.69);
  }
}

h1 {
  @include media-breakpoint-up(lg) {
    background-color: rgba(#000, 0.7);
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

  @include media-breakpoint-up(lg) {
    display: none;
  }
}

$padding-top--ad-img: 100%;

.micro-ad {
  &::v-deep {
    .latest-list_item {
      @include media-breakpoint-up(lg) {
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
      padding-top: $padding-top--ad-img / $aspect-ratio;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      @include media-breakpoint-up(sm) {
        padding-top: $padding-top--ad-img / $aspect-ratio--sm;
      }
      @include media-breakpoint-up(lg) {
        padding-top: 0;
        height: 100%;
      }
    }

    .latest-list_item_title {
      width: 100%;
      padding-left: 20px;
      align-self: stretch;
      @include media-breakpoint-up(sm) {
        position: relative;
        padding-left: 80px;
      }
      @include media-breakpoint-up(lg) {
        padding-left: 0 !important;
      }
    }

    .latest-list_item_label {
      width: auto !important;
      @include media-breakpoint-up(sm) {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        width: 60px !important;
      }
      @include media-breakpoint-up(lg) {
        position: absolute;
        top: auto;
        bottom: 0;
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

    h3 {
      @include media-breakpoint-up(lg) {
        background-color: #000;
      }
    }
  }
}
</style>
