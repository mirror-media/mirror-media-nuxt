<template>
  <div class="fail-wrapper">
    <div v-if="message" class="fail-wrapper__message">
      {{ message }}
    </div>
    <div v-else class="fail-wrapper__info">
      <div class="fail-wrapper__info_row">
        <div class="fail-wrapper__info_row_title">訂單編號</div>
        <div class="fail-wrapper__info_row_content">
          {{ data.orderId }}
        </div>
      </div>
      <div class="fail-wrapper__info_row">
        <div class="fail-wrapper__info_row_title">付款錯誤訊息</div>
        <div class="fail-wrapper__info_row_content">
          {{ data.message }}
        </div>
      </div>
    </div>
    <UiSubscribeButton title="回前頁" :class="status + `_button`" />
  </div>
</template>

<script>
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
export default {
  components: {
    UiSubscribeButton,
  },
  props: {
    message: {
      type: String,
      isRequired: false,
      default: '',
    },
    status: {
      type: String,
      isRequired: true,
      default: 'order-fail',
    },
    data: {
      type: Object,
      isRequired: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.fail-wrapper {
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #4a4a4a;
  display: flex;
  flex-direction: column;
  padding: 20px 16px 24px 16px;
  margin: 0 8px;
  @include media-breakpoint-up(sm) {
    padding-left: 24px;
  }
}

.subcribe-button {
  margin: 0 auto;
  width: 240px;
  height: 48px;
}

.fail-wrapper__message {
  margin-bottom: 27px;

  @include media-breakpoint-up(sm) {
    margin-bottom: 17px;
  }
}

.fail-wrapper__info {
  margin-bottom: 48px;

  &_row {
    display: flex;

    & + & {
      margin-top: 12px;

      @include media-breakpoint-up(sm) {
        margin-top: 20px;
      }
    }
  }
}

.fail-wrapper__info_row_title {
  width: 120px;
  @include media-breakpoint-up(sm) {
    width: 180px;
  }
}

.order-fail_button {
  width: 270px;
  height: 56px;

  @include media-breakpoint-up(sm) {
    margin: 0px;
    width: 321px;
  }
}
</style>
