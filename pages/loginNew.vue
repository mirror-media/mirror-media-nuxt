<template>
  <section class="login">
    <UiLoginBanner />
    <div class="container">
      <UiLoginIntro />
    </div>
    <div class="container container--form">
      <ContainerLoginForm />
    </div>
  </section>
</template>

<script>
import UiLoginBanner from '~/components/UiLoginBanner.vue'
import UiLoginIntro from '~/components/UiLoginIntro.vue'
import ContainerLoginForm from '~/components/ContainerLoginForm.vue'

export default {
  components: {
    UiLoginBanner,
    UiLoginIntro,
    ContainerLoginForm,
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &--form {
    padding: 24px 8px 48px;
    @include media-breakpoint-up(md) {
      padding: 0 0 48px 0;
    }
    @include media-breakpoint-up(xl) {
      padding: 0 0 60px 0;
    }
  }
}
</style>
