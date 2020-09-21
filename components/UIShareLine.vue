<template>
  <a
    :href="sharedLineUrl"
    target="_blank"
    rel="noopener noreferrer"
    @click="$emit('click')"
  >
    <picture>
      <source srcset="~/assets/line_logo_official_90.webp" type="image/webp" />
      <img
        src="~/assets/line_logo_official_90.png"
        alt="分享至 Line"
        loading="lazy"
      />
    </picture>
  </a>
</template>

<script>
import { toRef } from '@nuxtjs/composition-api'
import { useShareLine } from '~/composition/share.js'

export default {
  name: 'UIShareLine',
  setup(props) {
    const sharedLineUrl = useShareLine(
      props.url === undefined ? undefined : toRef(props, 'url')
    )

    return {
      sharedLineUrl,
    }
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
picture {
  display: block;
}
</style>
