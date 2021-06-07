<template>
  <div class="sim">
    <div class="sim__input">
      <input type="checkbox" :checked="validateOn" @change="setValidateOn" />
      <span>validate field</span>
    </div>
    <div class="sim__input">
      <input
        type="radio"
        v-model="simOrderStatus"
        value="success"
        @change="changeHandler"
      />
      <span>success</span>
    </div>
    <div class="sim__input">
      <input
        type="radio"
        v-model="simOrderStatus"
        value="order-fail"
        @change="changeHandler"
      />
      <span>order-fail</span>
    </div>
    <div class="sim__input">
      <input
        type="radio"
        v-model="simOrderStatus"
        value="payment-fail"
        @change="changeHandler"
      />
      <span>payment-fail</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    setSimOrderStatus: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
    validateOn: {
      type: Boolean,
      isRequired: true,
      default: true,
    },
    setValidateOn: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  data() {
    return {
      simOrderStatus: 'success',
    }
  },
  methods: {
    changeHandler(e) {
      this.setSimOrderStatus(e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.sim {
  z-index: 9999;
  position: fixed;
  top: 100px;
  right: 0;
  padding: 20px;
  border: 1px solid red;
  background: white;
  border-radius: 5px;
}
</style>
