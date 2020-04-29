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
  middleware: ['fetchHeaderData'],
  components: {
    UIFooter,
    ContainerHeader,
  },
}
</script>

<style lang="sass" scoped></style>
