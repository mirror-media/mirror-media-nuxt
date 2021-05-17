<template>
  <div class="edit-perchase">
    <div class="edit-perchase__button" @click="toggleHandler">修改</div>

    <div v-if="isToggled" class="edit-perchase__wrapper">
      <div class="edit-perchase__background" @click="toggleHandler" />

      <div class="edit-perchase__dialog">
        <h2 class="subscribe-form__title">訂購項目</h2>
        <UiMerchandiseList :perchasedPlan="perchasedPlan" :showAll="true" />
      </div>
    </div>
  </div>
</template>

<script>
import UiMerchandiseList from '~/components/UiMerchandiseList.vue'
export default {
  components: {
    UiMerchandiseList,
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
    }
  },

  methods: {
    toggleHandler() {
      this.isToggled = !this.isToggled
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
    @include media-breakpoint-up(sm) {
      padding: 22px 25px;
    }
  }
}
</style>
