<template>
  <section class="page">
    <div class="wrapper">
      <h1 class="title">登入</h1>
      <form class="page__form form" @submit.prevent>
        <UIMembershipEmailInput />
        <button class="form__login-button login-button">登入</button>
      </form>
    </div>
  </section>
</template>

<script>
import UIMembershipEmailInput from '~/components/UIMembershipEmailInput.vue'

export default {
  components: {
    UIMembershipEmailInput,
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 0 20px;
  min-height: calc(100vh - 118px);
  display: flex;
  align-items: center;
  &__form {
    margin: 20px 0 0 0;
  }
}

.wrapper {
  width: 100%;
  @include media-breakpoint-up(xl) {
    width: 300px;
    margin: 0 auto;
  }
}

.title {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  color: #054f77;
}

.form {
  &__login-button {
    margin: 20px 0 0 0;
  }
}
.login-button {
  background-color: #054f77;
  width: 100%;
  text-align: center;
  font-weight: 900;
  color: white;
  height: 30px;
}
</style>
