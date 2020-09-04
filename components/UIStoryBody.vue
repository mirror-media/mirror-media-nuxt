<template>
  <article class="story">
    <div class="story__section-datetime">
      <p :class="['story__category', section.name]" v-text="category.title" />
      <p class="story__published-date" v-text="publishedDate" />
    </div>
    <h1 class="story__title" v-text="story.title" />
    <picture class="story__hero-img">
      <figcaption v-text="story.heroCaption" />
    </picture>
  </article>
</template>

<script>
export default {
  name: 'UIStoryBody',
  props: {
    story: {
      type: Object,
      required: true,
    },
  },
  computed: {
    category() {
      return this.story.categories?.[0] ?? {}
    },
    publishedDate() {
      return this.$dayjs(this.story.publishedDate).format('YYYY.MM.DD HH:mm')
    },
    section() {
      return this.story.sections?.[0] ?? {}
    },
  },
}
</script>

<style lang="scss" scoped>
.story {
  color: #000;
  line-height: 1.15;
  text-align: justify;
  @include media-breakpoint-up(lg) {
    width: 695px;
  }
  > * {
    width: calc(100% - 50px);
    max-width: 645px;
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(lg) {
      width: 100%;
      max-width: none;
    }
  }
  &__section-datetime {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 20px;
    @include media-breakpoint-up(md) {
      margin-top: 0;
    }
  }
  &__category {
    color: #34495e;
    font-size: 21px;
    &::before {
      content: '';
      position: relative;
      top: 2px;
      display: inline-block;
      width: 7px;
      height: 1em;
      margin-right: 10px;
      vertical-align: text-top;
      background-color: #000;
    }
    @each $name, $color in $sections-color {
      &.#{$name} {
        &::before {
          background-color: $color;
        }
      }
    }
  }
  &__published-date {
    color: #a1a1a1;
    font-size: 16px; // 1rem
    font-style: italic;
    font-weight: 400;
    @include media-breakpoint-up(md) {
      font-size: 17px;
    }
  }
  &__title {
    margin-top: 13px;
    font-size: 28px; // 1.75rem
    font-weight: 400;
    line-height: 1.25;
    @include media-breakpoint-up(md) {
      margin-top: 25px;
      font-size: 32px;
    }
  }
  &__hero-img {
    display: block;
    width: 100%;
    max-width: none;
    margin-top: 20px;
    figcaption {
      max-width: 645px;
      margin: 5px 0 0;
      padding: 0 25px;
      color: #34495e;
      line-height: 1.3;
      @include media-breakpoint-up(md) {
        padding: 0;
        margin: 5px auto 0;
      }
      @include media-breakpoint-up(lg) {
        max-width: none;
      }
    }
  }
}
</style>
