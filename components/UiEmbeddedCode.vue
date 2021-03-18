<template>
  <LazyRenderer @load="insertScriptsInBody(scripts)">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="embeddedCodeWithoutScript" />
    <p v-if="caption" class="caption">{{ caption }}</p>
  </LazyRenderer>
</template>

<script>
export default {
  name: 'UiEmbeddedCode',

  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    caption() {
      return this.content?.caption ?? ''
    },
    scripts() {
      return this.content?.scripts ?? []
    },
    embeddedCodeWithoutScript() {
      return this.content?.embeddedCodeWithoutScript ?? ''
    },
  },
  methods: {
    insertScriptsInBody(scripts) {
      if (process.browser) {
        scripts.forEach((item) => {
          const src = item.attribs?.src ?? ''
          const s = document.createElement('script')
          s.setAttribute('src', src)
          document.body.appendChild(s)
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.caption {
  margin-top: 10px;
  color: rgba(#000, 0.498);
  font-size: 15px;
  line-height: 1.7;
}
</style>
