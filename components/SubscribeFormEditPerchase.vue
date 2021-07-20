<template>
  <div class="edit-perchase">
    <UiSubscribeButtonSmall title="修改" @click.native="toggleHandler" />
    <div v-if="isToggled" class="edit-perchase__wrapper">
      <div class="edit-perchase__background" @click="toggleHandler" />

      <div class="edit-perchase__dialog">
        <h2 class="subscribe-form__title">訂購項目</h2>
        <UiMerchandiseList
          :perchasedPlan="waitToEdittedPerchasedPlan"
          :showAll="true"
          :class="{ error: bothCountZero || tooManyPlans }"
          :isPopUp="true"
          :setCount="setCount"
        />
        <div class="edit-perchase__dialog_controller">
          <UiSubscribeButton
            :title="`取消`"
            :isColorLight="true"
            @click.native="cancelModification"
          />
          <UiSubscribeButton
            :title="`確認修改`"
            @click.native="acceptModification"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiMerchandiseList from '~/components/UiMerchandiseList.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import UiSubscribeButtonSmall from '~/components/UiSubscribeButtonSmall.vue'
export default {
  components: {
    UiSubscribeButtonSmall,
    UiMerchandiseList,
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
  },

  data() {
    return {
      isToggled: false,
      bothCountZero: false,
      tooManyPlans: false,
      waitToEdittedPerchasedPlan: [
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
      ],
    }
  },
  watch: {
    perchasedPlan: {
      handler(val) {
        this.waitToEdittedPerchasedPlan.forEach((plan, index) => {
          plan.count = val[index]?.count || 0
        })
      },
      immediate: true,
    },
    waitToEdittedPerchasedPlan: {
      handler(val) {
        if (parseInt(val[0].count) === 0 && parseInt(val[1].count) === 0) {
          this.bothCountZero = true
        } else {
          this.bothCountZero = false
        }

        if (parseInt(val[0].count) !== 0 && parseInt(val[1].count) !== 0) {
          this.tooManyPlans = true
        } else {
          this.tooManyPlans = false
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    toggleHandler() {
      this.isToggled = !this.isToggled
    },
    setCount(direction, id) {
      this.waitToEdittedPerchasedPlan.map((plan) => {
        if (plan.id === id) {
          if (direction === 'decrease') {
            if (this.isDisable(plan.id)) return
            return plan.count--
          }
          plan.count++
        }
      })
    },
    cancelModification() {
      this.isToggled = !this.isToggled
    },
    acceptModification() {
      // check if plan count are both zero
      // if yes, then show error

      if (!this.bothCountZero && !this.tooManyPlans) {
        this.waitToEdittedPerchasedPlan.forEach((plan, index) => {
          this.perchasedPlan[index].count = plan.count
        })
        this.isToggled = !this.isToggled
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-perchase {
  &__button {
    cursor: pointer;
    padding: 8px 20px;
    font-size: 15px;
    color: #4a4a4a;
    border-radius: 4px;
    background-color: #f5f5f5;
  }

  &__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    padding: 86px 8px;
  }

  &__background {
    background-color: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  &__dialog {
    position: relative;
    z-index: 1;
    max-width: 610px;
    min-height: 360px;
    margin: auto;
    padding: 27px 17px;
    border-radius: 4px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    @include media-breakpoint-up(sm) {
      padding: 22px 25px;
    }

    .merchandise-list {
      flex: 1;
    }

    &_controller {
      margin-top: auto;
      display: flex;
      justify-content: space-between;

      & > div {
        flex: 1;
        margin-right: 14px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
