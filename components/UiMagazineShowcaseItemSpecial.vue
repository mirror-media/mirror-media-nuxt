<template>
  <a
    :href="downloadLink"
    target="_blank"
    class="magazine"
    @click="$emit('downloadLinkClick')"
  >
    <UiMagazineShowcaseItemCoverImgSpecial :coverImgUrl="coverImgUrl" />
    <p class="magazine__label label" v-text="label" />
    <h1 class="magazine__title title" v-text="title" />
  </a>
</template>

<script>
import UiMagazineShowcaseItemCoverImgSpecial from './UiMagazineShowcaseItemCoverImgSpecial.vue'
export default {
  components: { UiMagazineShowcaseItemCoverImgSpecial },
  props: {
    coverImgUrl: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    downloadLink: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.magazine {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__label {
    margin: 12px 0 0 0;
  }
  &__title {
    margin: 2px 0 0 0;
  }
}
.cover-img {
  width: 132px;
  min-width: 132px;
  height: 178px;
  min-height: 178px;
  object-fit: cover;
  @include media-breakpoint-up(md) {
    width: 144px;
    min-width: 144px;
    height: 194px;
    min-height: 194px;
  }
}
.label {
  font-size: 16px;
  color: #1d9fb8;
}
.title {
  font-size: 20px;
  font-weight: 400;
  color: #4a4a4a;
  text-align: center;
}
</style>
