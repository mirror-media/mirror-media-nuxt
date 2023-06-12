<template>
  <div class="outer-box">
    <p class="title">支持鏡週刊</p>
    <div class="inner-wrapper">
      <div class="inner-box">
        <p class="desc">小心意大意義，小額贊助鏡週刊！</p>
        <UiDonateButton class="donate-button" />
      </div>
      <div class="inner-box">
        <p class="desc">每月 $49 元全站看到飽，暢享無廣告閱讀體驗</p>
        <UiBeSubscriberButton class="donate-button" />
      </div>
    </div>
  </div>
</template>

<script>
import UiBeSubscriberButton from './UiBeSubscriberButton.vue'
import UiDonateButton from './UiDonateButton.vue'
export default {
  name: 'UiSupportBox',
  components: { UiDonateButton, UiBeSubscriberButton },
}
</script>

<style lang="scss" scoped>
.outer-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  background: linear-gradient(90deg, #61b8c6 0%, #054f77 100%);
  box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.06), 0px 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 24px;

  .title {
    color: white;
    font-family: 'PingFang TC';
    font-weight: 600;
    font-size: 24px;
    line-height: 200%;
    margin-bottom: 8px;
  }
}

.inner-wrapper {
  display: grid;
  grid-template-rows: auto;
  gap: 12px;
  grid-gap: 12px;

  @include media-breakpoint-up(md) {
    grid-template-columns: 1fr 1fr;
  }
}

.inner-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
}

.desc {
  font-family: 'PingFang TC';
  font-weight: 400;
  font-size: 18px;
  line-height: 150%;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 16px;
}

.donate-button {
  width: 100%;
  height: 70px;
  padding: 20px;
  font-family: 'PingFang TC';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  text-align: center;
  color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  flex: none;
  flex-grow: 0;
}
</style>
