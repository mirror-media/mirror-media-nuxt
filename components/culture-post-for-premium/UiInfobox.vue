<template>
  <div class="infobox">
    <h1 class="infobox__title" v-text="title" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="infobox__content" v-html="content" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.infobox {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06),
    inset 0px 2px 0px #054f77;
  padding: 20px 24px;
  @include media-breakpoint-up(md) {
    padding: 32px 40px;
  }

  &__title {
    font-weight: bold;
    font-size: 20px;
    line-height: 150%;
    text-align: justify;
    color: #054f77;
  }
  &__content {
    margin: 18px 0 0 0;
    font-size: 16px;
    line-height: 180%;
    text-align: justify;
    color: rgba(0, 0, 0, 0.66);
    ::v-deep {
      p + p {
        margin: 24px 0 0 0;
      }
    }
  }
}
</style>
