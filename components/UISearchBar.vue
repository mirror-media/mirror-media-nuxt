<template>
  <section class="search-bar">
    <button type="button" class="search" />
    <div class="field">
      <UISearchBarSelect />
      <UISearchBarInput class="search-bar-input" />
    </div>
  </section>
</template>

<script>
import UISearchBarSelect from './UISearchBarSelect.vue'
import UISearchBarInput from './UISearchBarInput.vue'

export default {
  name: 'UISearchBar',
  components: {
    UISearchBarSelect,
    UISearchBarInput,
  },
}
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  z-index: 199;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
.search {
  display: block;
  width: 18px;
  height: 18px;
  position: relative;
  background-image: url(~assets/icon_search_mobile.png);
  background-size: 18px;
  cursor: pointer;
  user-select: none;
  &::before {
    content: '';
    display: block;
    position: absolute;
    // 50 - 12
    top: 38px;
    left: 50%;
    transform: translateX(-50%);
    border-color: transparent transparent #064f77;
    border-style: solid;
    border-width: 0 5.5px 12px 5.5px;
  }
}
.field {
  background-color: #064f77;
  width: 100%;
  // height: 132px;
  padding: 22px 29px;
  position: absolute;
  top: 50px;
  left: 0;
}
.search-bar-input {
  margin-top: 20px;
}
</style>
