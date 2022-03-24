<template>
  <div class="landing">
    <div class="landing-info">
      <div class="landing-info__label">
        <span v-if="shouldShowMemberLabel">
          <UiSectionLabel label="會員專區" />｜
        </span>
        <UiSectionLabel
          :label="sectionLabel"
          :href="sectionLabelHref"
          :style="{ color: sectionLabelColor }"
        />
      </div>
      <UiH1
        class="landing-info__title landing-info__title--default-font"
        :style="titleStyle"
        >{{ title }}</UiH1
      >
    </div>

    <div v-if="coverVideo.src || coverPicture.heroImage.desktop" class="cover">
      <UiTheCover :video="coverVideo" :picture="coverPicture" />
      <UiCaption class="cover__hero-caption">
        {{ heroCaption }}
      </UiCaption>
    </div>
  </div>
</template>

<script>
import UiTheCover from './culture-post-for-premium/UiTheCover.vue'
import UiH1 from './culture-post-for-premium/UiH1.vue'
import UiSectionLabel from './culture-post-for-premium/UiSectionLabel.vue'
import UiCaption from './culture-post-for-premium/UiCaption.vue'

export default {
  components: {
    UiTheCover,
    UiH1,
    UiSectionLabel,
    UiCaption,
  },
  props: {
    shouldShowMemberLabel: {
      type: Boolean,
      default: false,
    },
    sectionLabel: {
      type: String,
      default: '',
    },
    sectionLabelHref: {
      type: String,
      default: null,
    },
    sectionLabelColor: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    titleStyle: {
      type: Object,
      default: () => ({}),
    },
    coverVideo: {
      type: Object,
      default: () => ({}),
    },
    coverPicture: {
      type: Object,
      default: () => ({}),
    },
    heroCaption: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.landing {
  position: relative;
  z-index: 2;
  background-color: white;
}

.landing-info {
  padding: 88px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(md) {
    padding: 112px 0 0 0;
    max-width: 608px;
    margin: 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: 800px;
  }
  &__title {
    margin: 8px 0 0 0;

    &--default-font {
      @include media-breakpoint-up(xl) {
        font-family: inherit;
      }
    }
  }
}

.cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0 0 0;
  @include media-breakpoint-up(xl) {
    margin: 48px 0 0 0;
  }

  &__hero-caption {
    margin: 16px 20px 0 20px;
    width: calc(100% - 40px);
    height: 63.39px;
    @include media-breakpoint-up(md) {
      width: 608px;
      margin: 16px auto 0 auto;
    }
    @include media-breakpoint-up(xl) {
      width: 640px;
    }
  }
}
</style>
