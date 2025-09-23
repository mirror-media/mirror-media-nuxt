<template>
  <div class="anniversary-message">
    <p class="anniversary-message__title">
      鏡週刊 10 週年慶 全站文章、獨家新聞全網免費閱讀
    </p>
    <p class="anniversary-message__highlight">
      活動期間：2025/10/1 — 2025/12/31
    </p>
  </div>
</template>

<script>
export default {
  name: 'AnniversaryMessage',
}
</script>

<style lang="scss" scoped>
.anniversary-message {
  font-family: 'PingFang TC';
  margin: 0 auto 24px;

  @include media-breakpoint-up(md) {
    text-align: center;
  }

  &__title {
    font-size: 20px;
    font-weight: 500;
    line-height: 1;
    color: #e51731;
    letter-spacing: 0;
    margin-bottom: 5px;

    @include media-breakpoint-up(md) {
      font-size: 24px;
      font-weight: 400;
    }
  }

  &__highlight {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;

    @include media-breakpoint-up(md) {
      font-size: 18px;
    }
  }
}
</style>
