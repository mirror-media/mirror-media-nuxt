<template>
  <div class="validate-email">
    <div class="validate-email__wrapper">
      <div class="validate-email__wrapper_title">驗證信箱</div>
      <div class="validate-email__wrapper_content">
        <p>
          您的帳號尚未完成 Email 驗證，請輸入可用來接收驗證信的 Email 信箱。
        </p>
        <p>這個 Email 將會自動綁定您目前的帳號。</p>
      </div>
      <div class="validate-email__wrapper_form">
        <input v-model="email" type="text" placeholder="name@example.com" />
        <div class="error__message">請輸入有效的 Email 地址</div>
        <div class="error__message">電子郵件不得為空</div>
        <div class="validate-email__wrapper_form_status">
          <div class="validate-email__wrapper_form_status_loading">
            正在寄出信件...
          </div>
          <div class="validate-email__wrapper_form_status_success">
            Email 已成功寄出
          </div>
          <div class="validate-email__wrapper_form_status_hint">
            沒收到信嗎？請檢查垃圾信件匣，或等候 30 秒重新寄送
          </div>
          <div class="validate-email__wrapper_form_status_error">
            Email 寄出失敗，請重新再試
          </div>
        </div>
        <UiMembershipButtonPrimary>送出</UiMembershipButtonPrimary>
      </div>
    </div>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
export default {
  components: {
    UiMembershipButtonPrimary,
  },
}
</script>

<style lang="scss" scoped>
.validate-email {
  padding: 44px 20px;
  @include media-breakpoint-up(sm) {
    background: #f2f2f2;
    display: flex;
    justify-content: center;
    padding: 60px 0;
  }

  &__wrapper {
    @include media-breakpoint-up(sm) {
      max-width: 423px;
      padding: 32px 48px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08),
        0px 4px 28px rgba(0, 0, 0, 0.06);
    }

    &_title {
      font-size: 20px;
      line-height: 32px;
      text-align: center;
      color: #4a4a4a;
      margin-bottom: 16px;
    }

    &_content {
      font-size: 16px;
      line-height: 150%;
      color: rgba(0, 0, 0, 0.66);
      margin-bottom: 32px;

      p + p {
        margin-top: 1rem;
      }
    }

    input[type='text'] {
      height: 48px;
      width: 100%;
      padding: 12px;
      border-radius: 2px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.3);
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.87);

      &:focus {
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0.87);
      }

      &:disabled {
        background: #e3e3e3;
        border: 1px solid rgba(0, 0, 0, 0.2);
        color: rgba(0, 0, 0, 0.2);
        font-size: 18px;
        line-height: 25px;
        &::placeholder {
          color: rgb(227, 227, 227);
        }
      }
    }

    .error__message {
      margin-top: 8px;
      color: #e51731;
      font-size: 16px;
      line-height: 150%;
    }

    &_form_status {
      margin: 24px 0 12px 0;
      font-size: 16px;
      line-height: 150%;
      color: #9b9b9b;
      text-align: center;
      &_error {
        color: #e51731;
      }
      &_success {
        color: #009045;
      }
      &_hint {
        font-size: 15px;
        line-height: 21px;
        margin: 12px 0 0 0;
      }
    }
  }
}
</style>
