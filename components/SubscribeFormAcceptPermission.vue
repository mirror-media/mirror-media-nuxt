<template>
  <div class="accept-permission">
    <div class="accept-permission__check">
      <input
        type="checkbox"
        :value="acceptPermission"
        @change="setAcceptPermission"
        name=""
        id=""
      />
      <span> 我已閱讀並同意：</span>
    </div>

    <div class="accept-permission__info">
      鏡週刊於行銷目的範圍內得永久彙集。處理及利用本人填寫之訂單資料，並得利用前述資料而為本公司在台灣地區對本人發送活動、服務訊息。本公司對所彙集資料依法保密。本人如有請求停止彙集、處理、利用之需要可書面或致電訂戶組處理
      (02) 6636-6800。
    </div>
  </div>
</template>

<script>
export default {
  props: {
    acceptPermission: {
      type: Boolean,
      isRequired: true,
      default: false,
    },
    setAcceptPermission: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.accept-permission {
  position: relative;

  &__check {
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      color: #4a4a4a;
    }
  }

  &__info {
    padding-left: 29px;
    font-size: 15px;
    line-height: 1.87;
    color: #4a4a4a;
  }
}
</style>
