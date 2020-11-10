<template>
  <a
    :href="eventLogoLink"
    target="_blank"
    rel="noopener noreferrer"
    @click="emitGa"
  >
    <img :src="eventLogoImage" :alt="eventLogo.name" />
  </a>
</template>

<script>
export default {
  name: 'UiEventLogo',
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
    emitGa() {
      this.$emit('sendGa', {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'logo event',
      })
    },
  },
}
</script>
