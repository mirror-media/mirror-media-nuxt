<template>
  <div class="merchandise-list-detail" :class="{ pop_up: isPopUp }">
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
          v-show="isPopUp"
          type="decrease"
          :isDisable="isDisable(perchased.id)"
          @click.native="handleSetCount('decrease', perchased.id)"
        />
        {{ perchased.count }}
        <UiSubscribeCountButton
          v-show="isPopUp"
          type="increase"
          :isDisable="false"
          @click.native="handleSetCount('increase', perchased.id)"
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
    isPopUp: {
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
      console.log(this.perchasedPlan)
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
    handleSetCount(direction, id) {
      this.perchasedPlan.map((plan) => {
        if (plan.id === id) {
          if (direction === 'decrease') {
            if (this.isDisable(plan.id)) return
            return this.setCount(id, plan.count - 1)
          }
          this.setCount(id, plan.count + 1)
        }
      })
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
    div + div {
      margin-left: 12px;
    }

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

.pop_up {
  .detail {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .merchandise-list-detail__form_devider {
    margin-bottom: 16px;
    @include media-breakpoint-up(sm) {
      margin-bottom: 15px;
    }
  }

  .form-row {
    &:not(:first-child):not(:last-child) {
      margin-bottom: 21px;
    }

    &__head_title:first-child {
      flex: 1;
      @include media-breakpoint-up(sm) {
        flex: 2;
      }
    }
  }
}
</style>
