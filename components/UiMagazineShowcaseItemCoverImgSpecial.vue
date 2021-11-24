<template>
  <div
    class="cover-img-wrapper"
    @mouseover="shouldShowDownloadHint = true"
    @mouseout="shouldShowDownloadHint = false"
  >
    <transition name="fade">
      <div
        v-show="shouldShowDownloadHint"
        class="cover-img-wrapper__download-hint download-hint"
      >
        <MagazineDownloadIcon class="download-icon" />
        <p>立即下載</p>
      </div>
    </transition>
    <img
      v-lazy="coverImgUrl"
      class="cover-img-wrapper__cover-img cover-img"
      alt="magazine-cover-img"
    />
  </div>
</template>

<script>
import MagazineDownloadIcon from '~/assets/magazine-download-icon.svg?inline'

export default {
  components: {
    MagazineDownloadIcon,
  },
  props: {
    coverImgUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      shouldShowDownloadHint: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.cover-img-wrapper {
  width: 132px;
  min-width: 132px;
  height: 178px;
  min-height: 178px;
  position: relative;
  @include media-breakpoint-up(md) {
    width: 144px;
    min-width: 144px;
    height: 194px;
    min-height: 194px;
  }

  &__download-hint {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.download-hint {
  pointer-events: none;
  display: none;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(5, 79, 119, 0.87),
    rgba(5, 79, 119, 0.87)
  );
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  p {
    font-size: 15px;
    line-height: 21px;
    color: white;
    margin: 8px 0 0 0;
  }
}

.download-icon {
  height: 38px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
