<template>
  <div class="CarouselWrapper">
    <!-- slide1 -->
    <div class="slide" :class="{ isActive: slideIndex === 0 }">
      <div class="indicator">
        <button class="button" @click="setIndex5">
          <img :src="prevArrow()" /> <span>高雄市</span>
        </button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex1">
          <span>新北市</span><img :src="nextArrow()" />
        </button>
      </div>
      <div class="indicator-mo">
        <p class="title">六都市長開票進度</p>
        <div class="buttonsWrapper">
          <button class="button" @click="setIndex5">
            <img :src="prevArrow()" />
          </button>
          <p class="current-city">{{ polling[0].city }}</p>
          <button class="button" @click="setIndex1">
            <img :src="nextArrow()" />
          </button>
        </div>
      </div>
      <div class="city">
        <div class="city-title">{{ polling[0].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[0].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }}</div>
              <div>{{ candidate.name }}</div>
              <img
                v-if="getPartySvg(candidate.party)"
                :src="getPartySvg(candidate.party)"
              />
              <span v-else>{{ candidate.party }}</span>
              <img v-show="candidate.candVictor" :src="getWinSvg()" />
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div class="tks-rate-number">{{ candidate.tksRate }}%</div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- slide2 -->
    <div class="slide" :class="{ isActive: slideIndex === 1 }">
      <div class="indicator">
        <button class="button" @click="setIndex0">
          <img :src="prevArrow()" /> <span>台北市</span>
        </button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex2">
          <span>桃園市</span><img :src="nextArrow()" />
        </button>
      </div>
      <div class="indicator-mo">
        <p class="title">六都市長開票進度</p>
        <div class="buttonsWrapper">
          <button class="button" @click="setIndex0">
            <img :src="prevArrow()" />
          </button>
          <p class="current-city">{{ polling[1].city }}</p>
          <button class="button" @click="setIndex2">
            <img :src="nextArrow()" />
          </button>
        </div>
      </div>

      <div class="city">
        <div class="city-title">{{ polling[1].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[1].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }}</div>
              <div>{{ candidate.name }}</div>
              <img
                v-if="getPartySvg(candidate.party)"
                :src="getPartySvg(candidate.party)"
              />
              <span v-else>{{ candidate.party }}</span>
              <img v-show="candidate.candVictor" :src="getWinSvg()" />
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div class="tks-rate-number">{{ candidate.tksRate }}%</div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- slide3 -->
    <div class="slide" :class="{ isActive: slideIndex === 2 }">
      <div class="indicator">
        <button class="button" @click="setIndex1">
          <img :src="prevArrow()" /> <span>新北市</span>
        </button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex3">
          <span>台中市</span><img :src="nextArrow()" />
        </button>
      </div>
      <div class="indicator-mo">
        <p class="title">六都市長開票進度</p>
        <div class="buttonsWrapper">
          <button class="button" @click="setIndex1">
            <img :src="prevArrow()" />
          </button>
          <p class="current-city">{{ polling[2].city }}</p>
          <button class="button" @click="setIndex3">
            <img :src="nextArrow()" />
          </button>
        </div>
      </div>
      <div class="city">
        <div class="city-title">{{ polling[2].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[2].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }}</div>
              <div>{{ candidate.name }}</div>
              <img
                v-if="getPartySvg(candidate.party)"
                :src="getPartySvg(candidate.party)"
              />
              <span v-else>{{ candidate.party }}</span>
              <img v-show="candidate.candVictor" :src="getWinSvg()" />
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div class="tks-rate-number">{{ candidate.tksRate }}%</div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- slide4 -->
    <div class="slide" :class="{ isActive: slideIndex === 3 }">
      <div class="indicator">
        <button class="button" @click="setIndex2">
          <img :src="prevArrow()" /> <span>桃園市</span>
        </button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex4">
          <span>台南市</span><img :src="nextArrow()" />
        </button>
      </div>
      <div class="indicator-mo">
        <p class="title">六都市長開票進度</p>
        <div class="buttonsWrapper">
          <button class="button" @click="setIndex2">
            <img :src="prevArrow()" />
          </button>
          <p class="current-city">{{ polling[3].city }}</p>
          <button class="button" @click="setIndex4">
            <img :src="nextArrow()" />
          </button>
        </div>
      </div>
      <div class="city">
        <div class="city-title">{{ polling[3].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[3].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }}</div>
              <div>{{ candidate.name }}</div>
              <img
                v-if="getPartySvg(candidate.party)"
                :src="getPartySvg(candidate.party)"
              />
              <span v-else>{{ candidate.party }}</span>
              <img v-show="candidate.candVictor" :src="getWinSvg()" />
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div class="tks-rate-number">{{ candidate.tksRate }}%</div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- slide5 -->
    <div class="slide" :class="{ isActive: slideIndex === 4 }">
      <div class="indicator">
        <button class="button" @click="setIndex3">
          <img :src="prevArrow()" /> <span>台中市</span>
        </button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex5">
          <span>高雄市</span><img :src="nextArrow()" />
        </button>
      </div>
      <div class="indicator-mo">
        <p class="title">六都市長開票進度</p>
        <div class="buttonsWrapper">
          <button class="button" @click="setIndex3">
            <img :src="prevArrow()" />
          </button>
          <p class="current-city">{{ polling[4].city }}</p>
          <button class="button" @click="setIndex5">
            <img :src="nextArrow()" />
          </button>
        </div>
      </div>
      <div class="city">
        <div class="city-title">{{ polling[4].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[4].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }}</div>
              <div>{{ candidate.name }}</div>
              <img
                v-if="getPartySvg(candidate.party)"
                :src="getPartySvg(candidate.party)"
              />
              <span v-else>{{ candidate.party }}</span>
              <img v-show="candidate.candVictor" :src="getWinSvg()" />
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div class="tks-rate-number">{{ candidate.tksRate }}%</div>
              <div
                class="tks-rate"
                :style="{ width: candidate.tksRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- slide6 -->
    <div class="slide" :class="{ isActive: slideIndex === 5 }">
      <div class="indicator">
        <button class="button" @click="setIndex4">
          <img :src="prevArrow()" /> <span>台南市</span>
        </button>
        <p class="title">六都市長開票進度</p>
        <button class="button" @click="setIndex0">
          <span>台北市</span><img :src="nextArrow()" />
        </button>
      </div>
      <div class="indicator-mo">
        <p class="title">六都市長開票進度</p>
        <div class="buttonsWrapper">
          <button class="button" @click="setIndex4">
            <img :src="prevArrow()" />
          </button>
          <p class="current-city">{{ polling[5].city }}</p>
          <button class="button" @click="setIndex0">
            <img :src="nextArrow()" />
          </button>
        </div>
      </div>
      <div class="city">
        <div class="city-title">{{ polling[5].city }}</div>
        <div class="candidates-wrapper">
          <div
            v-for="candidate in polling[5].candidates"
            :key="candidate.candNo"
            class="candidate"
          >
            <div class="name-party-wrapper">
              <div>{{ candidate.candNo }}</div>
              <div>{{ candidate.name }}</div>
              <img
                v-if="getPartySvg(candidate.party)"
                :src="getPartySvg(candidate.party)"
              />
              <span v-else>{{ candidate.party }}</span>
              <img v-show="candidate.candVictor" :src="getWinSvg()" />
            </div>
            <div class="progress-bar">
              <div class="tks">
                {{ candidate.tks.toLocaleString('en-US') }}
              </div>
              <div class="tks-rate-number">{{ candidate.tksRate }}%</div>
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
import kmtSvg from '../assets/kmt.svg'
import tmdSvg from '../assets/tmd.svg'
import ddpSvg from '../assets/ddp.svg'
import noParty from '../assets/noparty.svg'
import prevArrow from '../assets/prev.svg'
import nextArrow from '../assets/next.svg'
import win from '../assets/win.svg'

export default {
  name: 'CarouselMob',

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
      if (this.slideIndex >= 6) this.slideIndex = 0
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
    setIndex3() {
      this.slideIndex = 3
    },
    setIndex4() {
      this.slideIndex = 4
    },
    setIndex5() {
      this.slideIndex = 5
    },
    getPartySvg(partyName) {
      switch (partyName) {
        case '中國國民黨':
          return kmtSvg
        case '民主進步黨':
          return ddpSvg
        case '台灣民眾黨':
          return tmdSvg
        case '無':
          return noParty
        default:
          return null
      }
    },
    getWinSvg() {
      return win
    },
    prevArrow() {
      return prevArrow
    },
    nextArrow() {
      return nextArrow
    },
  },
}
</script>

<style lang="scss" scoped>
.CarouselWrapper {
  position: relative;
  height: 241px;
  width: 268px;
  display: flex;
  font-size: 16px;
  display: block;

  @include media-breakpoint-up(md) {
    width: 668px;
  }

  @include media-breakpoint-up(xl) {
    display: none;
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
  width: 268px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: none;

  @include media-breakpoint-up(md) {
    display: flex;
    width: 668px;
  }
}

.indicator-mo {
  width: 268px;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @include media-breakpoint-up(md) {
    display: none;
  }
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #1d9fb8;
}

.city-title {
  font-weight: 700;
  font-size: 16px;
  color: #bf3284;
}

.button {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #234f74;
}

.city {
  padding: 10px 0;
}
.candidates-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  :not(:last-child) {
    padding-right: 16px;
  }

  @include media-breakpoint-up(md) {
    flex-direction: row;
  }
}
.candidate {
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
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
  width: 268px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  @include media-breakpoint-up(md) {
    width: 212px;
  }
}
.tks-rate {
  width: 10%;
  height: 24px;
  background: #054f77;
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
  color: #ffffff;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}
.tks-rate-number {
  position: absolute;
  top: 2px;
  right: -5px;
  z-index: 9;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #4a4a4a;

  @include media-breakpoint-up(md) {
    display: none;
  }
}
.current-city {
  color: #234f74;

  font-weight: 600;
  font-size: 14px;
}
.buttonsWrapper {
  display: flex;
  gap: 10px;
}
</style>
