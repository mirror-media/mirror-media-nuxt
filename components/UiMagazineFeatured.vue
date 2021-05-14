<template>
  <div class="featured">
    <div class="featured__cover-wrapper cover-wrapper">
      <img class="cover-img" :src="coverImgUrl" alt="magazine-cover-img" />
    </div>
    <div class="featured__info-wrapper info-wrapper">
      <div
        class="info-wrapper__title-description-wrapper title-description-wrapper"
      >
        <p class="label" v-text="label" />
        <h1 class="title-description-wrapper__title title" v-text="title" />
      </div>
      <UiMagazineLinkPrimary
        class="info-wrapper__download-link download-link"
        :href="downloadLink"
        target="_blank"
        rel="noreferrer noopener"
        @click.native="$emit('downloadLinkClick')"
      >
        立即下載
      </UiMagazineLinkPrimary>
    </div>
  </div>
</template>

<script>
import UiMagazineLinkPrimary from './UiMagazineLinkPrimary.vue'

export default {
  components: { UiMagazineLinkPrimary },
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
.featured {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #9b9b9b;
  border-radius: 2px;
  width: 100%;
  padding: 16px 12px;
  @include media-breakpoint-up(md) {
    flex-direction: row;
    align-items: flex-start;
    padding: 24px;
  }
  @include media-breakpoint-up(xl) {
    width: 840px;
  }

  &__info-wrapper {
    margin: 12px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 32px;
    }
  }
}

.cover-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 160px;
  width: 55%;
  position: relative;
  padding-bottom: 75.47%;
  height: 0;
  @include media-breakpoint-up(md) {
    width: 160px;
    height: 212px;
    padding-bottom: 0;
  }
  @include media-breakpoint-up(xl) {
    min-width: 200px;
    width: 200px;
    height: 265px;
  }
}

.cover-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @include media-breakpoint-up(md) {
    height: 212px;
    justify-content: space-between;
    align-items: flex-start;
  }
  @include media-breakpoint-up(xl) {
    height: 265px;
  }

  &__download-link {
    margin: 12px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 0;
    }
  }
}

.title-description-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include media-breakpoint-up(md) {
    align-items: flex-start;
  }

  &__title {
    margin: 8px 0 0 0;
  }
}

.label {
  font-size: 16px;
  line-height: 150%;
  color: #1d9fb8;
}

.title {
  font-size: 22px;
  line-height: 31px;
  font-weight: 400;
  color: #4a4a4a;
  text-align: center;
  @include media-breakpoint-up(md) {
    text-align: left;
  }
}
</style>
