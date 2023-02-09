<template>
  <a class="donate" target="_blank" href="/donate" rel="noopener noreferrer">
    <img src="~/assets/donate.png" alt="donate" />
    <span>贊助本文</span>
  </a>
</template>

<script>
export default {
  name: 'UiDonateButton',
}
</script>

<style lang="scss" scoped>
.donate {
  background-color: black;
  width: 100px;
  height: 32px;
  padding: 9px 12px 9px 13.33px;
  display: flex;
  gap: 5.33px;
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  border-radius: 32px;
  color: white;
  img {
    width: 13.33px;
    height: 13.33px;
  }
  &:focus {
    outline: none;
  }
}
</style>
