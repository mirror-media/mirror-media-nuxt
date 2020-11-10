<template>
  <span class="story-annotation">
    <span>{{ content.text }}</span>

    <button type="button" @click="toggleAnnotation">
      <span>（註）</span
      ><SvgArrowDown :class="{ open: shouldOpenAnnotation }" />
    </button>

    <span v-if="shouldOpenAnnotation" class="story-annotation__content">{{
      content.pureAnnotationText
    }}</span>
  </span>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

import SvgArrowDown from '~/assets/arrow-down-annotation.svg?inline'

export default {
  name: 'UiStoryAnnotation',

  setup() {
    const shouldOpenAnnotation = ref(false)

    function toggleAnnotation() {
      shouldOpenAnnotation.value = !shouldOpenAnnotation.value
    }

    return {
      shouldOpenAnnotation,
      toggleAnnotation,
    }
  },

  components: {
    SvgArrowDown,
  },

  props: {
    content: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.story-annotation {
  &__content {
    display: inline-block;
    font-size: 14px;
    text-align: justify;
    line-height: 2.14;
    padding: 14px 10px;
    background-color: #fff;
    border-top: 3px solid #1d9fb8;
    box-shadow: 0 2px 4px rgba(#000, 0.5);
    width: 100%;
    color: #4a4a4a;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

button {
  display: inline-flex;
  align-items: center;
  color: #1d9fb8;
  outline: none;
}

svg {
  width: 18px;
  height: auto;
  transition: transform 0.3s;

  &.open {
    transform: rotate(180deg);
  }
}
</style>
