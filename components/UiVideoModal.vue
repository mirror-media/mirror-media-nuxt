<template>
  <div class="video-modal">
    <div class="curtain" @click="handleClickOpen" />

    <!-- eslint-disable vue/no-v-html -->
    <div
      class="wrapper"
      :class="{ open: shouldOpenModal }"
      @click="handleClickClose"
      v-html="embeddedHtml"
    ></div>
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
export default {
  name: 'UiVideoModal',

  props: {
    embeddedHtml: {
      type: String,
      default: '',
      required: true,
    },
  },

  data() {
    return {
      shouldOpenModal: false,
    }
  },

  methods: {
    handleClickOpen() {
      this.shouldOpenModal = true

      this.$emit('sendGa:open')
    },
    handleClickClose() {
      this.shouldOpenModal = false

      this.$emit('sendGa:close')
    },
  },
}
</script>

<style lang="scss" scoped>
.video-modal {
  position: relative;
  padding-top: 66.67%;
}

.curtain,
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.curtain {
  z-index: 9;
}

$aspect-ratio: 9 / 16;

.wrapper {
  &.open {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(#000, 0.7);
    z-index: 819;

    &::v-deep iframe {
      position: relative;
      height: calc(100vw * #{$aspect-ratio});
      max-width: 1024px;
      max-height: 576px;
    }
  }
}

::v-deep iframe {
  width: 100%;
  height: 100%;
}
</style>
