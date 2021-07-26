<template>
  <div class="merchandise-list">
    <div class="merchandise-list__title">
      <h2 class="subscribe-form__title">訂購項目</h2>
      <SubscribeFormEditPerchase :perchasedPlan="perchasedPlan" />
    </div>

    <UiMerchandiseList :perchasedPlan="perchasedPlan" :isPopUp="false" />

    <div class="merchandise-list__discount_code">
      <div class="merchandise-list__discount_code_row">
        <div class="merchandise-list__discount_code_check">
          <input type="checkbox" v-model="shouldShowDiscountCode" />
          <span>我有續訂折扣碼</span>
        </div>
      </div>
      <template v-if="shouldShowDiscountCode">
        <div class="merchandise-list__discount_code_row input">
          <div
            class="merchandise-list__discount_code_input"
            :class="{ focus: isInputFocused, disabled: discount.hasCode }"
          >
            <label for="discount-code">MR000</label>
            <input
              v-model="discount.code"
              type="text"
              placeholder="12345"
              @focus="toggleIsInputFocused"
              @input="handleInput"
              @blur="toggleIsInputFocused"
              id="discount-code"
              maxlength="5"
              :disabled="discount.hasCode"
            />
          </div>
          <UiSubscribeButton
            @click.native="submitDiscountCode"
            :title="buttonTitle"
            :class="{ disabled: isDisabled, remove: discount.hasCode }"
          />
        </div>

        <div
          v-show="discount.hasCode"
          class="merchandise-list__discount_code_row"
        >
          <div class="merchandise-list__discount_code_prompt">
            <p>折扣 80 元、贈送 1 期</p>
          </div>
        </div>

        <div class="merchandise-list__discount_code_row">
          <div class="merchandise-list__discount_code_info">
            <p>
              續訂戶資格為實際訂閱紙本鏡週刊滿 1 年 (52 期)
              並已有訂戶代號，如不清楚訂戶代號或是否符合續訂戶資格，請來電
              02-6633-3882 查詢。
            </p>
            <p>
              若您非續訂戶，服務人員將去電提醒告知，需請補足差額後方能完成訂閱。
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import UiMerchandiseList from '~/components/UiMerchandiseList.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import SubscribeFormEditPerchase from '~/components/SubscribeFormEditPerchase.vue'

export default {
  components: {
    UiMerchandiseList,
    SubscribeFormEditPerchase,
    UiSubscribeButton,
  },
  props: {
    perchasedPlan: {
      type: Array,
      isRequired: true,
      default: () => {
        return [
          {
            id: 0,
            title: '一年方案',
            detail: '一年鏡週刊52期',
            originalPrice: 3990,
            newPrice: 2800,
            count: 0,
          },
          {
            id: 1,
            title: '二年方案',
            detail: '二年鏡週刊104期',
            originalPrice: 7800,
            newPrice: 5200,
            count: 0,
          },
        ]
      },
    },
    discount: {
      type: Object,
      isRequired: true,
      default: () => {
        return {
          hasCode: false,
          code: '',
        }
      },
    },
    setHasCode: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  data() {
    return {
      isInputFocused: false,
      shouldShowDiscountCode: false,
    }
  },
  computed: {
    filteredPerchasedPlan() {
      return this.perchasedPlan.filter((plan) => {
        return plan.count > 0
      })
    },
    isDisabled() {
      return this.discount.code.length !== 5
    },
    buttonTitle() {
      return this.discount.hasCode ? '移除' : '使用'
    },
  },
  methods: {
    toggleIsInputFocused() {
      this.isInputFocused = !this.isInputFocused
    },
    submitDiscountCode() {
      if (this.isDisabled) return
      this.setHasCode(!this.discount.hasCode)
    },
    handleInput(e) {
      this.discount.code = e.target.value.replace(/[^\d]/g, '')
    },
  },
  watch: {
    shouldShowDiscountCode(val) {
      if (!val) this.setHasCode(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.merchandise-list {
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;

  span {
    margin-bottom: 0;
    font-size: 18px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.87);
  }

  &__title {
    display: flex;
    justify-content: space-between;
  }

  .form-row {
    display: flex;
    justify-content: space-between;
    &__head_title {
      flex: 1;

      &:first-child {
        flex: 3;
        max-width: 278px;
      }
    }
  }

  &__discount_code {
    position: relative;
    padding: 12px 0 0px;
    @include media-breakpoint-up(md) {
      align-items: flex-start;
      padding: 28px 0 61px;
    }

    &_row {
      margin-bottom: 8px;
      width: 100%;

      &:first-child {
        display: flex;
        align-items: center;
      }
    }

    &_check {
      margin-right: 48px;
      display: flex;
      align-items: center;
    }

    &_prompt {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #064f77;
    }

    &_info {
      font-family: 'Noto Sans TC';
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 150%;
      color: rgba(0, 0, 0, 0.66);
    }

    &_input {
      display: flex;
      align-items: center;
      width: 200px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.3);
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.87);
      padding-left: 12px;
      margin-right: 8px;
      border-radius: 2px;

      &.disabled {
        background: #e3e3e3;
        border: 1px solid rgba(0, 0, 0, 0.3);
        color: rgba(0, 0, 0, 0.2);
      }

      input[type='text'] {
        border: 0px;
        &:focus {
          border: 0;
        }
        &:disabled {
          border: 0;
          color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .input {
    position: relative;
    align-self: flex-start;
    display: flex;
    height: 48px;
    padding: 12px;
    border-radius: 2px;
    align-items: center;

    .focus {
      border: 1px solid rgba(0, 0, 0, 0.87);
    }

    .subcribe-button {
      width: 72px;
      height: 48px;
      padding: 12px;
      &.disabled {
        cursor: auto;
        background: #e3e3e3;
        color: rgba(0, 0, 0, 0.2);
      }
      &.remove {
        background: #ffffff;
        border: 1px solid #054f77;
        color: #054f77;
        &:hover {
          background: linear-gradient(
              0deg,
              rgba(5, 79, 119, 0.05),
              rgba(5, 79, 119, 0.05)
            ),
            #ffffff;
        }
        &:active {
          background: linear-gradient(
              0deg,
              rgba(5, 79, 119, 0.1),
              rgba(5, 79, 119, 0.1)
            ),
            #ffffff;
        }
      }
    }
  }
}
</style>
