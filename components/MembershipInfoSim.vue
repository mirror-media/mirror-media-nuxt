<template>
  <div class="sim">
    <div class="sim__input">
      <p>驗收時請先關閉表單驗證，以利快速驗收</p>
      <input type="checkbox" :checked="validateOn" @change="setValidateOn" />
      <span>validate field</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="success"
        @change="setOrderStatus('success')"
      />
      <span>success</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="fail"
        @change="setOrderStatus('fail')"
      />
      <span>fail</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    orderStatus: {
      type: String,
      isRequired: true,
      default: 'success',
    },
    setOrderStatus: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  data() {
    return {
      simOrderStatus: this.orderStatus,
    }
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
  border: 1px solid black;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;

  .sim__input:nth-child(2) {
    margin-top: 15px;
  }

  button {
    border: 1px solid black;
    background: lightblue;
    padding: 2px 5px;
    border-radius: 5px;
    margin-top: 5px;
  }
}
</style>
