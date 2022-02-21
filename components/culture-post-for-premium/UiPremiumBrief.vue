<template>
  <div v-if="brief[0]" class="brief" :style="{ backgroundColor: briefColor }">
    <div v-for="paragraph in brief" :key="paragraph.id">
      <template v-if="isString(paragraph.content)">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="brief__paragraph" v-html="paragraph.content" />
      </template>
      <template v-else>
        <UiStoryContentHandler :key="paragraph.id" :paragraph="paragraph" />
      </template>
    </div>
  </div>
</template>

<script>
import UiStoryContentHandler from '~/components/UiStoryContentHandler.vue'
export default {
  components: {
    UiStoryContentHandler,
  },
  props: {
    brief: {
      type: Array,
      default: () => [],
      require: true,
    },
    briefColor: {
      type: String,
      default: null,
    },
  },
  methods: {
    isString(value) {
      return typeof value === 'string'
    },
  },
}
</script>

<style lang="scss" scoped>
.brief::v-deep {
  margin-top: 28px;
  padding: 16px 24px;
  background: #054f77;
  font-weight: 500;
  font-size: 18px;
  line-height: 200%;
  color: #ffffff;
  @include media-breakpoint-up(md) {
    margin-top: 55px;
    padding: 24px 32px;
  }

  &__paragraph {
    margin-top: 32px;
  }

  *:not(:first-child) {
    margin-top: 32px;
  }
}
</style>
