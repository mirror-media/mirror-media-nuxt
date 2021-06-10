<template>
  <span class="annotation">
    <span
      class="annotation__text"
      @click="shouldOpenAnnotation = !shouldOpenAnnotation"
    >
      {{ content.text }}
      <SvgAnnotationToggle
        :class="[
          'toggle-icon',
          { 'toggle-icon--rotate': shouldOpenAnnotation },
        ]"
      />
    </span>

    <span
      v-if="shouldOpenAnnotation"
      class="annotation__content"
      v-text="content.pureAnnotationText"
    />
  </span>
</template>

<script>
import SvgAnnotationToggle from '~/assets/premium-annotation-toggle.svg?inline'

export default {
  name: 'UiAnnotation',
  components: {
    SvgAnnotationToggle,
  },
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
    display: inline-flex;
    align-items: center;
  }

  &__content {
    display: inline-block;
    width: 100%;
    margin-top: 8px;
    margin-bottom: 32px;
    padding: 24px 32px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    text-align: justify;
    background-color: #f3f5f6;
    border-radius: 2px;
    line-height: 180%;
  }
}

.toggle-icon {
  display: inline-block;
  height: 8px;
  transform: rotate(180deg);
  transition: transform 0.25s ease-out;
  margin: 0 0 0 9px;
  &--rotate {
    transform: rotate(0deg);
  }
}
</style>
