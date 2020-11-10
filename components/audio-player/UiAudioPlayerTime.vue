<template>
  <div class="audio-player-time">
    <div>{{ currentTime }}</div>
    <div>{{ duration }}</div>
  </div>
</template>

<script>
export default {
  name: 'UiAudioPlayerTime',
  props: {
    currentTime: {
      type: String,
      required: true,
      default: '00:00',
    },
    duration: {
      type: String,
      required: true,
      default: '00:00',
    },
  },
}
</script>

<style lang="scss" scoped>
.audio-player-time {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 20px;
  line-height: 1.15;
  width: 100%;
  color: #fe6c2d;
  font-size: 10px;
}
</style>
