<template>
  <div class="content_row__data_wrapper">
    <div
      v-for="rowItem in data"
      :key="rowItem.text"
      class="content_row__data_wrapper_row"
    >
      <div>{{ rowItem.text }}</div>
      <div>NT$ {{ rowItem.price }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [
        {
          text: 'test row item',
          price: 123,
        },
        {
          text: 'test row item',
          price: 123,
        },
      ],
    },
  },
}
</script>

<style lang="scss" scoped>
.content_row__data {
  display: block;
  flex: 1;
  @include media-breakpoint-up(sm) {
    display: flex;
  }

  &_wrapper {
    margin-top: 12px;
    flex: 1;
    @include media-breakpoint-up(sm) {
      margin-top: 0px;
    }

    &_row {
      display: flex;
      justify-content: space-between;

      & + & {
        margin-top: 8px;
        @include media-breakpoint-up(sm) {
          margin-top: 14px;
        }
      }

      &:last-child {
        padding-top: 10px;
        border-top: solid 1px #4a4a4a;
        @include media-breakpoint-up(sm) {
          padding-top: 18px;
        }
      }
    }
  }
}
</style>
