<template>
  <a :href="href" :target="target" class="article" rel="noopener noreferrer">
    <div class="article__top-wrapper top-wrapper">
      <div v-lazy-container="{ selector: 'img' }" class="top-wrapper__img img">
        <img :data-src="imgSrc" alt="" />
      </div>
    </div>
    <div
      class="article__bottom-wrapper bottom-wrapper"
      :style="{
        backgroundColor: infoBackgroundColor,
      }"
    >
      <h1 class="bottom-wrapper__title title" v-text="infoTitle" />
      <div class="bottom-wrapper__description-date-wrapper">
        <p
          class="bottom-wrapper__description description"
          v-text="infoDescription"
        />
        <p class="bottom-wrapper__date date" v-text="theInfoDate" />
      </div>
    </div>
  </a>
</template>

<script>
import { SITE_OG_IMG } from '~/constants/index.js'
import { getFormattedTimeStr } from '~/utils/article'

export default {
  props: {
    href: {
      type: String,
      default: '/',
      required: true,
    },
    target: {
      type: String,
      default: '_blank',
    },
    imgSrc: {
      type: String,
      default: SITE_OG_IMG,
      required: true,
    },
    infoTitle: {
      type: String,
      default: '',
      required: true,
    },
    infoDescription: {
      type: String,
      default: '',
      required: true,
    },
    infoBackgroundColor: {
      type: String,
      default: 'transparent',
    },
    infoDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  computed: {
    showImgText() {
      return this.imgText && this.imgText !== ''
    },
    theInfoDate() {
      return getFormattedTimeStr(this.infoDate)
    },
  },
}
</script>

<style lang="scss" scoped>
.article {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.06);
    width: 320px;
    border-radius: 6px;
    overflow: hidden;
  }
}

.top-wrapper {
  position: relative;
  background-color: white;
  height: calc((100vw - 20px * 2) * 0.6642);
  @include media-breakpoint-up(md) {
    height: 213px;
  }
}

.img {
  height: 100%;
  position: relative;
  img {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    &[lazy='loading'] {
      width: 30%;
      height: auto;
      left: 35%;
      bottom: 25%;
    }
  }
}

.bottom-wrapper {
  padding: 12px 0 0 0;
  text-align: justify;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;
  @include media-breakpoint-up(md) {
    padding: 16px 24px 24px;
    background-color: white !important;
  }

  &__description {
    display: none !important;
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
      display: -webkit-box !important;
    }
  }
  &__date {
    margin: 8px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 12px 0 0 0;
    }
  }
}

.title {
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  text-align: justify;
  color: #4a4a4a;
  letter-spacing: 1px;
  @include media-breakpoint-up(md) {
    font-size: 20px;
    letter-spacing: initial;
  }
}

.description {
  font-size: 16px;
  line-height: 150%;
  text-align: justify;
  color: #9b9b9b;
  font-weight: 300;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.date {
  font-size: 14px;
  line-height: 20px;
  color: #9b9b9b;
}
</style>
