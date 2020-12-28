<template>
  <button @click="handleClick">
    <SvgFacebookIcon />
    <span>使用 Facebook 帳號登入</span>
  </button>
</template>

<script>
import localforage from 'localforage'
import SvgFacebookIcon from '~/assets/membership-facebook-icon.svg?inline'

export default {
  components: {
    SvgFacebookIcon,
  },
  methods: {
    async handleClick() {
      await localforage.setItem(
        'mm-login-destination',
        this.$route.query.destination ?? '/'
      )
      const provider = new this.$fireModule.auth.FacebookAuthProvider()
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
