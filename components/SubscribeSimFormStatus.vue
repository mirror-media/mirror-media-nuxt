<template>
  <div class="sim">
    <div class="sim__input">
      <input type="checkbox" :checked="validateOn" @change="setValidateOn" />
      <span>validate field</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="success"
        @change="changeHandler"
      />
      <span>success</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="order-fail"
        @change="changeHandler"
      />
      <span>order-fail</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="payment-fail"
        @change="changeHandler"
      />
      <span>payment-fail</span>
    </div>

    <button @click="clickHandler">Skip Payment</button>
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
  },
  data() {
    return {
      simOrderStatus: 'success',
    }
  },
  methods: {
    changeHandler(e) {
      this.simOrderStatus = e.target.value
    },
    clickHandler(e) {
      if (this.simOrderStatus === 'success') {
        this.$store.dispatch('subscribe/updateOrderInfo', {
          pur_name: 'test name',
        })
      }
      this.$store.dispatch('subscribe/updateResultStatus', this.simOrderStatus)

      this.$router.push('/subscribe/result')
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
