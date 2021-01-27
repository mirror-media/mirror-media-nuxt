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

import { fireActivationEvent } from '~/utils/google-optimize.js'

export default {
  name: 'Empty',

  components: {
    TheGdpr,
  },

  mounted() {
    fireActivationEvent.bind(this)()
  },
}
</script>
