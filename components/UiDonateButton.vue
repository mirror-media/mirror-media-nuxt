<template>
  <a class="donate" target="_blank" href="/donate" rel="noopener noreferrer">
    <img src="~/assets/donate.svg" alt="donate" />
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
  &:hover {
    background: rgba(0, 0, 0, 0.87);
    transition: background 0.3s ease;
  }
  width: fit-content;
  height: 32px;
  padding: 9px 12px 9px 13.33px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5.33px;
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  border-radius: 32px;

  &:focus {
    outline: none;
  }
  span {
    color: white;
  }
}
</style>
