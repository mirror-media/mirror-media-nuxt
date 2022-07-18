<template>
  <a
    :href="articleHref"
    :target="target"
    class="article"
    :class="{ 'article--premium': isPremiumMember }"
    rel="noopener noreferrer"
    @click="handleClick"
  >
    <div class="article__top-wrapper top-wrapper">
      <div v-lazy-container="{ selector: 'img' }" class="top-wrapper__img img">
        <img :data-src="imgSrc" alt="" />
      </div>
      <span
        v-if="showImgText"
        class="top-wrapper__text"
        :style="{
          backgroundColor: imgTextBackgroundColor,
        }"
        v-text="imgText"
      />
    </div>
    <div
      class="article__bottom-wrapper bottom-wrapper"
      :class="{ 'bottom-wrapper--premium': isPremiumMember }"
      :style="{
        backgroundColor: infoBackgroundColor,
      }"
    >
      <h1
        class="bottom-wrapper__title"
        :class="{ 'bottom-wrapper__title--premium': isPremiumMember }"
        v-text="infoTitle"
      />
      <p
        class="bottom-wrapper__text"
        :class="{ 'bottom-wrapper__text--premium': isPremiumMember }"
        v-text="infoDescription"
      />
    </div>
  </a>
</template>

<script>
import { SITE_OG_IMG } from '~/constants/index.js'

export default {
  props: {
    href: {
      type: String,
      default: '/',
      required: true,
    },
    redirectHref: {
      type: String,
      default: undefined,
      required: false,
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
    imgText: {
      type: String,
      default: '',
      required: true,
    },
    imgTextBackgroundColor: {
      type: String,
      default: '#bcbcbc',
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
      default: 'white',
    },
  },
  data() {
    return {
      ga: {
        eventCategory: 'listing',
        eventAction: 'click',
        eventLabel: 'latest',
      },
    }
  },

  computed: {
    shouldUseRedirectLink() {
      return this.$config.redirectLinkFeatureToggle === 'on'
    },
    articleHref() {
      if (!this.shouldUseRedirectLink) {
        return this.href
      }
      let articleHref
      const redirectHref = this.redirectHref?.trim()
      if (!redirectHref) {
        articleHref = this.href
      } else if (
        redirectHref.startsWith('https://') ||
        redirectHref.startsWith('http://')
      ) {
        articleHref = redirectHref
      } else {
        articleHref = `/story/${redirectHref}`
      }
      return articleHref
    },
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
    showImgText() {
      return this.imgText && this.imgText !== ''
    },
  },
  methods: {
    handleClick() {
      this.$ga.event(this.ga)
    },
  },
}
</script>

<style lang="scss" scoped>
.article {
  box-shadow: 5px 5px 5px #bcbcbc;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  &--premium {
    box-shadow: none;
  }
  &__bottom-wrapper {
    flex: 1 1 auto;
  }
  @include media-breakpoint-up(xl) {
    transition: all 0.3s ease-in-out;
    &:hover {
      transform: translateY(-20px);
      box-shadow: 5px 5px 5px #bcbcbc;
    }
    &--premium:hover {
      box-shadow: none;
    }
  }
}

.top-wrapper {
  position: relative;
  background-color: white;
  &__text {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 8px;
    line-height: 1;
    font-size: 16px;
    color: white;
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.img {
  padding-top: 66.66%;
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
  padding: 15px 30px;
  text-align: justify;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &--premium {
    padding: 20px 20px 36px;
    @include media-breakpoint-up(md) {
      padding: 20px;
    }
  }
  &__title {
    font-size: 20.8px;
    font-weight: 300;
    color: #34495e;
    line-height: 1.3;
    &--premium {
      color: #054f77;
      font-size: 18px;
      font-weight: 400;
      line-height: 25px;
    }
  }
  &__text {
    font-size: 16px;
    font-weight: 300;
    color: #999;
    line-height: 1.5;
    margin: 10px 0 0 0;
    word-wrap: break-word;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    &--premium {
      color: #979797;
      margin: 20px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 36px 0 0 0;
      }
    }
  }
}
</style>
