<template>
  <div :class="`align-${textPositionInXLViewport}`" class="linked-item">
    <a
      :href="href"
      class="linked-item__image"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img v-lazy="imgSrc" :alt="title" />
    </a>
    <a
      :href="href"
      class="linked-item__title"
      target="_blank"
      rel="noopener noreferrer"
      v-text="title"
    />
  </div>
</template>
<script>
export default {
  name: 'UILinkedItemWithTitle',
  props: {
    imgSrc: {
      type: String,
      default: require('~/assets/notImage.png'),
      required: true,
    },
    href: {
      type: String,
      default: '/',
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    textPositionInXLViewport: {
      type: String,
      default: 'bottom',
      validator: (value) => ['right', 'bottom'].includes(value),
    },
  },
}
</script>
<style lang="scss" scoped>
.linked-item {
  @include media-breakpoint-up(xl) {
    &.align-right {
      display: flex;
      align-items: flex-start;
      .linked-item__image {
        width: 150px;
        padding-top: calc(150px * 0.5625);
      }
      .linked-item__title {
        flex: 1;
        margin: 0 0 0 10px;
      }
    }
  }
  &__image {
    position: relative;
    display: block;
    padding-top: 56.25%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  &__title {
    display: block;
    color: #4a4a4a;
    font-size: 14px;
    margin-top: 5px;
    @include media-breakpoint-up(xl) {
      text-align: justify;
    }
  }
}
</style>
