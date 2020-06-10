<template>
  <a
    :href="`https://social-plugins.line.me/lineit/share?url={encodeURIComponent(${shareUrl})}`"
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
export default {
  name: 'UIShareLine',
  props: {
    url: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isMounted: false,
    }
  },
  computed: {
    shareUrl() {
      return this.url || (this.isMounted && location.href)
    },
  },
  mounted() {
    this.isMounted = true
  },
}
</script>

<style lang="scss" scoped>
picture {
  display: block;
}
</style>
