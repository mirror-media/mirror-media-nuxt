<template>
  <div class="sim">
    <div>
      <button @click="clickHandler">
        {{ isPayByApp ? 'Pay by web' : 'Pay by app' }}
      </button>
    </div>
    <div class="sim__input">
      <input
        v-model="cancelStatus"
        type="radio"
        value="success"
        @change="changeHandler"
      />
      <span>success</span>
    </div>
    <div class="sim__input">
      <input
        v-model="cancelStatus"
        type="radio"
        value="fail"
        @change="changeHandler"
      />
      <span>order-fail</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isPayByApp: {
      type: Boolean,
      isRequired: true,
      default: false,
    },
    cancelStatus: {
      type: String,
      isRequire: true,
      default: 'success',
    },
    setIsPayByApp: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
    setCancelStatus: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  methods: {
    changeHandler(e) {
      this.setCancelStatus(e.target.value)
    },
    clickHandler() {
      this.setIsPayByApp(!this.isPayByApp)
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
