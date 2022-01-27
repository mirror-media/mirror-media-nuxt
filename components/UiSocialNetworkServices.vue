<template>
  <div class="sns-wrapper">
    <FbPage
      :settings="{
        'data-tabs': 'events',
      }"
      style="text-align: left"
    />
    <nav class="sns-wrapper__nav nav">
      <a
        class="nav__link link-with-icon"
        href="https://lin.ee/dkD1s4q"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img src="~/assets/sns-rounded-line.png" alt="line-icon" class="icon" />
        <span>加入</span>
      </a>
      <a
        class="nav__link link-with-icon"
        href="https://www.instagram.com/mirror_media/"
        target="_blank"
        rel="noreferrer noopener"
      >
        <SvgSnsRoundedIg class="icon" />
        <span>追蹤</span>
      </a>
      <a
        class="nav__link link-with-icon"
        href="https://www.youtube.com/channel/UCYkldEK001GxR884OZMFnRw?sub_confirmation=1"
        target="_blank"
        rel="noreferrer noopener"
      >
        <SvgSnsRoundedYt class="icon" />
        <span>訂閱</span>
      </a>
      <div class="mm-wrapper nav__link">
        <a
          class="link-with-icon"
          href="http://hyperurl.co/magzine"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src="~/assets/sns-rounded-mm.png" alt="mm-icon" class="icon" />
          <span>下載</span>
        </a>
        <a
          class="join-membership"
          href="https://www.mirrormedia.mg/login"
          target="_blank"
          rel="noreferrer noopener"
        >
          加入會員
        </a>
      </div>
    </nav>
  </div>
</template>

<script>
import FbPage from './FbPage.vue'
import SvgSnsRoundedIg from '~/assets/sns-rounded-ig.svg?inline'
import SvgSnsRoundedYt from '~/assets/sns-rounded-yt.svg?inline'

export default {
  components: {
    FbPage,
    SvgSnsRoundedIg,
    SvgSnsRoundedYt,
  },
}
</script>

<style lang="scss" scoped>
.sns-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 0 -16px;
  @include media-breakpoint-up(xl) {
    margin: 0;
  }
  &__link {
    margin: 16px 0 0 16px;
  }
}

.link-with-icon {
  display: flex;
  align-items: center;
  .icon {
    width: 32px;
    height: 32px;
  }
  span {
    margin: 0 0 0 8px;
    font-size: 16px;
    color: #4a4a4a;
  }
}

.mm-wrapper {
  display: flex;
  align-items: center;
}
.join-membership {
  font-size: 16px;
  color: #054f77;
  padding: 0 0 0 12px;
  margin: 0 0 0 12px;
  border-left: 1px solid #a1a1a1;
}
</style>
