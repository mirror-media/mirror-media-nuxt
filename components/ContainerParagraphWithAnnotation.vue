<template>
  <p class="paragraph-with-annotation">
    <template v-for="data in splitContents">
      <slot v-if="data.pureAnnotationText !== undefined" :data="data"></slot>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-else :key="data.id" v-html="data.html"></span>
    </template>
  </p>
</template>

<script>
import { isTruthy } from '~/utils/index.js'

export default {
  name: 'ContainerParagraphWithAnnotation',

  props: {
    content: {
      type: String,
      default: '',
      required: true,
    },
  },

  computed: {
    splitContents() {
      return this.content
        .split(/<!--__ANNOTATION__=|-->/gim)
        .filter(isAnnotationOrText)
        .filter(isTruthy)
        .map(parseStrAndAddId)

      function isAnnotationOrText(item) {
        return !item.startsWith('<!--')
      }

      function parseStrAndAddId(str, idx) {
        // str 有可能是不合法的 JSON 格式（比如 'fake str'），這時 JSON.parse 會報錯
        try {
          return {
            id: idx,
            ...JSON.parse(str),
          }
        } catch {
          return { id: idx, html: str }
        }
      }
    },
  },
}
</script>
