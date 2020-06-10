<template>
  <a :href="eventLogoLink" target="_blank" @click="emitGA">
    <img :src="eventLogoImage" :alt="eventLogo.name" />
  </a>
</template>

<script>
export default {
  name: 'UIEventLogo',
  props: {
    eventLogo: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    eventLogoLink() {
      return this.eventLogo.link ?? '/'
    },
    eventLogoImage() {
      return this.eventLogo.image?.image?.resizedTargets?.mobile?.url ?? ''
    },
  },
  methods: {
    emitGA() {
      this.$emit('sendGA', {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'logo event',
      })
    },
  },
}
</script>
