<template>
  <div class="sim">
    <div class="sim__input">
      <input
        v-model="simMembershipStatus"
        type="radio"
        value="not-at-all"
        @change="changeHandler"
      />
      <span>無訂閱紀錄</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simMembershipStatus"
        type="radio"
        value="single-post"
        @change="changeHandler"
      />
      <span>basic單篇</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simMembershipStatus"
        type="radio"
        value="month"
        @change="changeHandler"
      />
      <span>月訂閱</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simMembershipStatus"
        type="radio"
        value="year"
        @change="changeHandler"
      />
      <span>年訂閱</span>
    </div>
    <div class="sim__input">
      <input
        v-model="simMembershipStatus"
        type="radio"
        value="disturb"
        @change="changeHandler"
      />
      <span>中斷訂閱</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    memberShipStatus: {
      type: Boolean,
      isRequired: true,
      default: true,
    },
  },
  data() {
    return {
      simMembershipStatus: this.memberShipStatus,
    }
  },
  methods: {
    changeHandler(e) {
      this.$emit('change-status', e.target.value)
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
}
</style>
