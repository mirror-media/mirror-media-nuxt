<template>
  <div class="merchandise-list-detail">
    <div class="merchandise-list-detail__form_head form-row">
      <div class="form-row__head_title">品名</div>
      <div class="form-row__head_title">數量</div>
      <div class="form-row__head_title">單價</div>
    </div>

    <div class="merchandise-list-detail__form_devider" />

    <div
      v-for="perchased in filteredPerchasedPlan"
      :key="perchased.id"
      class="merchandise-list-detail__form_content form-row"
    >
      <div class="form-row__head_title">{{ perchased.detail }}</div>
      <div class="form-row__head_title">
        <input
          v-model="perchased.count"
          type="number"
          :min="showAll ? 0 : 1"
          max="9"
        />
      </div>
      <div class="form-row__head_title">NT${{ perchased.newPrice }}</div>
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
    showAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    filteredPerchasedPlan() {
      if (!this.showAll)
        return this.perchasedPlan.filter((plan) => {
          return plan.count > 0
        })
      else {
        return this.perchasedPlan
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.merchandise-list-detail {
  font-size: 16px;
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
  &__form_content {
    align-items: center;
    @include media-breakpoint-up(sm) {
      font-size: 18px;
    }
  }
  &__form_head {
    margin-bottom: 13px;
  }

  &__form_devider {
    border: 1px solid #00000080;
    margin-bottom: 18px;
  }
}
</style>
