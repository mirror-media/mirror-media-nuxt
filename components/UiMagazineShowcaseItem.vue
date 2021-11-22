<template>
  <div :class="{ mobile: isMobile }">
    <a :href="onlineLink" target="_blank" class="magazine">
      <UiMagazineShowcaseItemCoverImg
        :coverImgUrl="coverImgUrl"
        :onlineLink="onlineLink"
        @click="$emit('downloadLinkClick')"
      />
      <p class="magazine__label label" v-text="label" />
      <h1 class="magazine__title title" v-text="title" />
    </a>
    <div class="magazine__button-group">
      <UiMagazineLinkSmall
        class="magazine__button-group_online-link online-link"
        :href="onlineLink"
        :isPremium="true"
        target="_blank"
        rel="noreferrer noopener"
      >
        <ReadOnlineSvg />線上閱讀
      </UiMagazineLinkSmall>
      <UiMagazineLinkSmall
        class="magazine__button-group_downliad-link download-link"
        :href="downloadLink"
        :isPremium="false"
        target="_blank"
        rel="noreferrer noopener"
      >
        <DownloadSvg />
        <p v-if="isMobile">下載雜誌</p>
      </UiMagazineLinkSmall>
    </div>
  </div>
</template>

<script>
import UiMagazineShowcaseItemCoverImg from './UiMagazineShowcaseItemCoverImg.vue'
import UiMagazineLinkSmall from './UiMagazineLinkSmall.vue'
import ReadOnlineSvg from '~/assets/magazine-online.svg?inline'
import DownloadSvg from '~/assets/magazine-download.svg?inline'

export default {
  components: {
    UiMagazineShowcaseItemCoverImg,
    UiMagazineLinkSmall,
    ReadOnlineSvg,
    DownloadSvg,
  },
  props: {
    coverImgUrl: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    downloadLink: {
      type: String,
      default: '',
    },
    onlineLink: {
      type: String,
      default: '',
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.magazine {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__label {
    margin: 12px 0 0 0;
  }
  &__title {
    margin: 2px 0 0 0;
  }

  &__button-group {
    display: flex;
    margin: 4px 0 0 0;
    a + a {
      margin: 0 0 0 4px;
    }
    svg {
      path {
        fill: #054f77;
      }
    }

    @include media-breakpoint-up(xl) {
      max-width: 144px;
      margin: 0 auto;
    }
  }
}

.cover-img {
  width: 132px;
  min-width: 132px;
  height: 178px;
  min-height: 178px;
  object-fit: cover;
  @include media-breakpoint-up(md) {
    width: 144px;
    min-width: 144px;
    height: 194px;
    min-height: 194px;
  }
}

.label {
  font-size: 16px;
  color: #1d9fb8;
}

.title {
  font-size: 20px;
  font-weight: 400;
  color: #4a4a4a;
  text-align: center;
}

.mobile {
  .magazine__button-group {
    flex-direction: column;
    a + a {
      margin: 8px 0 0 0;
    }
  }
}

.download-link {
  p {
    margin: 0 0 0 4px;
  }
  svg path {
    fill: rgba(0, 0, 0, 0.66);
    fill-opacity: 1;
    &:hover,
    &:active {
      fill: rgba(0, 0, 0, 0.87);
    }
  }
}
</style>
