<template>
  <div class="sim">
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="not-member"
        @change="changeHandler"
      />
      <span>not-member</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="basic"
        @change="changeHandler"
      />
      <span>basic</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="month"
        @change="changeHandler"
      />
      <span>month</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simOrderStatus"
        type="radio"
        value="year"
        @change="changeHandler"
      />
      <span>year</span>
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
  },
  data() {
    return {
      simOrderStatus: 'success',
    }
  },
  methods: {
    changeHandler(e) {
      this.$emit('input', e.target.value)
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

  button {
    border: 1px solid black;
    background: lightblue;
    padding: 2px 5px;
    border-radius: 5px;
    margin-top: 5px;
  }
}
</style>
