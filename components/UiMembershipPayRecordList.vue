<template>
  <div class="pay-list pay-record__form_row">
    <div class="pay-list__content">
      <div class="pay-list__content_date">{{ pay.date }}</div>
      <div class="pay-list__content_number">
        <div class="pay-list__content_number_number">{{ pay.number }}</div>
        <div v-if="!isTitleRow" class="pay-list__content_number_type">
          <span>
            {{ pay.type }}
          </span>
          <span v-if="pay.type !== '' && paymentStatus.text !== ''">・</span>
          <span
            :class="{ 'warning-highlight': paymentStatus.warningHightlight }"
          >
            {{ paymentStatus.text }}
          </span>
        </div>
      </div>
      <div class="pay-list__content_method">
        {{ pay.method }}
        <span>{{ pay.methodNote }}</span>
      </div>
    </div>
    <div class="pay-list__price">{{ price(pay.price) }}</div>
  </div>
</template>

<script>
export default {
  props: {
    pay: {
      type: Object,
      require: true,
      default: () => {},
    },
    isTitleRow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    paymentStatus() {
      if (this.pay?.status === 'SUCCESS') {
        return { text: '付款成功' }
      } else if (this.pay?.status?.length) {
        return { text: '付款失敗', warningHightlight: true }
      } else return { text: '' }
    },
  },
  methods: {
    price(price) {
      if (typeof price === 'number') {
        return `$${price}`
      }
      return price
    },
  },
}
</script>

<style lang="scss" scoped>
.pay-list {
  display: flex;
  div + div {
    margin-left: 20px;
  }
  &__content {
    flex: 1;
    @include media-breakpoint-up(sm) {
      display: flex;
    }

    &_date {
      flex: 1;
      font-family: 'PingFang TC';
    }
    &_number {
      flex: 2;
      div + div {
        margin-left: 4px;
      }
      @include media-breakpoint-up(sm) {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        div + div {
          margin-top: 4px;
        }
      }

      &_type {
        @include media-breakpoint-up(sm) {
          font-size: 13px;
          line-height: 18px;
          color: rgba(0, 0, 0, 0.3);
        }

        .warning-highlight {
          color: #e51731;
        }
      }

      &_number {
        margin-top: 4px;
        font-size: 13px;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.3);
        @include media-breakpoint-up(sm) {
          margin-top: 0px;
          font-size: 15px;
          line-height: 21px;
          color: inherit;
        }
        @include media-breakpoint-up(md) {
          font-size: 16px;
          line-height: 22px;
        }
      }
    }
    &_method {
      flex: 2;
      font-size: 13px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.3);
      @include media-breakpoint-up(sm) {
        font-size: 15px;
        line-height: 21px;
        color: inherit;
      }
      @include media-breakpoint-up(md) {
        font-size: 16px;
        line-height: 22px;
      }
      span {
        @include media-breakpoint-up(sm) {
          font-size: 13px;
          line-height: 18px;
          color: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  &__price {
    width: 70px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
