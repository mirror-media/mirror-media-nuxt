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
    <a
      :href="subscribeFailButtonLink"
      class="fail-wrapper__button_wrapper button-wrapper"
    >
      <UiMembershipButtonPrimary class="order-fail_button">
        回前頁
      </UiMembershipButtonPrimary>
    </a>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
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
  inject: {
    subscribeFailButtonLink: {
      default: '/',
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
  padding: 16px;
  margin: 0 8px;
  @include media-breakpoint-up(xl) {
    padding: 24px;
  }
}

.subcribe-button {
  margin: 0 auto;
  width: 240px;
}

.fail-wrapper__message {
  margin-bottom: 27px;

  @include media-breakpoint-up(sm) {
    margin-bottom: 17px;
  }
}

.fail-wrapper__info {
  margin-bottom: 24px;
  @include media-breakpoint-up(xl) {
    margin-bottom: 48px;
  }

  &_row {
    display: flex;

    & + & {
      margin-top: 12px;
    }
  }
}

.fail-wrapper__info_row_title {
  width: 120px;
  @include media-breakpoint-up(sm) {
    width: 180px;
  }
}

.button-wrapper {
  width: 240px;
  display: block;
  margin: 0 auto;
}
</style>
