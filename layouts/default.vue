<template>
  <div>
    <ContainerHeader />
    <nuxt />
    <UIFooter />
  </div>
</template>

<script>
import ContainerHeader from '~/components/ContainerHeader.vue'
import UIFooter from '~/components/UIFooter.vue'

export default {
  middleware: ['fetchDefaultCommonData'],
  components: {
    UIFooter,
    ContainerHeader,
  },
  beforeMount() {
    this.updateViewport()

    window.addEventListener('resize', this.updateViewport)
    window.addEventListener('orientationChange', this.updateViewport)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateViewport)
    window.removeEventListener('orientationChange', this.updateViewport)
  },
  methods: {
    updateViewport() {
      this.$requestTick(() => {
        const htmlEl = document.documentElement
        const width = htmlEl.clientWidth
        const height = htmlEl.clientHeight
        const viewport = { width, height }

        this.$store.commit('setViewport', viewport)
      })
    },
  },
}
</script>

<style lang="sass" scoped></style>
