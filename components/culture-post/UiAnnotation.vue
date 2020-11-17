<template>
  <div class="annotation">
    <span
      :class="{ active: openAnnotation }"
      class="annotation__text"
      @click="openAnnotation = !openAnnotation"
      v-text="annotation.text"
    />
    <div v-show="openAnnotation" class="annotation__content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="annotation.annotation" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiAnnotation',
  props: {
    annotation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openAnnotation: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.annotation {
  display: inline;
  &__text {
    display: inline;
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
    &.active {
      &::after {
        transform: rotate(-180deg);
      }
    }
  }
  &__content {
    margin: 13px auto 20px;
    padding: 23px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: 1px;
    text-align: justify;
    background-color: rgba(216, 216, 216, 0.3);
    border-radius: 2px;
    @include media-breakpoint-up(md) {
      margin: 13px 0 20px;
      padding: 23px 37px;
    }
    .content {
      width: 266px;
      margin: 0 auto;
      @include media-breakpoint-up(md) {
        width: 100%;
      }
    }
  }
}
</style>
