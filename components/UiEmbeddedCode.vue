<template>
  <div>
    <div ref="embeddedcode" />
    <LazyRenderer v-if="!isInstagram" @load="insertScriptsInBody(embeddedCode)">
      <p v-if="caption" class="caption">{{ caption }}</p>
    </LazyRenderer>
    <p v-if="caption && isInstagram" class="caption">{{ caption }}</p>
  </div>
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
    embeddedCode() {
      return this.content?.embeddedCode ?? ''
    },
    isInstagram() {
      return this.embeddedCode?.includes('instagram-media')
    },
  },

  mounted() {
    if (this.isInstagram) {
      this.insertScriptsInBody(this.embeddedCode)
    }
  },

  methods: {
    insertScriptsInBody(embeddedCode) {
      const fragment = document.createDocumentFragment()

      const parser = new DOMParser()
      const embeddedCodeString = `<div id="draft-embed">${embeddedCode}</div>`
      const ele = parser.parseFromString(embeddedCodeString, 'text/html')

      const scripts = ele.querySelectorAll('script')
      const nonScripts = ele.querySelectorAll('div#draft-embed > :not(script)')

      nonScripts.forEach((ele) => {
        fragment.appendChild(ele)
      })

      scripts.forEach((s) => {
        const scriptEle = document.createElement('script')
        const attrs = s.attributes
        for (let i = 0; i < attrs.length; i++) {
          scriptEle.setAttribute(attrs[i].name, attrs[i].value)
        }
        scriptEle.text = s.text || ''
        fragment.appendChild(scriptEle)
      })

      this.$refs.embeddedcode.appendChild(fragment)
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
