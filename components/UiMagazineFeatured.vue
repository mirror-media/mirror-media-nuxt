<template>
  <div class="featured">
    <div class="featured__cover-wrapper cover-wrapper">
      <img class="cover-img" :src="coverImgUrl" alt="magazine-cover-img" />
      <a
        :href="downloadLink"
        target="_blank"
        class="cover-wrapper__download-link download-link desktop"
      >
        立即下載
      </a>
    </div>
    <div class="featured__info-wrapper info-wrapper">
      <p class="label" v-text="label" />
      <h1 class="info-wrapper__title title" v-text="title" />
      <div
        class="info-wrapper__description-wrapper description-wrapper desktop"
      >
        <p
          v-for="(description, i) in descriptions"
          :key="`${description}-${i}`"
          class="description"
          v-text="description"
        />
      </div>
      <a
        :href="downloadLink"
        target="_blank"
        class="info-wrapper__download-link download-link mobile"
      >
        立即下載
      </a>
    </div>
  </div>
</template>

<script>
export default {
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
    descriptions: {
      type: Array,
      default: () => [],
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
  &__info-wrapper {
    margin: 10px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 30px;
    }
  }
  @include media-breakpoint-up(md) {
    width: 672px;
    flex-direction: row;
    align-items: flex-start;
  }
}

.cover-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 160px;
  width: 160px;
  &__download-link {
    margin: 16px 0 0 0;
  }
  @include media-breakpoint-up(xl) {
    min-width: 240px;
    width: 240px;
  }
}

.cover-img {
  width: 100%;
  height: 212px;
  object-fit: cover;
  @include media-breakpoint-up(xl) {
    height: 318px;
  }
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin: 10px 0 0 0;
  }
  &__description-wrapper {
    margin: 16px 0 0 0;
  }
  &__download-link {
    margin: 10px 0 0 0;
  }
  @include media-breakpoint-up(md) {
    align-items: flex-start;
  }
}

.label {
  font-size: 16px;
  color: #1d9fb8;
}

.title {
  font-size: 22px;
  font-weight: 400;
  color: #4a4a4a;
  text-align: center;
  @include media-breakpoint-up(md) {
    text-align: left;
  }
}

.description-wrapper {
  flex-direction: column;
}

.description {
  font-size: 16px;
  color: #9b9b9b;
  & + & {
    margin: 16px 0 0 0;
  }
}

.download-link {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  width: 100%;
  height: 48px;
  background: #1d9fb8;
  border-radius: 2px;
  &:hover,
  &:active {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.5),
        rgba(5, 79, 119, 0.5)
      ),
      #1d9fb8;
  }
}

.mobile {
  display: flex;
  @include media-breakpoint-up(md) {
    display: none;
  }
}
.desktop {
  display: none;
  @include media-breakpoint-up(md) {
    display: flex;
  }
}
</style>
