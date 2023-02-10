<template>
  <a class="donate" target="_blank" href="/donate" rel="noopener noreferrer">
    <img src="~/assets/donate.png" alt="donate" />
  </a>
</template>

<script>
export default {
  name: 'UiDonateButtonCircle',
}
</script>

<style lang="scss" scoped>
.donate {
  background-color: black;
  height: 48px;
  padding: 12px;
  border-radius: 50%;
  color: white;
  transition: all 0.1s ease-out;
  img {
    width: 24px;
    height: 24px;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    box-shadow: 0 4px 8px rgba(#000, 0.7);
  }
}
</style>
