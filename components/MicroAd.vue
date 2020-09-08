<template>
  <MicroAdUnit v-if="!IS_AD_DISABLE" v-bind="$props" />
</template>

<script>
import { IS_AD_DISABLE } from '~/configs/config'
import MicroAdUnit from '~/components/MicroAdUnit.vue'

export default {
  components: {
    MicroAdUnit,
  },
  props: ['unitId'],
  data() {
    return {
      IS_AD_DISABLE,
    }
  },
}
</script>
