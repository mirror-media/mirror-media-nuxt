<template>
  <div
    v-if="isEnabled"
    :class="{
      default: hasDefaultStyle,
      modified: hasModifiedStyle,
      bottom: isAtBottomStyle,
    }"
    class="full-screen-ad ad-cover"
  >
    <div class="full-screen-ad__wrapper">
      <slot />
      <button
        v-if="hasDefaultStyle"
        v-show="isClosedBtnVisible"
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
  name: 'UiFullScreenAd',
  props: {
    hasDefaultStyle: {
      type: Boolean,
      default: false,
    },
    hasModifiedStyle: {
      type: Boolean,
      default: false,
    },
    isClosedBtnVisible: {
      type: Boolean,
      default: false,
    },
    isAtBottomStyle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEnabled: true,
    }
  },
  methods: {
    closeFullScreenAd() {
      this.isEnabled = false
    },
  },
}
</script>

<style lang="scss" scoped>
.full-screen-ad {
  &.default {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1200;
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

  // 因為 GPT Lazy loading 需要知道何時載入的位置，所以預設此樣式來觸發廣告載入
  &.modified {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 1200;
  }
  // 用於render MB_BT 廣告，該廣告位於螢幕下方且高度僅有180px
  &.bottom {
    background-color: transparent;
    top: initial;
    .full-screen-ad__wrapper {
      height: 180px;
    }
  }
  &__btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    padding: 5px;
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 2px 2px 5px #d3d3d3;
    background-color: #d3d3d3;
  }
}
</style>
