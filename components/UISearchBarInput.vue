<template>
  <div class="search-bar-input">
    <input type="text" placeholder="請輸入關鍵字" />
  </div>
</template>

<script>
export default {
  name: 'UISearchBarInput',
}
</script>

<style lang="scss" scoped>
.search-bar-input {
  font-size: 16px;
  color: #1b1b1b;
  line-height: 1.15;
}
input {
  padding: 8px 12px;
  width: 100%;
  display: block;
  &::placeholder {
    color: #888;
  }
}
</style>
