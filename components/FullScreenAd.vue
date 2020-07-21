<template>
  <div
    v-if="showFullScreenAd"
    :class="{ default: needDefaultStyle }"
    class="full-screen-ad ad-cover"
  >
    <div class="full-screen-ad__wrapper">
      <slot />
      <button
        v-if="needDefaultStyle"
        v-show="showCloseBtn"
        class="full-screen-ad__btn"
        @click="closeFullScreenAd"
      >
        <img src="~/assets/close_white@2x.png" alt="關閉" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullScreenAd',
  props: {
    needDefaultStyle: {
      type: Boolean,
      default: false,
    },
    showCloseBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showFullScreenAd: true,
    }
  },
  methods: {
    closeFullScreenAd() {
      this.showFullScreenAd = false
    },
  },
}
</script>

<style lang="scss" scoped>
.full-screen-ad {
  @include media-breakpoint-up(md) {
    display: none !important;
  }
  &.default {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.7);
    .full-screen-ad__wrapper {
      position: relative;
      width: 320px;
      height: 480px;
    }
  }
  &__btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    padding: 5px;
    border: 2px solid rgba(255, 255, 255, 0.7);
  }
}
</style>
