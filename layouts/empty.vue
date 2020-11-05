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
}
</script>
