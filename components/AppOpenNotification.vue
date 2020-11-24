<template>
  <div v-if="shouldOpenNotification" class="app-open-notification">
    <ClientOnly>
      <div class="app-open-notification-wrapper">
        <p>使用應用程式以獲得最佳閱讀體驗</p>
        <button type="button" @click="openApp">切換至應用程式</button>

        <div class="close" @click="closeNotification">
          <SvgCloseIcon />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import SvgCloseIcon from '~/assets/close-2.svg?inline'

export default {
  name: 'AppOpenNotification',

  components: {
    SvgCloseIcon,
  },

  data() {
    return {
      doesUserClickClose: false,
      shouldDisableClick: false,
    }
  },

  computed: {
    shouldOpenNotification() {
      return !this.$ua.isFromPc() && !this.doesUserClickClose
    },
  },

  methods: {
    closeNotification() {
      this.doesUserClickClose = true
    },
    openApp() {
      if (this.shouldDisableClick) {
        return
      }

      this.shouldDisableClick = true

      setTimeout(
        function openAppStore() {
          this.shouldDisableClick = false

          // 如果網頁頁面不可見，即代表使用者有安裝 APP（因為當前頁面已跳轉到 APP 頁面），此時不需要將網頁頁面導向 APP Store
          if (document.visibilityState === 'hidden') {
            return
          }

          window.location = 'https://mirrormedia.onelink.me/QkJA/32a379ac'
        }.bind(this),

        /**
         * 一個任意但需要仔細考量的數字
         * 太短，visibilityState 尚未改變即觸發計時器，會導致有安裝 APP 的使用者的網頁頁面仍會導向 onelink 頁面
         * 太長，當使用者很快地從 APP 跳回網頁頁面，計時器觸發時 visibilityState 為 visible，網頁頁面仍會導向 onelink 頁面
         */
        1200
      )

      window.location = `mirrormedia://${window.location.pathname.slice(1)}`
    },
  },
}
</script>

<style lang="scss" scoped>
$main-color: #14a7d0;

.app-open-notification {
  color: #fff;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  text-align: center;
  font-size: 15px;
  letter-spacing: 0.6px;
  line-height: 1.47;
  font-weight: 500;
  z-index: 419;
}

.app-open-notification-wrapper {
  background-color: $main-color;
  padding: 16px 24px;
}

p {
  margin-bottom: 12px;
}

button {
  max-width: 480px;
  color: $main-color;
  background-color: #fff;
  padding-top: 8px;
  padding-bottom: 8px;
  width: 100%;
  letter-spacing: 0.6px;
  outline: none;

  &:active {
    background-color: #e1f0f4;
  }
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
}

svg {
  width: 12px;
  height: auto;
}
</style>
