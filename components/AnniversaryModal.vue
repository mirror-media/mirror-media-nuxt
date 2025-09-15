<template>
  <div
    v-if="isModalOpen"
    class="anniversary-modal"
    @click="handleBackgroundClick"
  >
    <div class="anniversary-modal__container" @click="handleContainerClick">
      <button
        v-if="!isSubscribe"
        class="anniversary-modal__close-btn"
        @click="handleCloseClick"
      >
        <span class="anniversary-modal__close-btn-icon"></span>
      </button>

      <div class="anniversary-modal__content">
        <div class="anniversary-modal__title">
          <p v-for="title in wordings.title" :key="title">
            {{ title }}
          </p>
        </div>

        <div class="anniversary-modal__time">
          {{ wordings.time }}
        </div>
        <a v-if="isSubscribe" class="anniversary-modal__home-btn" href="/">
          <span>回首頁</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnniversaryModal',

  props: {
    isSubscribe: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isModalOpen: false,
      wordings: {
        title: ['鏡週刊 10 週年慶 🎉', '📣 全站文章、獨家新聞全網免費閱讀'],
        time: '活動期間：2025/10/1 — 2025/12/31',
      },
    }
  },

  mounted() {
    this.checkModalStatus()
  },

  beforeDestroy() {
    this.enableScroll()
  },

  methods: {
    getCookie(name) {
      if (typeof document === 'undefined' || this.isSubscribe) return null
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    },

    setCookie(name, value, days = 365) {
      if (typeof document === 'undefined' || this.isSubscribe) return
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
    },

    checkModalStatus() {
      const hasSeenModal = this.getCookie('anniversary_modal_seen')
      if (!this.isSubscribe) {
        if (!hasSeenModal) {
          this.isModalOpen = true
          this.disableScroll()
        }
      } else if (this.$config.anniversaryPromoFeatureToggle) {
        this.isModalOpen = true
        this.disableScroll()
      }
    },
    disableScroll() {
      if (typeof document === 'undefined') return
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    },

    enableScroll() {
      if (typeof document === 'undefined') return
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    },

    handleCloseClick() {
      this.isModalOpen = false
      this.enableScroll()
      if (!this.isSubscribe) {
        this.setCookie('anniversary_modal_seen', 'true', 365)
      }
    },

    handleBackgroundClick() {
      if (!this.isSubscribe) {
        this.handleCloseClick()
      }
    },

    handleContainerClick(e) {
      e.stopPropagation()
    },
  },
}
</script>

<style lang="scss" scoped>
.anniversary-modal {
  background: rgba(0, 0, 0, 0.6);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200; // 使用專案中常見的 z-index 值
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    background: white;
    display: flex;
    padding: 40px 8px 32px 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    max-width: 280px;
    position: relative;

    @include media-breakpoint-up(md) {
      max-width: 440px;
      padding: 40px 20px 32px 20px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__title {
    color: #000;
    text-align: center;
    font-family: 'PingFang TC', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, sans-serif;
    font-size: 18px;
    font-weight: 500;
    line-height: 150%;

    p {
      margin: 0;

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  &__time {
    color: #e51731;
    text-align: center;
    font-family: 'PingFang TC', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 150%;
  }

  &__home-btn {
    padding-top: 10px;
    display: block;
    color: #fff;
    text-decoration: none;
    border: none;
    border-radius: 8px;
    background: #054f77;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    width: 280px;
    height: 40px;
    padding: 12px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    text-align: center;
    font-family: 'PingFang TC';
    font-size: 18px;
    font-weight: 500;
    line-height: 150%;
    &:focus {
      outline: none;
    }
  }

  &__close-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    background: #054f77;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;

    &:hover {
      background: #043a5a;

      .anniversary-modal__close-btn-icon {
        background: rgba(255, 255, 255, 0.5);
      }
    }

    &:focus {
      outline: none;
    }

    &-icon {
      position: relative;
      width: 16px;
      height: 2px;
      background: white;
      border-radius: 1px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 2px;
        background: white;
        border-radius: 1px;
        transition: background-color 0.2s ease;
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
