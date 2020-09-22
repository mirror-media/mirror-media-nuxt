<template>
  <lazy-component
    v-if="hasItems"
    :class="[{ single: isSingle }, sectionName, 'story-list']"
  >
    <nuxt-link
      v-for="item in itemsSliced"
      :key="item.slug"
      :to="`/story/${item.slug}`"
      class="item"
    >
      <div class="item__arrow" />
      <div class="item__info">
        <span v-text="item.title" />
      </div>
    </nuxt-link>
  </lazy-component>
</template>

<script>
export default {
  name: 'UIStoryListWithArrow',
  props: {
    categoryTitle: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    sectionName: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasItems() {
      return this.items.length > 0
    },
    isSingle() {
      return this.items.length === 1
    },
    itemsSliced() {
      return this.items.slice(0, 2)
    },
  },
}
</script>

<style lang="scss" scoped>
.story-list {
  display: flex;
  justify-content: space-between;
  &:not(.single) {
    .item:last-child {
      .item__arrow {
        order: 1;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        &:before {
          transform: rotate(180deg);
        }
      }
    }
  }
  .item {
    flex: 1;
    display: flex;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
    @include media-breakpoint-up(md) {
      max-width: 50%;
    }
    &:hover,
    &:active {
      .item__info {
        outline: 2px solid #000;
        outline-offset: -2px;
      }
    }
    &:first-child {
      .item__arrow {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }
    + .item {
      margin-left: 5px;
    }
    &__arrow {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 26px;
      height: 100%;
      background-color: #000;
      &:before {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-radius: 2px;
        border-width: 7px 8px 7px 0;
        border-color: transparent #fff transparent transparent;
      }
    }
    &__info {
      flex: 1;
      display: flex;
      align-items: flex-start;
      padding: 9px 12px;
      color: #1b1b1b;
      font-size: 14px; // 0.875rem
      line-height: 1.5;
      text-align: justify;
      span {
        display: -webkit-box;
        height: calc(1em * 1.5 * 2);
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  @each $name, $color in $sections-color {
    &.#{$name} {
      .item {
        &:hover,
        &:active {
          .item__info {
            outline-color: $color;
          }
        }
      }
      .item__arrow {
        background-color: $color;
      }
    }
  }
}
</style>
