<template>
  <a
    :href="sharedFbUrl"
    target="_blank"
    rel="noopener noreferrer"
    @click="$emit('click')"
  >
    <SvgFbLogo />
  </a>
</template>

<script>
import { toRef } from '@nuxtjs/composition-api'
import { useShareFb } from '~/composition/share.js'

import SvgFbLogo from '~/assets/fb-logo.svg?inline'

export default {
  name: 'UiShareFb',
  setup(props) {
    const sharedFbUrl = useShareFb(
      props.url === undefined ? undefined : toRef(props, 'url')
    )

    return {
      sharedFbUrl,
    }
  },
  components: {
    SvgFbLogo,
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
