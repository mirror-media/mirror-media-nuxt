<template>
  <div class="search-bar-input">
    <input
      v-model="text"
      type="text"
      placeholder="請輸入關鍵字"
      @keydown.enter="search"
    />
  </div>
</template>

<script>
export default {
  name: 'UISearchBarInput',
  data() {
    return {
      text: '',
    }
  },
  watch: {
    text(newText) {
      this.$emit('setText', newText)
    },
  },
  methods: {
    search(evt) {
      if (evt.isComposing) {
        return
      }

      this.$emit('search')
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar-input {
  font-size: 16px;
  color: #1b1b1b;
  height: 34px;
}
input {
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
  height: 100%;
  line-height: 34px;
  display: block;
  &::placeholder {
    color: #888;
  }
}
</style>
