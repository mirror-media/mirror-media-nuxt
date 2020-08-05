<template>
  <section class="intro">
    <picture>
      <source
        :srcset="imageLandscapeDesktop"
        media="(min-width: 768px) and (orientation: landscape)"
        type="image/jpeg"
      />
      <source
        :srcset="imagePortraitDesktop"
        media="(min-width: 768px) and (orientation: portrait)"
        type="image/jpeg"
      />
      <source
        :srcset="imageLandscapeDesktop"
        media="(max-width: 767px) and (orientation: landscape)"
        type="image/jpeg"
      />
      <img v-lazy="imagePortraitMobile" :alt="titleWithoutBreakLine" />
    </picture>
    <div class="intro__gradient" />
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
          <span v-if="post.extendByline" v-text="post.extendByline" />
        </div>
      </div>
      <div class="intro__brief" v-html="post.brief" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'UICulturePostIntro',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageLandscapeDesktop() {
      return this.post.heroImage?.desktop?.url
    },
    imagePortraitDesktop() {
      return (
        this.post.mobileImage?.desktop?.url || this.post.heroImage?.desktop?.url
      )
    },
    imagePortraitMobile() {
      return (
        this.post.mobileImage?.mobile?.url || this.post.heroImage?.mobile?.url
      )
    },
    titleWithoutBreakLine() {
      return this.post.title?.replace(/<br>/g, '')
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
    padding: 0;
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
      object-position: 50% bottom;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% center;
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
    font-size: 46px;
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
    line-height: normal;
    @include media-breakpoint-up(md) {
      width: 300px;
      >>> br {
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
  >>> p {
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
      color: rgba(0, 0, 0, 0.66);
      font-size: 13px;
      line-height: 1.5;
    }
  }
  &__credit {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    span {
      margin: 0 2em 0 0;
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
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 35%,
      rgba(255, 255, 255, 1) 80%
    );
    @include media-breakpoint-up(md) {
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 35%,
        rgba(255, 255, 255, 1) 95%
      );
    }
  }
}
</style>
