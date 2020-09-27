<template>
  <div class="fb-page-container">
    <div class="fb-page" v-bind="fbPageSettings">
      <blockquote
        cite="https://www.facebook.com/mirrormediamg"
        class="fb-xfbml-parse-ignore"
      >
        <a href="https://www.facebook.com/mirrormediamg">鏡週刊</a>
      </blockquote>
    </div>
  </div>
</template>

<script>
import { reactive } from '@nuxtjs/composition-api'
import { useFbPagePlugin } from '~/composition/fb-plugins.js'

export default {
  name: 'FbPage',
  setup(props) {
    const fbPageSettings = reactive({
      'data-href': 'https://www.facebook.com/mirrormediamg',
      'data-tabs': 'timeline',
      'data-show-facepile': 'false',
      'data-lazy': 'true',
      ...props.settings,
    })

    useFbPagePlugin()

    return {
      fbPageSettings,
    }
  },
  props: {
    settings: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style lang="scss" scoped>
.fb-page-container {
  text-align: center;
}
</style>
