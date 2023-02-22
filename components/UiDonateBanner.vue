<template>
  <div class="donate-banner">
    <div>
      <p class="title">小心意大意義，小額贊助鏡週刊！</p>
    </div>
    <UiDonateButton class="donate-button" />
  </div>
</template>

<script>
import UiDonateButton from './UiDonateButton.vue'
export default {
  name: 'UiDonateBanner',
  components: { UiDonateButton },
}
</script>

<style lang="scss" scoped>
.donate-banner {
  background-color: rgba(0, 0, 0, 0.87);
  padding: 32px;
  display: flex;

  flex-direction: column;
  color: white;
  font-size: 18px;
  line-height: 1.5;
  @include media-breakpoint-up(md) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    color: white;
  }
}

.donate-button {
  border: 1px solid white;
  height: 43px;
  width: 100%;
  padding: 8px 16px 8px 18px;
  font-size: 18px;
  margin: 10px 0;
  color: white;
  @include media-breakpoint-up(md) {
    margin: 6px 0;
    width: 140px;
  }
}
</style>
