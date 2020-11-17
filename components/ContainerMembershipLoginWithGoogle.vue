<template>
  <button @click="handleClick">
    <SvgGoogleIcon />
    <span>使用 Google 帳號登入</span>
  </button>
</template>

<script>
import SvgGoogleIcon from '~/assets/membership-google-icon.svg?inline'

export default {
  components: {
    SvgGoogleIcon,
  },
  methods: {
    handleClick() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider()
      this.$fire.auth.signInWithRedirect(provider)
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  border: 2px solid #4a4a4a;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #9b9b9b;
  span {
    margin: 0 0 0 10px;
  }
}
</style>
