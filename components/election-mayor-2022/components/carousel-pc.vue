<template>
  <div class="CarouselWrapper">
    <div class="slide" :class="{ isActive: slideIndex === 0 }">
      <div class="indicator">
        <button class="button" @click="setIndex2">&#9664; 台南市/高雄市</button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex1">桃園市/台中市 &#9654;</button>
      </div>
      <div class="city">
        <div class="title">{{ polling[0].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[0].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }} {{ candidate.name }}</div>
              <div>{{ candidate.party.slice(0, 1) }}</div>
              <div v-show="candidate.candVictor">⭕</div>
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="city">
        <div class="title">{{ polling[1].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[1].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }} {{ candidate.name }}</div>
              <div>{{ candidate.party.slice(0, 1) }}</div>
              <div v-show="candidate.candVictor">⭕</div>
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide" :class="{ isActive: slideIndex === 1 }">
      <div class="indicator">
        <button class="button" @click="setIndex0">&#9664; 台北市/新北市</button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex2">台南市/高雄市 &#9654;</button>
      </div>
      <div class="city">
        <div class="title">{{ polling[2].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[2].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }} {{ candidate.name }}</div>
              <div>{{ candidate.party.slice(0, 1) }}</div>
              <div v-show="candidate.candVictor">⭕</div>
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="city">
        <div class="title">{{ polling[3].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[3].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }} {{ candidate.name }}</div>
              <div>{{ candidate.party.slice(0, 1) }}</div>
              <div v-show="candidate.candVictor">⭕</div>
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide" :class="{ isActive: slideIndex === 2 }">
      <div class="indicator">
        <button class="button" @click="setIndex1">&#9664; 桃園市/台中市</button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex0">台北市/新北市 &#9654;</button>
      </div>
      <div class="city">
        <div class="title">{{ polling[4].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[4].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }} {{ candidate.name }}</div>
              <div>{{ candidate.party.slice(0, 1) }}</div>
              <div v-show="candidate.candVictor">⭕</div>
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="city">
        <div class="title">{{ polling[5].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[5].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }} {{ candidate.name }}</div>
              <div>{{ candidate.party.slice(0, 1) }}</div>
              <div v-show="candidate.candVictor">⭕</div>
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarouselPc',

  props: {
    polling: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  data() {
    return { slideIndex: 0 }
  },

  mounted() {
    setInterval(() => {
      this.slideIndex++
      if (this.slideIndex >= 3) this.slideIndex = 0
    }, 3000)
  },

  methods: {
    setIndex2() {
      this.slideIndex = 2
    },
    setIndex1() {
      this.slideIndex = 1
    },
    setIndex0() {
      this.slideIndex = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.CarouselWrapper {
  position: relative;
  height: 241px;
  width: 922px;
  display: flex;
  font-size: 16px;
  display: none;

  @include media-breakpoint-up(xl) {
    display: block;
  }
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  display: none;

  &.isActive {
    display: block;
  }
}

.indicator {
  width: 922px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #04295e;
}

.button {
  font-weight: 600;
  font-size: 14px;
  color: #f34b4b;
}

.city {
  /* display: flex; */
  /* flex-direction: column; */
  border-bottom: 2px solid #ffffff;
  padding: 6px 0;
}
.candidates-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  :not(:last-child) {
    padding-right: 13px;
  }
}
.candidate {
  display: flex;
  flex-direction: column;
}
.name-party-wrapper {
  display: flex;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #4a4a4a;
  padding: 6px 0;
}
.progress-bar {
  position: relative;
  width: 298px;
  height: 24px;
  background: #ffffff;
  border-radius: 4px;
}
.tks-rate {
  width: 10%;
  height: 24px;
  border-radius: 4px;
  background: #ebf02c;
  position: absolute;
  top: 0;
}

.tks {
  position: absolute;
  top: 2px;
  left: 8px;
  z-index: 9;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #04295e;
}
</style>
