<template>
  <div class="wrapper">
    <h1 class="wrapper__title title">刪除錯誤</h1>
    <div class="wrapper__description description">
      <p class="description__paragraph">請重新登入，或是聯繫客服</p>
      <p class="description__paragraph description__paragraph--blue">
        mm-onlineservice@mirrormedia.mg
      </p>
      <p class="description__paragraph">(02)6633-3966</p>
      <p class="description__paragraph">我們將有專人為你服務</p>

      <div v-if="isNeededToShowDetail" class="description__detail">
        <p class="description__detail_paragraph">{{ getErrorTitleText }}</p>
        <p class="description__detail_paragraph">{{ getErrorDetailText }}</p>
      </div>
    </div>
    <div class="wrapper__button-wrapper button-wrapper">
      <a href="/" class="back-to-home-button">回首頁</a>
    </div>
  </div>
</template>

<script>
import {
  CERTIFICATE_FETCH_FAILED,
  EXPIRED_ID_TOKEN,
  INVALID_ID_TOKEN,
  REVOKED_ID_TOKEN,
  USER_NOT_FOUND,
} from '~/constants/authErr'

export default {
  props: {
    errorResponse: {
      type: Error,
      isRequired: true,
      default: () => {
        return new Error([{ message: CERTIFICATE_FETCH_FAILED }])
      },
    },
  },
  computed: {
    isNeededToShowDetail() {
      const errorMessage = this.errorResponse.message
      if (errorMessage === CERTIFICATE_FETCH_FAILED) {
        return false
      } else {
        return true
      }
    },
    getErrorDetailText() {
      return this.errorResponse.message
    },
    getErrorTitleText() {
      if (this.isErrMessageHasKeyword(EXPIRED_ID_TOKEN)) {
        return '登入逾時，刪除失敗'
      } else if (this.isErrMessageHasKeyword(INVALID_ID_TOKEN)) {
        return '登入無效，刪除失敗'
      } else if (this.isErrMessageHasKeyword(REVOKED_ID_TOKEN)) {
        return '尚未登入，刪除失敗'
      } else if (this.isErrMessageHasKeyword(USER_NOT_FOUND)) {
        return '查無使用者資料，刪除失敗'
      } else {
        return '刪除失敗'
      }
    },
  },
  methods: {
    handleBackToForm() {
      this.$emit('backToForm')
    },
    isErrMessageHasKeyword(keyword) {
      /*
       * mainString.match(substring)!==null: mainString contains substring
       */
      const mainString = this.errorResponse.message
      return mainString.match(keyword) !== null
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 240px;
  padding: 40px 20px;
  &__description,
  &__button-wrapper {
    margin: 40px 0 0 0;
  }
}

.title {
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
  color: #204f74;
  text-align: center;
  @include media-breakpoint-up(xl) {
    font-size: 32px;
  }
}

.description {
  font-size: 18px;
  line-height: 32px;
  color: #4a4a4a;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__paragraph {
    display: flex;
    flex-direction: column;
    align-items: center;
    &--blue {
      color: cornflowerblue;
    }
    @include media-breakpoint-up(xl) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__detail {
    font-size: 12px;
    line-height: 20px;
    font-style: normal;
    font-weight: normal;

    text-align: center;
    color: #888888;

    margin-top: 20px;
  }
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  button + button {
    margin: 20px 0 0 0;
  }
}
.back-to-home-button {
  width: 100%;
  max-width: 240px;
  height: 60px;
  background-color: #204f74;
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
