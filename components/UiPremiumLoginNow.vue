<template>
  <p class="login-now-wrapper">
    <span>已經是會員了？</span>
    <button
      role="link"
      class="login-now-wrapper__login-now login-now"
      @click.prevent="$emit('login')"
    >
      立即登入
    </button>
  </p>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.login-now-wrapper {
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: #9b9b9b;
}

.login-now {
  border-bottom: 1px solid #9b9b9b;
  &:hover {
    color: #4a4a4a;
    border-bottom: 1px solid #4a4a4a;
  }
}
</style>
