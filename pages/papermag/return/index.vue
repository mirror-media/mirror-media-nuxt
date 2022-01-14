<template>
  <div class="return">即將回到鏡週刊</div>
</template>

<script>
import qs from 'qs'
export default {
  layout: 'empty',
  asyncData({ req }) {
    if (process.server) {
      let body = ''
      let temp = ''
      while ((temp = req.read())) {
        body += temp
      }
      const post = qs.parse(body)

      return { data: post }
    }
  },
  data() {
    return {
      data: '',
    }
  },
}
</script>

<style lang="scss" scoped>
.return {
  cursor: pointer;
}
</style>
