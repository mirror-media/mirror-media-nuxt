<template>
  <a
    class="subscribe"
    target="_blank"
    href="/subscribe"
    rel="noopener noreferrer"
  >
    <span>加入訂閱會員</span>
  </a>
</template>

<script>
export default {
  name: 'UiBeSubscriberButton',
}
</script>

<style lang="scss" scoped>
.subscribe {
  background-color: #1d9fb8;
  &:hover {
    background: #054f77;
    transition: background 0.3s ease;
  }
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  padding: 8px 12px;
  height: 32px;
  border-radius: 32px;

  &:focus {
    outline: none;
  }
  span {
    color: white;
  }
}
</style>
