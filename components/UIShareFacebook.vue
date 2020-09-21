<template>
  <a
    :href="sharedFbUrl"
    target="_blank"
    rel="noopener noreferrer"
    @click="$emit('click')"
  >
    <picture>
      <source
        srcset="~/assets/facebook_logo_official_72.webp"
        type="image/webp"
      />
      <img
        src="~/assets/facebook_logo_official_72.png"
        alt="分享至 Facebook"
        loading="lazy"
      />
    </picture>
  </a>
</template>

<script>
import { toRef } from '@nuxtjs/composition-api'
import { useShareFb } from '~/composition/share.js'

export default {
  name: 'UIShareFacebook',
  setup(props) {
    const sharedFbUrl = useShareFb(
      props.url === undefined ? undefined : toRef(props, 'url')
    )

    return {
      sharedFbUrl,
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
