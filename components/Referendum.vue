<template>
  <div v-if="isDev" class="referendum">
    <div class="referendum__wrapper">
      <iframe src="https://dev.readr.tw/referendum" />
    </div>
  </div>
</template>

<script>
import { ENV } from '~/configs/config'
export default {
  computed: {
    isDev() {
      return ENV === 'local' || ENV === 'dev'
    },
  },
}
</script>

<style lang="scss" scoped>
.referendum {
  height: 466px;
  width: 100%;
  @include media-breakpoint-up(md) {
    height: 265px;
  }
  &__wrapper {
    position: absolute;
    left: 0;
    width: 100vw;
    padding: 10px;
    iframe {
      height: 446px;
      width: 100%;
      @include media-breakpoint-up(md) {
        height: 245px;
      }
    }
  }
}
</style>
