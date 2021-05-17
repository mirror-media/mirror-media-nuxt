<template>
  <div class="merchandise-list">
    <div class="merchandise-list__form_head form-row">
      <div class="form-row__head_title">品名</div>
      <div class="form-row__head_title">數量</div>
      <div class="form-row__head_title">單價</div>
    </div>

    <div class="merchandise-list__form_devider" />

    <div
      v-for="perchased in filteredPerchasedPlan"
      :key="perchased.id"
      class="merchandise-list__form_content form-row"
    >
      <div class="form-row__head_title">{{ perchased.detail }}</div>
      <div class="form-row__head_title">
        <input type="number" min="1" max="9" v-model="perchased.count" />
      </div>
      <div class="form-row__head_title">NT${{ perchased.newPrice }}</div>
    </div>

    <div class="merchandise-list__discount_code">
      <div class="merchandise-list__discount_code_check">
        <input type="checkbox" name="" v-model="discount.hasCode" />
        <span>我有續訂折扣碼</span>
      </div>
      <div class="merchandise-list__discount_code_input">
        <input type="text" v-model="discount.code" placeholder="MI00000000" />
        <p>折扣80元、加購1期</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    perchasedPlan: {
      type: Array,
      isRequired: true,
      default: () => {
        return [
          {
            id: 0,
            title: '一年方案',
            detail: '一年鏡週刊52期，加購5期方案',
            originalPrice: 3990,
            newPrice: 2880,
            count: 0,
          },
          {
            id: 1,
            title: '二年方案',
            detail: '二年鏡週刊104期，加購10期方案',
            originalPrice: 7800,
            newPrice: 5280,
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
  },
  data() {
    return {}
  },
  computed: {
    filteredPerchasedPlan() {
      return this.perchasedPlan.filter((plan) => {
        return plan.count > 0
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.merchandise-list {
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
  @include media-breakpoint-up(sm) {
  }
  @include media-breakpoint-up(md) {
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
  &__form_head {
    margin-bottom: 13px;
  }

  &__form_devider {
    border: solid 1px #4a4a4a;
    margin-bottom: 18px;
  }

  &__discount_code {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 0 61px;
    @include media-breakpoint-up(md) {
      flex-direction: column;
      align-items: flex-start;
      padding: 28px 0 61px;
    }

    &_check {
      margin-right: 18px;
      @include media-breakpoint-up(md) {
        margin-bottom: 10px;
      }
    }

    &_input {
      position: relative;
      align-self: flex-start;

      &_check {
        margin-right: 18px;
      }

      input {
        padding: 11px 65px 12px 9px;
        border-radius: 4px;
        box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.1);
        background-color: #f5f5f5;
      }
      p {
        position: absolute;
        top: 51px;
        left: 0;
        margin-top: 4px;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #064f77;
      }
    }
  }
}
</style>
