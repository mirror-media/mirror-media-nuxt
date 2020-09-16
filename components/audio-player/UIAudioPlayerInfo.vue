<template>
  <div class="audio-player-info">
    <p>{{ title }}</p>

    <a
      href="https://voice.mirrorfiction.com?utm_source=mmplayer&utm_medium=referral"
      target="_blank"
    >
      <picture>
        <source media="(min-width: 768px)" srcset="~/assets/mirrorvoice.png" />
        <img src="~/assets/mirrorvoice-small.png" alt="Mirror Voice link" />
      </picture>
    </a>
  </div>
</template>

<script>
export default {
  name: 'UIAudioPlayerInfo',
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.audio-player-info {
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @include media-breakpoint-up(md) {
    padding: 16px;
  }

  p {
    font-size: 16px;
    flex-shrink: 0;
    flex-basis: 60%;
    line-height: 1.63;
    color: #000;
    font-weight: 700;
    @include media-breakpoint-up(md) {
      flex-basis: 80%;
      line-height: 1.06;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  a {
    flex-shrink: 0;
    position: relative;
    top: -8px;
    @include media-breakpoint-up(md) {
      right: -8px;
    }
  }

  img {
    width: 34px;
    @include media-breakpoint-up(md) {
      width: 53.5px;
    }
  }
}
</style>
