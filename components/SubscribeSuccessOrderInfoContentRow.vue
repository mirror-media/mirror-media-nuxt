<template>
  <div class="content_row">
    <div class="content_row__title">{{ title }}</div>
    <div class="content_row__data">
      {{ data }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      isRequired: true,
    },
    data: {
      type: String,
      isRequired: false,
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
