<template>
  <div class="hints-wrapper">
    <p v-show="state === 'sending'" class="gray-hint">正在寄出信件...</p>
    <p v-show="state === 'emailNotExist'" class="invalid-hint">
      這個 Email 尚未註冊，請註冊會員
    </p>
    <p v-show="state === 'error'" class="invalid-hint">
      Email 寄出失敗，請重新再試
    </p>
    <div v-show="state === 'success'" class="success-hint-wrapper">
      <p class="green-hint">Email 已成功寄出</p>
      <p class="success-hint-wrapper__description gray-hint">
        沒收到信嗎？請檢查垃圾信件匣，或等候 30 秒重新寄送
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    state: {
      type: String,
      default: '',
      validator(value) {
        return ['sending', 'emailNotExist', 'error', 'success', ''].includes(
          value
        )
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.hints-wrapper {
  & > * {
    margin: 0 0 12px 0;
  }
}

.success-hint-wrapper {
  &__description {
    margin: 12px 0 0 0;
  }
}

.invalid-hint {
  font-size: 16px;
  line-height: 150%;
  color: #db1730;
}

.gray-hint {
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #9b9b9b;
}

.green-hint {
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #009045;
}
</style>
