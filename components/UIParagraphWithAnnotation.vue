<template>
  <div class="paragraph-annotation">
    <template v-for="(data, index) in splitContent">
      <UIAnnotation
        v-if="data.annotation"
        :key="`${item.id}-${index}`"
        :annotation="data"
      />

      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-else :key="`${item.id}-${index}`" v-html="data" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import UIAnnotation from '~/components/UIAnnotation.vue'

export default {
  name: 'UIParagraphWithAnnotation',
  components: {
    UIAnnotation,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    content() {
      return this.item.content?.[0]
    },
    splitContent() {
      // 需改善 regex
      const data = this.content.split(/<!--__ANNOTATION__=/gm)
      const split = data.map((item) => {
        if (item.match(/<!--(.*)-->/)) {
          const annotationWithFollowingText = item.split(/<!--(.*)-->/)
          return [
            annotationWithFollowingText[0].replace(/-->/, ''),
            annotationWithFollowingText[2],
          ]
        }
        return item
      })
      const flattenData = _.flatten(split)
      const processed = flattenData.map((item) => {
        if (item.match(/^{(.*)}$/)) {
          return JSON.parse(item)
        }
        return item
      })
      return processed
    },
  },
}
</script>
