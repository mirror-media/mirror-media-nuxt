<template>
  <div class="audio-player">
    <audio ref="audio" :src="content.url" />

    <UIAudioPlayerInfo :title="content.title" />

    <div class="controls">
      <button type="button" @click="toggleAudio">
        <img
          :src="require(`~/assets/audio-player-${playBtn}.png`)"
          :alt="playBtn"
        />
      </button>

      <div class="progress">
        <UIAudioPlayerBar
          class="audio-player__bar"
          :options="audioPlayerBarOptions"
          :value.sync="audioPlayerBarValue"
          :railStyle="bufferedStyle"
        />

        <UIAudioPlayerTime
          :currentTime="formatTime(audioStatus.currentTime)"
          :duration="formatTime(audioStatus.duration)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UIAudioPlayerInfo from './UIAudioPlayerInfo.vue'
import UIAudioPlayerBar from './UIAudioPlayerBar.vue'
import UIAudioPlayerTime from './UIAudioPlayerTime.vue'

export default {
  name: 'UIAudioPlayer',
  components: {
    UIAudioPlayerInfo,
    UIAudioPlayerBar,
    UIAudioPlayerTime,
  },
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({}),
      validator: (content) =>
        ['url', 'title'].every((key) =>
          Object.prototype.hasOwnProperty.call(content, key)
        ),
    },
  },
  data() {
    return {
      audioPlayerBarOptions: {
        interval: 0.001,
        max: 1,
        tooltip: 'none',
        dotSize: 12,
        dotStyle: {
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: '100%',
          boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
        },
        processStyle: {
          backgroundColor: '#fe6c2d',
        },
      },
      audioStatus: {
        duration: 0,
        currentTime: 0,
        loadedTime: 0,
        isPlaying: false,
      },
    }
  },
  computed: {
    playBtn() {
      return this.audioStatus.isPlaying ? 'pause' : 'play'
    },
    audioPlayerBarValue: {
      get() {
        const { currentTime, duration } = this.audioStatus

        return this.toFixed3(currentTime / duration || 0)
      },
      set(percent) {
        this.$refs.audio.currentTime = this.audioStatus.duration * percent
      },
    },
    bufferedStyle() {
      const { loadedTime, duration } = this.audioStatus
      const buffered = this.toFixed3((loadedTime / duration) * 100 || 0)

      return {
        backgroundImage: `linear-gradient(90deg, #7d7d7d ${buffered}%, #000 ${buffered}%)`,
      }
    },
  },
  mounted() {
    this.addEventListenersToAudio()
  },
  methods: {
    addEventListenersToAudio() {
      const audioEvts = [
        ['progress', this.onProgress],
        ['durationchange', this.onDurationchange],
        ['loadedmetadata', this.onLoadedmetadata],
        ['timeupdate', this.onTimeupdate],
        ['seeking', this.onSeeking],
        ['ended', this.onEnded],
      ]

      audioEvts.forEach(([event, listener]) => {
        this.$refs.audio.addEventListener(event, listener)
      })
    },
    onProgress() {
      this.setLoadedTime()
    },
    onDurationchange() {
      this.audioStatus.duration = this.$refs.audio.duration || 0
    },
    onLoadedmetadata() {
      this.setLoadedTime()
    },
    onTimeupdate() {
      this.setCurrentTime()
      this.setLoadedTime()
    },
    onSeeking() {
      this.setCurrentTime()
    },
    onEnded() {
      this.audioStatus.isPlaying = false
    },
    setCurrentTime() {
      this.audioStatus.currentTime = this.$refs.audio.currentTime
    },
    setLoadedTime() {
      if (this.$refs.audio.buffered.length === 0) {
        return
      }

      this.audioStatus.loadedTime = this.$refs.audio.buffered.end(
        this.$refs.audio.buffered.length - 1
      )
    },

    toFixed3(num) {
      return Number(num.toFixed(3))
    },

    toggleAudio() {
      const { audio } = this.$refs

      if (this.audioStatus.isPlaying) {
        audio.pause()
      } else {
        audio.play()

        this.$ga.event({
          eventCategory: 'article',
          eventAction: 'click',
          eventLabel: 'voice-play',
        })
      }

      this.audioStatus.isPlaying = !this.audioStatus.isPlaying
    },

    formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60).toString()
      const seconds = Math.floor(totalSeconds - minutes * 60).toString()
      const mDisplayed = minutes.padStart(2, '0')
      const sDisplayed = seconds.padStart(2, '0')

      return `${mDisplayed}:${sDisplayed}`
    },
  },
}
</script>

<style lang="scss" scoped>
.audio-player {
  border: 2px solid #efefef;
}

.controls {
  height: 56px;
  padding: 6px 16px;
  background-color: #efefef;
  display: flex;
  align-items: center;

  button {
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  img {
    width: 34px;
  }
}

.progress {
  flex-grow: 1;
  margin-left: 20px;
  position: relative;
}
</style>
