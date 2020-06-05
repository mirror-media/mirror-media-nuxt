<template>
  <a
    :href="`https://www.facebook.com/share.php?u=${shareUrl}`"
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
export default {
  name: 'UIShareFacebook',
  props: {
    url: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      shareUrl: this.url ?? '',
    }
  },
  mounted() {
    this.setShareUrl()
  },
  methods: {
    setShareUrl() {
      this.shareUrl = this.url ?? location.href
    },
  },
}
</script>
<style lang="scss" scoped>
picture {
  display: block;
}
</style>
