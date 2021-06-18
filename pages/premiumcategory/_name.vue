<template>
  <div>
    <UiBreadcrumb :breadcrumbs="breadcrumbs" />
  </div>
</template>

<script>
import UiBreadcrumb from '~/components/UiBreadcrumb.vue'
import { usePremiumBreadcrumbs } from '~/composition/premium-breadcrumbs'

export default {
  layout: 'premium',
  components: {
    UiBreadcrumb,
  },
  setup() {
    const breadcrumbs = usePremiumBreadcrumbs()
    return {
      breadcrumbs,
    }
  },
}
</script>

<style scoped></style>
