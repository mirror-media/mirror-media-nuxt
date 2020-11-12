<template>
  <a
    :href="sharedLineUrl"
    target="_blank"
    rel="noopener noreferrer"
    @click="$emit('click')"
  >
    <SvgLineLogo />
  </a>
</template>

<script>
import { toRef } from '@nuxtjs/composition-api'
import { useShareLine } from '~/composition/share.js'

import SvgLineLogo from '~/assets/line-logo.svg?inline'

export default {
  name: 'UiShareLine',
  setup(props) {
    const sharedLineUrl = useShareLine(
      props.url === undefined ? undefined : toRef(props, 'url')
    )

    return {
      sharedLineUrl,
    }
  },
  components: {
    SvgLineLogo,
  },
  props: {
    url: {
      type: String,
      default: undefined,
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  width: 100%;
  height: auto;
}
</style>
