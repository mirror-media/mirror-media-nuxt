<template>
  <div class="content_row">
    <div class="content_row__title">
      {{ title }}
    </div>
    <div class="content_row__data">
      <PurchasedList :data="perchasedList" />
    </div>
  </div>
</template>

<script>
import PurchasedList from '~/components/PurchasedList.vue'

export default {
  components: { PurchasedList },
  props: {
    title: {
      type: String,
      isRequired: true,
    },
    perchasedList: {
      type: Array,
      required: true,
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.content_row {
  display: flex;
  & + & {
    margin-top: 12px;
  }
}

.content_row__title {
  min-width: 97px;

  @include media-breakpoint-up(sm) {
    min-width: 150px;
  }
}

.content_row__data {
  display: block;
  flex: 1;
  @include media-breakpoint-up(sm) {
    display: flex;
  }
}
</style>
