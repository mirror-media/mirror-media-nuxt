<template>
  <div class="membership-list-detail">
    <div class="membership-list-detail__form_head form-row">
      <div class="form-row__head_title">品名</div>
      <div class="form-row__head_title">單價</div>
    </div>

    <div class="membership-list-detail__form_devider" />

    <div
      v-for="perchased in perchasedPlan"
      :key="perchased.id"
      class="membership-list-detail__form_content form-row"
    >
      <div class="form-row__head_title detail">{{ perchased.detail }}</div>
      <div class="form-row__head_title price">
        <div>NT$ {{ perchased.newPrice }}</div>
        <div>
          <span>{{ perchased.price }}</span>
        </div>
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
            id: 1,
            detail: '鏡週刊 Premium 會員 (月方案)',
            price: '原價 NT$99',
            newPrice: 49,
          },
        ]
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.membership-list-detail {
  font-size: 16px;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.87);

  .form-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    &__head_title {
      flex: 2;

      &:first-child {
        flex: 3;
        @include media-breakpoint-up(sm) {
          max-width: 278px;
        }
      }

      &:nth-child(2) {
        text-align: right;
      }
    }

    .price {
      @include media-breakpoint-up(sm) {
        display: flex;
        justify-content: flex-start;
        flex-direction: row-reverse;
        gap: 4px;
      }

      span {
        position: relative;

        &::after {
          position: absolute;
          content: '';
          width: 100%;
          border-bottom: 1.5px solid rgba(0, 0, 0, 0.66);
          top: 60%;
          right: 0;
        }
      }
    }
  }

  &__form_content {
    &:not:not(:first-child):not(:last-child) {
      margin-bottom: 16px;
    }
    @include media-breakpoint-up(sm) {
      font-size: 18px;
    }
  }

  &__form_head {
    margin-bottom: 12px;
  }

  &__form_devider {
    border: 1px solid rgba(0, 0, 0, 0.5);
    margin-bottom: 12px;
  }
}
</style>
