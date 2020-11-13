<template>
  <section class="intro">
    <picture>
      <source
        :srcset="imgLandscapeDesktop"
        media="(min-width: 768px) and (orientation: landscape)"
        type="image/jpeg"
      />
      <source
        :srcset="imgPortraitDesktop"
        media="(min-width: 768px) and (orientation: portrait)"
        type="image/jpeg"
      />
      <source
        :srcset="imgLandscapeDesktop"
        media="(max-width: 767px) and (orientation: landscape)"
        type="image/jpeg"
      />
      <img :src="imgPortraitMobile" alt="" />
    </picture>

    <div class="intro__gradient" />

    <!-- eslint-disable-next-line vue/no-v-html -->
    <h1 :style="{ color: `#${post.titleColor}` }" v-html="post.title" />

    <div class="intro__container">
      <div class="intro__datetime-credit">
        <p>發布時間 / {{ post.publishedDate }}</p>

        <div class="intro__credit">
          <span v-if="post.writers"> 記者 / {{ post.writers }} </span>
          <span v-if="post.photographers">
            攝影 / {{ post.photographers }}
          </span>
          <span v-if="post.cameraMan"> 影音 / {{ post.cameraMan }} </span>
          <span v-if="post.extendByline">{{ post.extendByline }}</span>
        </div>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="intro__brief" v-html="post.brief" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'UiCulturePostIntro',

  props: {
    post: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },

  computed: {
    imgLandscapeDesktop() {
      return this.post.heroImage?.desktop?.url
    },
    imgPortraitDesktop() {
      return this.post.mobileImage?.desktop?.url || this.imgLandscapeDesktop
    },
    imgPortraitMobile() {
      return (
        this.post.mobileImage?.mobile?.url || this.post.heroImage?.mobile?.url
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.intro {
  position: relative;
  padding: 94px calc((100% - 266px) / 2) 50px;
  @include media-breakpoint-up(md) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 700px;
    padding: 0 120px 0;
  }
  @include media-breakpoint-up(lg) {
    min-height: 900px;
    padding-left: 0;
    padding-right: 0;
  }

  picture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    width: 100%;
    height: 80%;
    @include media-breakpoint-up(md) {
      height: 100%;
    }
    @include media-breakpoint-up(xl) {
      z-index: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h1,
  .intro__container {
    position: relative;
    z-index: 0;
    @include media-breakpoint-up(lg) {
      left: 15%;
    }
  }

  h1 {
    width: 200px;
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-size: 46px;
    font-weight: 900;
    line-height: normal;
    @include media-breakpoint-up(md) {
      width: 300px;

      &::v-deep br {
        display: none;
      }
    }
    @include media-breakpoint-up(lg) {
      width: auto;
      max-width: 634px;
      font-size: 66px;
      line-height: 1.27;
    }
  }

  &::v-deep p {
    text-align: justify;
    @include media-breakpoint-up(lg) {
      font-size: 18px;
    }
  }

  &__container {
    margin-top: 60px;
    @include media-breakpoint-up(md) {
      max-width: 300px;
    }
    @include media-breakpoint-up(lg) {
      display: flex;
      flex-direction: column;
      max-width: 500px;
      margin-top: 47px;
    }
    @include media-breakpoint-up(xl) {
      max-width: 634px;
    }
  }

  &__datetime-credit {
    @include media-breakpoint-up(lg) {
      order: 2;
      margin-top: 40px;
    }

    p,
    span {
      color: rgba(#000, 0.66);
      font-size: 13px;
      line-height: 1.5;
    }
  }

  &__credit {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    span {
      margin-right: 2em;
    }
  }

  &__brief {
    margin-top: 40px;
    @include media-breakpoint-up(md) {
      margin-top: 20px;
    }
    @include media-breakpoint-up(lg) {
      order: 1;
      margin-top: 0;
    }

    &::v-deep p {
      line-height: 2;

      + p {
        margin-top: 2em;
      }
    }
  }

  &__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background: linear-gradient(
      to bottom,
      rgba(#fff, 0) 0%,
      rgba(#fff, 0) 35%,
      rgba(#fff, 1) 80%
    );
    @include media-breakpoint-up(md) {
      background: linear-gradient(
        to bottom,
        rgba(#fff, 0) 0%,
        rgba(#fff, 0) 35%,
        rgba(#fff, 1) 95%
      );
    }
  }
}
</style>
