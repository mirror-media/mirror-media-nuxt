<template>
  <div v-if="brief[0]" class="brief">
    <div v-for="paragraph in brief" :key="paragraph">
      <template v-if="isString(paragraph[0])">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="paragraph" />
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
      type: Object,
      default: () => {},
      require: true,
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
.brief {
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
}
</style>
