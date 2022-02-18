<template>
  <div class="share-links-wrapper" :class="`share-links-wrapper--${direction}`">
    <UiShareFb
      class="share-links-wrapper__share-link share-link"
      :class="direction"
      data-user-behavior-description="share-facebook"
    />
    <UiShareLine
      class="share-links-wrapper__share-link share-link"
      :class="direction"
      data-user-behavior-description="share-line"
    />
    <UiShareLink
      class="share-links-wrapper__share-link share-link"
      :class="direction"
      data-user-behavior-description="share-link"
    />
  </div>
</template>

<script>
import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'
import UiShareLink from '~/components/UiShareLink.vue'

export default {
  components: {
    UiShareFb,
    UiShareLine,
    UiShareLink,
  },
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator(value) {
        return ['horizontal', 'vertical', 'vertical-reverse'].includes(value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.share-links-wrapper {
  height: 36px;
  display: flex;
  align-items: center;
  &--horizontal {
    flex-direction: row;
  }
  &--vertical {
    flex-direction: column-reverse;
  }
  &--vertical-reverse {
    flex-direction: column;
  }

  &__share-link {
    &.horizontal {
      & + & {
        margin: 0 0 0 16px;
      }
    }
    &.vertical {
      & + & {
        margin: 0;
      }
      &:not(:last-child) {
        margin: 16px 0 0 0 !important;
      }
    }
    &.vertical-reverse {
      & + & {
        margin: 16px 0 0 0 !important;
      }
    }
  }
}

.share-link {
  display: inline-block;
  width: 36px;
  height: 36px;
}
</style>
&
