<template>
  <div class="orderer-data">
    <h2 class="subscribe-form__title">{{ type }}</h2>

    <div class="orderer-data__input_wrapper half">
      <span>姓名</span>
      <input type="text" />
    </div>

    <div class="orderer-data__input_wrapper phone">
      <div class="orderer-data__input_wrapper phone__cellphone">
        <span>手機</span>
        <input type="text" />
      </div>

      <div class="orderer-data__input_wrapper phone__phone">
        <span>市話（非必填）</span>
        <div class="orderer-data__input_wrapper multi">
          <input class="multi__phone" type="text" />
          <span>-</span>
          <input class="multi__ext" type="text" placeholder="EXT" />
        </div>
      </div>
    </div>

    <div class="orderer-data__input_wrapper">
      <span>通訊地址</span>
      <input type="text" />
    </div>

    <div class="orderer-data__input_wrapper">
      <span>電子信箱</span>
      <input type="text" />
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
    return {}
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
      background-color: #f5f5f5;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
