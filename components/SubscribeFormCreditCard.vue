<template>
  <div class="credit-card">
    <h2 class="subscribe-form__title">電子發票</h2>

    <div class="credit-card__icons">
      <div class="credit-card__icons_icon">
        <img :src="require('@/assets/card-icon-1.png')" alt="" />
      </div>
      <div class="credit-card__icons_icon">
        <img :src="require('@/assets/card-icon-2.png')" alt="" />
      </div>
      <div class="credit-card__icons_icon">
        <img :src="require('@/assets/card-icon-3.png')" alt="" />
      </div>
    </div>

    <div class="credit-card__inputs">
      <div class="credit-card__inputs_row_1">
        <div class="credit-card__input_wrapper">
          <span>卡號</span>
          <input type="text" placeholder="0000 0000 0000 0000" />
        </div>
      </div>

      <div class="credit-card__inputs_row_2">
        <div class="credit-card__input_wrapper">
          <span>有效期限</span>
          <input type="text" placeholder="MM/YY" />
        </div>

        <div class="credit-card__input_wrapper">
          <span>安全碼</span>
          <input type="text" placeholder="CVV" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.credit-card {
  position: relative;

  &__icons {
    width: 122px;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 23px;
    &_icon {
      width: 34px;
      height: 22px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  &__inputs {
    &_row_2 {
      margin-top: 10px;
      display: flex;
      & > div {
        flex: 1;
        & > input {
          width: 112px;
        }
      }
    }
  }
}
</style>
