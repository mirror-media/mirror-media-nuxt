<template>
  <picture class="banner">
    <source
      media="(min-width: 1200px)"
      type="image/webp"
      srcset="~/assets/membership-banner-login-xl.webp"
    />
    <source
      media="(min-width: 1200px)"
      type="image/jpeg"
      srcset="~/assets/membership-banner-login-xl.jpg"
    />

    <source
      media="(min-width: 768px)"
      type="image/webp"
      srcset="~/assets/membership-banner-login-md.webp"
    />
    <source
      media="(min-width: 768px)"
      type="image/jpeg"
      srcset="~/assets/membership-banner-login-md.jpg"
    />

    <source type="image/webp" srcset="~/assets/membership-banner-login.webp" />
    <img src="~/assets/membership-banner-login.jpg" alt="" />
  </picture>
</template>

<style lang="scss" scoped>
.banner {
  display: block;
  margin-bottom: 48px;
  @include media-breakpoint-up(xl) {
    margin-bottom: 60px;
  }

  img {
    width: 100%;
    height: auto;
  }
}
</style>
