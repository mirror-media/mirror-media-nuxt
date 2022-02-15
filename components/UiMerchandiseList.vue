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
      <div class="form-row__head_title detail">{{ perchased.detail }}</div>
      <div class="form-row__head_title form-row__head_title_count">
        <UiSubscribeCountButton
          type="decrease"
          :isDisable="isDisable(perchased.id)"
          @click.native="handleSetCount(-1)"
        />
        {{ perchased.count }}
        <UiSubscribeCountButton
          type="increase"
          :isDisable="false"
          @click.native="handleSetCount(1)"
        />
      </div>
      <div class="form-row__head_title">
        NT$ {{ perchased.newPrice * perchased.count }}
      </div>
    </div>
  </div>
</template>

<script>
import UiSubscribeCountButton from '~/components/UiSubscribeCountButton.vue'
export default {
  components: {
    UiSubscribeCountButton,
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
    setCount: {
      type: Function,
      default: () => {},
    },
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
  methods: {
    isDisable(id) {
      let total = 0
      let isDisable = false
      this.perchasedPlan.map((plan) => {
        total += plan.count
        if (plan.id === id && plan.count <= 0) {
          isDisable = true
        }
      })
      if (total <= 1) return true
      return isDisable
    },
    handleSetCount(value) {
      this.$emit('setCount', value)
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
    line-height: 32px;

    * {
      align-self: flex-start;
    }

    &__head_title {
      flex: 1;

      &:first-child {
        flex: 1;
        @include media-breakpoint-up(sm) {
          flex: 3;
          max-width: 278px;
        }
      }

      &:nth-child(2) {
        text-align: center;
      }

      &_count {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
  &__form_content {
    align-items: center;
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
    border: 1px solid #00000080;
    margin-bottom: 12px;
  }
}
</style>
