<template>
  <div class="orderer-data">
    <h2 class="subscribe-form__title">{{ type }}</h2>

    <div v-if="!isOrderer" class="orderer-data__check">
      <input type="checkbox" v-model="disable" /><span>同訂購人資訊</span>
    </div>

    <div class="orderer-data__input_wrapper half">
      <span>姓名</span>
      <input type="text" :disabled="disable" />
    </div>

    <div class="phone">
      <div class="orderer-data__input_wrapper phone__cellphone">
        <span>手機</span>
        <input type="text" :disabled="disable" />
      </div>

      <div class="orderer-data__input_wrapper phone__phone">
        <span>市話（非必填）</span>
        <div class="orderer-data__input_wrapper multi">
          <input class="multi__phone" type="text" :disabled="disable" />
          <span>-</span>
          <input
            class="multi__ext"
            type="text"
            placeholder="EXT"
            :disabled="disable"
          />
        </div>
      </div>
    </div>

    <div class="orderer-data__input_wrapper">
      <span>通訊地址</span>
      <input type="text" :disabled="disable" />
    </div>

    <div v-if="isOrderer" class="orderer-data__input_wrapper">
      <span>電子信箱</span>
      <input type="text" :disabled="disable" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      isRequired: true,
      default: '訂購人',
    },
  },
  data() {
    return {
      disable: false,
    }
  },
  computed: {
    isOrderer() {
      return this.type !== '收件人'
    },
  },
}
</script>

<style lang="scss" scoped>
.orderer-data {
  position: relative;
  padding: 0 calc(25px - 8px);

  @include media-breakpoint-up(md) {
    padding: 0;
  }

  &__check {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    input {
      width: 22px;
      height: 22px;
      border-radius: 2px;
      box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
      background-color: #f5f5f5;
      margin-right: 8px;
    }

    span {
      font-size: 18px;
      color: #4a4a4a;
    }
  }

  &__input_wrapper {
    margin-bottom: 11px;
    width: 100%;

    &.half {
      width: 180px;

      @include media-breakpoint-up(md) {
        width: calc((100% - 30px) / 2);
      }
    }

    // .half-phone {
    //   display: flex;
    //   @include media-breakpoint-up(md) {
    //     width: calc((100% - 30px) / 2);
    //   }

    //   &__phone {
    //     width: 180px;
    //   }

    //   &__ext {
    //     width: 72px;
    //     @include media-breakpoint-up(md) {
    //       width: auto;
    //     }
    //   }
    // }
    &.phone {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @include media-breakpoint-up(md) {
        flex-direction: row;
      }

      &__cellphone {
        width: 180px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 30px) / 2);
        }
      }

      &__phone {
        width: 270px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 30px) / 2);
        }
      }
    }

    .multi {
      display: flex;
      align-items: center;

      & > input {
        margin-right: 4px;

        &:last-child {
          margin-left: 4px;
          margin-right: 0;
        }
      }

      &__phone {
        width: 180px;
      }

      // &__ext {
      //   width: 72px;
      // }
    }

    span {
      display: block;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #4a4a4a;
      margin-bottom: 6px;
    }

    input {
      height: 44px;
      width: 100%;
      padding: 11px 7px 11px;
      border-radius: 4px;
      box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.1);
      background: #f5f5f5;

      &:focus {
        outline: none;
      }

      &:disabled {
        // background-color: #f5f5f558;
        background: #ebebeb;
      }
    }
  }
}
</style>
