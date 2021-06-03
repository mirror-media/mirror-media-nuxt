<template>
  <div class="wrapper">
    <input
      v-model="input"
      class="wrapper__input"
      type="text"
      :placeholder="placeholder"
      @keydown.enter="onEnter"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
    }
  },
  watch: {
    input() {
      this.$emit('update:input', this.input)
    },
  },
  methods: {
    onEnter(e) {
      // Check IME composing
      const { isComposing = false } = e
      if (!isComposing) {
        this.$emit('enter')
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.wrapper
  min-width 100px
  height 34px
  background-color white
  padding 0 0 0 12px
  &__input
    width 100%
    height 100%
    border none
    background-color transparent
    font-size 14px
    color #1b1b1b
    &::placeholder
      font-size 14px
      color #888888
</style>
