<template>
  <div>
    <nuxt />

    <ClientOnly>
      <TheGdpr />
    </ClientOnly>
  </div>
</template>

<script>
import TheGdpr from '~/components/TheGdpr.vue'

export default {
  name: 'Empty',

  components: {
    TheGdpr,
  },

  mounted() {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'optimize.activate' })
    }
  },
}
</script>
