<template>
  <div>
    <UiBreadcrumb
      :breadcrumbs="[
        { text: '人物', link: '/premiumsection/people', color: '#054F77' },
      ]"
      :separatorColor="'#054F77'"
    />
  </div>
</template>

<script>
import UiBreadcrumb from '~/components/UiBreadcrumb.vue'

export default {
  layout: 'premium',
  components: {
    UiBreadcrumb,
  },
}
</script>

<style scoped></style>
