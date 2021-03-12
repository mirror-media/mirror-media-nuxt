<template>
  <span class="annotation">
    <span
      class="annotation__text"
      :class="{ open: shouldOpenAnnotation }"
      @click="shouldOpenAnnotation = !shouldOpenAnnotation"
      >{{ content.text }}</span
    >

    <span v-if="shouldOpenAnnotation" class="annotation__content">{{
      content.pureAnnotationText
    }}</span>
  </span>
</template>

<script>
export default {
  name: 'UiAnnotation',

  props: {
    content: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },

  data() {
    return {
      shouldOpenAnnotation: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.annotation {
  &__text {
    cursor: pointer;

    &::after {
      content: '';
      display: inline-block;
      margin-left: 5px;
      vertical-align: middle;
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: #3e67aa transparent transparent transparent;
      transition: transform 0.3s ease-in;
    }

    &.open::after {
      transform: rotate(-180deg);
    }
  }

  &__content {
    display: inline-block;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 24px 32px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    line-height: 29px;
    text-align: justify;
    background-color: rgba(216, 216, 216, 0.3);
    border-radius: 2px;
    @include media-breakpoint-up(md) {
      padding: 26px 37px;
    }
  }
}
</style>
