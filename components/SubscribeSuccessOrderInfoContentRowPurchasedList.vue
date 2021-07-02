<template>
  <div class="content_row">
    <div class="content_row__title">{{ title }}</div>
    <div class="content_row__data">
      <div class="content_row__data_wrapper">
        <div
          v-for="item of perchasedList"
          :key="item.id"
          class="content_row__data_wrapper_row"
        >
          <div>{{ item.name }} X {{ item.amount }}</div>
          <div>NT$ {{ item.price * item.amount }}</div>
        </div>
        <div
          class="content_row__data_wrapper_row content_row__data_wrapper_ship"
        >
          <div>運費</div>
          <div>NT$ {{ shipCost }}</div>
        </div>
        <div class="content_row__data_wrapper_row">
          <div>總計</div>
          <div>NT$ {{ totalCost }}</div>
        </div>
      </div>
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
    shipCost: {
      type: Number,
      isRequired: false,
    },
    perchasedList: {
      type: Array,
      isRequired: false,
    },
    totalCost: {
      type: Number,
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

    @include media-breakpoint-up(sm) {
      margin-top: 18px;
    }
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
    }

    &_ship {
      padding-bottom: 10px;
      border-bottom: solid 1px #4a4a4a;
      @include media-breakpoint-up(sm) {
        padding-bottom: 18px;
      }
    }
  }
}
</style>
