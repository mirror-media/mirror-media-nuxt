<template>
  <!-- itemprop attribute is for Dable to clawing the story -->
  <article class="story-body" :class="section.name" itemprop="articleBody">
    <div class="story__section-datetime">
      <p
        v-if="!isAdvertised && categoryTitle"
        :class="['story__category', section.name]"
        v-text="categoryTitle"
      />
      <p class="story__published-date" v-text="publishedDate" />
    </div>
    <h1 class="story__title" v-text="story.title" />

    <h2 v-if="story.subtitle" class="story__subtitle">{{ story.subtitle }}</h2>

    <div class="story__credit_wrapper">
      <div
        v-if="credit && isExternalArticle"
        class="story__credit story__credit--external"
      >
        鏡週刊
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="credit" class="story__credit" v-html="credit"></div>
    </div>
    <div class="story__share-and-donate share-and-donate">
      <div class="share">
        <img
          src="../assets/logo@2x.png"
          alt="Mirror Media"
          class="share__logo"
          @click="handleClickHomeLogo"
        />
        <div class="share__br" />
        <UiShareFb class="share__logo" />
        <UiShareLine class="share__logo" />
      </div>
      <div v-if="shouldShowDonate" class="donate">
        <div class="share__br" />
        <UiDonateButton class="share__logo--wider" />
        <UiBeSubscriberButton />
      </div>
    </div>

    <div v-if="heroVideoSrc" class="story__hero">
      <UiStoryVideo :src="heroVideoSrc" :poster="heroVideoPoster" />
      <p v-if="heroCaption" class="story__hero-caption">{{ heroCaption }}</p>
    </div>

    <figure v-else class="g-story-figure story__hero">
      <picture>
        <source media="(min-width: 768px)" :srcset="heroImgTablet" />
        <source :srcset="heroImgMobile" />
        <img :src="heroImgMobile" alt="" />
      </picture>

      <figcaption v-if="heroCaption" v-text="heroCaption" />
    </figure>

    <div v-if="hasBrief" class="story__brief">
      <template v-if="isString(brief)">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="brief" />
      </template>
      <template v-for="paragraph in brief" v-else>
        <UiStoryContentHandler :key="paragraph.id" :paragraph="paragraph" />
      </template>
    </div>

    <template v-if="isString(content)">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="story__external-content" v-html="content" />
    </template>
    <template v-for="paragraph in contents" v-else>
      <UiStoryContentHandler
        :key="paragraph.id"
        :paragraph="paragraph"
        @sendGa="handleSendGa({ eventLabel: 'image' })"
      />
    </template>

    <p v-if="isUpdatedAtVisible" class="story__updated-at">
      更新時間｜<span v-text="updatedAt" />
    </p>
    <UiSupportBox v-if="shouldShowDonate" class="story__donate-banner" />

    <UiSocialNetworkServices style="margin: 30px auto 0 auto" />

    <UiAnniversary class="story__member-info" />

    <slot name="fixedTriggerEnd"></slot>

    <slot name="storyRelateds"></slot>

    <ContainerGptAd class="story__ad" :pageKey="sectionId" adKey="MB_AT3" />

    <p id="story-end" class="g-story-paragraph smaller">
      更多內容，歡迎<a
        :href="SUBSCRIBE_LINK.href"
        target="_blank"
        rel="noopener noreferrer"
        v-text="SUBSCRIBE_LINK.title"
      />、<a
        :href="DIGITAL_LINK.href"
        target="_blank"
        rel="noopener noreferrer"
        v-text="DIGITAL_LINK.title"
      />、<a :href="AUTH_LINK.href" target="_blank" rel="noopener noreferrer"
        >了解內容授權資訊</a
      >。
    </p>
    <div class="magazine">
      <div>月費、年費會員免費線上閱讀動態雜誌</div>
      <button type="button" @click="enterMagazinePage">線上閱讀</button>
    </div>

    <LazyRenderer v-if="doesHaveTags" class="story__tags">
      <p class="title">相關關鍵字：</p>
      <div class="wrapper">
        <a
          v-for="tag in tags"
          :key="tag.id"
          :href="`/tag/${tag.id}/`"
          target="_blank"
          @click="handleSendGa({ eventLabel: 'tag' })"
        >
          {{ tag.name }}
        </a>
      </div>
    </LazyRenderer>

    <div v-if="canAdvertise" class="story__ad story__ad--container">
      <ContainerGptAd :pageKey="sectionId" adKey="PC_E1" />
      <ContainerGptAd :pageKey="sectionId" adKey="PC_E2" />
    </div>

    <slot name="dableWidget"></slot>

    <transition name="fade">
      <ClientOnly v-if="shouldOpenShareSidebox">
        <UiShareSidebox class="story__share-sidebox" @sendGa="handleSendGa" />
      </ClientOnly>
    </transition>
  </article>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { ref, computed, onMounted, useContext } from '@nuxtjs/composition-api'

import UiStoryContentHandler from './UiStoryContentHandler.vue'
import UiBeSubscriberButton from './UiBeSubscriberButton.vue'
import UiSupportBox from './UiSupportBoxBox.vue'
import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'
import UiDonateButton from '~/components/UiDonateButton.vue'
import UiStoryVideo from '~/components/UiStoryVideo.vue'
import UiShareSidebox from '~/components/UiShareSidebox.vue'
import UiSocialNetworkServices from '~/components/UiSocialNetworkServices.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiAnniversary from '~/components/UiAnniversary.vue'

import {
  AUTH_LINK,
  SUBSCRIBE_LINK,
  SITE_OG_IMG,
  DIGITAL_LINK,
} from '~/constants/index.js'
import { creditHtml, getFormattedTimeStr } from '~/utils/article.js'

const THE_LAST_NUM_AD_INSERT_API_DATA_UNSTYLED_AND_NOT_EMPTY = 6
const AD_KEYS_IN_STORY_CONTENT = ['MB_AT1', 'PC_AT1', 'MB_AT2']

export default {
  name: 'ContainerStoryBody',
  setup() {
    const { store } = useContext()
    const isViewportWidthUpMd = computed(
      () => store.getters['viewport/isViewportWidthUpMd']
    )
    const shouldOpenShareSidebox = useToggleShareSidebox(isViewportWidthUpMd)

    return {
      shouldOpenShareSidebox,
    }
  },
  components: {
    UiSocialNetworkServices,
    UiStoryContentHandler,
    UiShareFb,
    UiShareLine,
    UiDonateButton,
    UiStoryVideo,
    UiShareSidebox,
    ContainerGptAd,
    UiAnniversary,
    UiBeSubscriberButton,
    UiSupportBox,
  },
  props: {
    story: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      AUTH_LINK,
      SUBSCRIBE_LINK,
      DIGITAL_LINK,
    }
  },
  computed: {
    ...mapState(['canAdvertise']),
    ...mapGetters({
      isLoggedIn: 'membership/isLoggedIn',
    }),

    shouldShowDonate() {
      const slug = this.$route?.params?.slug ?? ''
      if (/^\d{8}(mkt|cnt|prf|corpmkt)/.test(slug)) {
        return false
      } else if (this.isExternalArticle) {
        return false
      }
      return this.$config.donateFeatureToggle
    },

    brief() {
      if (this.isString(this.story.brief)) {
        return this.story.brief
      }

      const data = this.story.brief?.apiData ?? []
      return data.filter((paragraph) => paragraph.type === 'unstyled')
    },
    categoryTitle() {
      return this.story.categories?.[0]?.title
    },
    credit() {
      return creditHtml(this.story)
    },

    apiData() {
      return this.content?.apiData ?? []
    },
    content() {
      return this.story.content
    },
    contents() {
      const {
        // MB_AT1 出現位置：第一段文字下，第二段文字上（若無第二段，則不出現）
        0: idxAdMbAt1,
        1: hasIdxAfterAdMbAt1,

        // PC_AT1 出現位置：第三段文字下，第四段文字上（若無第四段，則不出現）
        2: idxAdPcAt1,
        3: hasIdxAfterAdPcAt1,

        // MB_AT2 出現位置：第五段文字下，第六段文字上（若無第六段，則不出現）
        4: idxAdMbAt2,
        5: hasIdxAfterAdMbAt2,
      } = this.idxesOfApiDataUnstyledAndNotEmpty

      const [adMbAt1, adPcAt1, adMbAt2] = AD_KEYS_IN_STORY_CONTENT.map(
        buildAdContent.bind(this)
      )

      return [
        ...this.apiData.slice(
          0,
          idxAdMbAt1 !== undefined ? idxAdMbAt1 + 1 : undefined
        ),
        ...insertIfNotUndefined(hasIdxAfterAdMbAt1, adMbAt1),
        ...insertIfNotUndefined(
          idxAdMbAt1,
          this.apiData.slice(
            idxAdMbAt1 + 1,
            idxAdPcAt1 !== undefined ? idxAdPcAt1 + 1 : undefined
          )
        ),
        ...insertIfNotUndefined(hasIdxAfterAdPcAt1, adPcAt1),
        ...insertIfNotUndefined(
          idxAdPcAt1,
          this.apiData.slice(
            idxAdPcAt1 + 1,
            idxAdMbAt2 !== undefined ? idxAdMbAt2 + 1 : undefined
          )
        ),
        ...insertIfNotUndefined(hasIdxAfterAdMbAt2, adMbAt2),
        ...insertIfNotUndefined(idxAdMbAt2, this.apiData.slice(idxAdMbAt2 + 1)),
      ]

      function buildAdContent(adKey) {
        return {
          type: 'gpt-ad',
          pageKey: this.sectionId,
          adKey,
        }
      }

      function insertIfNotUndefined(idx, elems) {
        elems = Array.isArray(elems) ? elems : [elems]

        return idx !== undefined ? elems : []
      }
    },
    idxesOfApiDataUnstyledAndNotEmpty() {
      const idxes = {}

      {
        let keyIdx = 0
        let idxApiData = 0

        while (
          keyIdx < THE_LAST_NUM_AD_INSERT_API_DATA_UNSTYLED_AND_NOT_EMPTY &&
          this.apiData[idxApiData]
        ) {
          const datum = this.apiData[idxApiData]

          if (
            datum.type === 'unstyled' &&
            datum.content.join('').trim() !== ''
          ) {
            idxes[keyIdx] = idxApiData

            keyIdx += 1
          }

          idxApiData += 1
        }
      }

      return idxes
    },
    hasBrief() {
      return this.brief.length > 0
    },

    heroVideo() {
      return this.story.heroVideo || {}
    },
    heroVideoSrc() {
      return this.heroVideo.video?.url || false
    },
    heroVideoPoster() {
      return (
        this.heroVideo.coverPhoto?.image?.resizedTargets?.mobile?.url || false
      )
    },

    heroImgMobile() {
      return (
        (this.story.heroImage?.image?.resizedTargets?.mobile?.url ||
          this.story.thumb) ??
        SITE_OG_IMG
      )
    },
    heroImgTablet() {
      return (
        (this.story.heroImage?.image?.resizedTargets?.tablet?.url ||
          this.story.thumb) ??
        SITE_OG_IMG
      )
    },
    heroCaption() {
      return this.story.heroCaption ?? ''
    },
    isAdvertised() {
      return this.story.isAdvertised
    },
    isUpdatedAtVisible() {
      return (
        this.story.updatedAt &&
        this.story.updatedAt !== this.story.publishedDate &&
        this.updatedAt !== 'Invalid Date'
      )
    },
    publishedDate() {
      return getFormattedTimeStr(this.story.publishedDate)
    },
    section() {
      return this.story.sections?.[0] ?? {}
    },
    sectionId() {
      if (this.section.name === 'mirrorcolumn') {
        return '5964418a4bbe120f002a3198'
      }
      if (this.section.name === 'life') {
        return 'other'
      }
      return this.section.id ?? 'other'
    },
    updatedAt() {
      return getFormattedTimeStr(this.story.updatedAt)
    },
    tags() {
      return this.story.tags || []
    },
    doesHaveTags() {
      return this.tags.length > 0
    },
    isExternalArticle() {
      return this.story?.partner
    },
  },

  methods: {
    enterMagazinePage() {
      this.enterPageAfterLoggedIn('/magazine/')
    },
    enterPageAfterLoggedIn(pagePath) {
      if (this.isLoggedIn) {
        window.location.href = pagePath
      } else {
        window.location.href = `/login/?destination=${pagePath}`
      }
    },
    handleSendGa(param = {}) {
      this.$ga.event({
        eventCategory: 'article',
        eventAction: 'click',
        ...param,
      })
    },
    isString(value) {
      return typeof value === 'string'
    },
    handleClickHomeLogo() {
      window.location.href = '/'
    },
  },
}

function useToggleShareSidebox(isViewportWidthUpMd) {
  const hasScrolled = ref(false)
  const shouldOpenShareSidebox = computed(
    () => isViewportWidthUpMd.value && hasScrolled.value
  )

  onMounted(() => {
    window.addEventListener(
      'scroll',
      function setHasScrolled() {
        hasScrolled.value = true
      },
      { once: true }
    )
  })

  return shouldOpenShareSidebox
}

export {
  THE_LAST_NUM_AD_INSERT_API_DATA_UNSTYLED_AND_NOT_EMPTY,
  AD_KEYS_IN_STORY_CONTENT,
}
</script>

<style lang="scss" scoped>
.story-body {
  color: #000;
  line-height: 1.15;
  word-break: break-word;

  @each $name, $color in $sections-color {
    &.#{$name} {
      .story__category::before,
      .story__brief {
        background-color: $color;
      }
    }
  }

  &::v-deep > * {
    width: calc(100% - 50px);
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(xl) {
      width: 100%;
    }

    + p {
      margin-top: 1.5em;
    }

    + figure,
    + ul,
    + ol {
      margin-top: 20px;
    }
  }

  .g-story-quote-by {
    @include media-breakpoint-up(md) {
      max-width: 575px;
    }
    @include media-breakpoint-up(xl) {
      max-width: 625px;
    }

    + * {
      margin-top: 70px;
    }
  }
}

.story {
  &__section-datetime {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 13px;
  }
  &__category {
    color: #34495e;
    font-size: 21px;
    &::before {
      content: '';
      position: relative;
      top: 2px;
      display: inline-block;
      width: 7px;
      height: 1em;
      margin-right: 10px;
      vertical-align: text-top;
      background-color: #000;
    }
  }
  &__published-date {
    margin: 0 0 0 auto;
    color: #a1a1a1;
    font-size: 16px; // 1rem
    font-style: italic;
    font-weight: 400;
    @include media-breakpoint-up(md) {
      font-size: 17px;
    }
  }
  &__title {
    margin-bottom: 25px;
    font-size: 28px; // 1.75rem
    font-weight: 400;
    line-height: 1.25;
    @include media-breakpoint-up(md) {
      margin-top: 25px;
      font-size: 32px;
    }
  }

  &__subtitle {
    font-size: 24px;
    line-height: 1.5;
    margin-bottom: 50px;
  }

  &__brief {
    padding: 1em 2em;
    margin-top: 30px;
    color: #fff;
    font-size: 19.2px; // 1.2rem
    font-weight: 700;
    line-height: 36px;
    background-color: #000;
    &::v-deep {
      .g-story-paragraph {
        color: #fff;
        font-size: 19.2px; // 1.2rem
        a {
          &:link,
          &:visited,
          &:hover,
          &:active {
            color: #fff;
            border-color: #fff;
          }
        }
        + .g-story-paragraph {
          margin-top: 1.5em;
        }
      }
    }
  }
  &__credit_wrapper {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  &__credit {
    color: #34495e;
    margin-top: 25px;
    margin-bottom: 25px;
    line-height: 1.5;

    &--external {
      margin-right: 16px;
      padding: 4px 8px;
      border: 1px solid #34495e;
      border-radius: 2px;
    }
    &::v-deep a {
      color: #0b4fa2;
    }
  }

  &__share-and-donate {
    display: flex;
    margin-bottom: 45px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px 0px;
    @include media-breakpoint-up(md) {
      flex-direction: row;
      align-items: center;
    }
    .share,
    .donate {
      display: flex;
      align-items: center;
    }
    .donate {
      margin-right: 8px;
      .share__br {
        display: none;
        @include media-breakpoint-up(md) {
          display: block;
        }
      }
    }
    .share__br {
      content: '';
      display: block;
      margin: 0 20px;
      width: 1px;
      height: 16px;
      background: #a1a1a1;
    }

    .share__logo {
      width: 35px;
      display: flex;
      &--wider {
        width: fit-content;
      }
      &:hover {
        cursor: pointer;
      }
      + .share__logo {
        margin-left: 10px;
      }
    }
  }

  &__hero {
    width: 100%;

    figcaption,
    &-caption {
      max-width: 645px;
      margin-top: 8px;
      padding-left: 25px;
      padding-right: 25px;
      color: #34495e;
      font-size: 16px;
      line-height: 1.3;
      @include media-breakpoint-up(md) {
        padding-left: 0;
        padding-right: 0;
        margin-left: auto;
        margin-right: auto;
      }
      @include media-breakpoint-up(xl) {
        max-width: none;
      }
    }
  }

  &__updated-at {
    color: #064f77;

    span {
      color: #61a4cd;
    }
  }

  &__member-info {
    margin: 30px auto 0;
  }
  &__donate-banner {
    margin-top: 24px;
    @include media-breakpoint-up(md) {
      margin-top: 32px;
    }
  }
  &__tags {
    margin-top: 1.5em;
    margin-bottom: -0.6em;

    .title {
      color: #a0a0a0;
      margin-bottom: 0.5em;
    }

    .wrapper {
      display: flex;
      flex-wrap: wrap;
      line-height: 1.6;

      @include media-breakpoint-up(sm) {
        font-size: 18px;
        line-height: inherit;
      }
    }

    a {
      background-color: #c8c8c8;
      color: #fff;
      padding: 0.2em 0.4em;
      margin-right: 0.5em;
      margin-bottom: 0.6em;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__share-sidebox {
    width: 30px;
    position: fixed;
  }

  &__ad {
    width: 100%;
    margin-top: 1.5em;

    &--container {
      display: flex;
      justify-content: space-around;
    }
  }
}

.magazine {
  margin-top: 24px;
  background-color: #1d9fb8;
  padding: 16px;
  color: #fff;
  font-size: 18px;
  line-height: 1.6;
  text-align: center;
  @include media-breakpoint-up(xl) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 16px 40px;
    font-size: 20px;
  }

  button {
    width: 100%;
    background-color: #fff;
    border-radius: 2px;
    line-height: 1.38;
    color: #1d9fb8;
    padding: 12px 4px;
    margin-top: 16px;
    font-size: 18px;
    @include media-breakpoint-up(xl) {
      margin-top: 0;
      max-width: 179px;
    }
  }
}

.fade {
  &-enter-active {
    transition: opacity 0.3s;
  }

  &-enter {
    opacity: 0;
  }
}
</style>

<style lang="scss">
@function border($width, $color) {
  @return $width solid $color;
}

$quote-by-color: #255577;
$quote-by-border: border(3px, $quote-by-color);
$link-color: #3195b3;

.story-body code {
  white-space: pre-wrap;
  color: #34495e;
}

.g-story {
  &-heading,
  h1,
  h2 {
    color: #000;
    font-size: 24px; // 1.5rem
  }

  &-paragraph,
  p {
    color: #171717;
    font-size: 18px;
    line-height: 36px;

    &.smaller {
      font-size: 16px;
      line-height: 1.5;
    }
  }

  &-figure,
  figure {
    img {
      width: 100%;

      &[lazy='loading'] {
        height: 250px;
        object-fit: contain;
      }
    }
  }

  &-caption,
  &-figure figcaption,
  figure figcaption {
    margin-top: 10px;
    color: rgba(#000, 0.498);
    font-size: 15px;
    line-height: 1.7;
  }

  &-quote-by {
    position: relative;
    padding: 20px 0 0 30px;
    margin-top: 70px;
    color: $quote-by-color;
    font-size: 24px;
    line-height: 44px;
    text-align: right;
    border-top: $quote-by-border;
    border-left: $quote-by-border;
    @include media-breakpoint-up(md) {
      width: 575px;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
    }

    &::before {
      top: -50px;
      left: 60px;
      border-width: 50px 0 0 70px;
      border-color: transparent transparent transparent $quote-by-color;
    }

    &::after {
      top: -44px;
      left: 63px;
      border-width: 44px 0 0 62px;
      border-color: transparent transparent transparent #fff;
    }
    &__quote {
      text-align: left;
    }
    &__quote-by {
      font-size: 18px;
      line-height: 1.15;
      &::before {
        content: '──';
        margin-right: 5px;
      }
    }
  }

  &-ordered-list,
  &-unordered-list,
  ol,
  ul {
    list-style: none;
    padding: 0 0 0 40px;
    color: rgba(0, 0, 0, 0.702);
    line-height: 2.2;
    letter-spacing: 0.3px;
  }

  &-ordered-list,
  ol {
    counter-reset: li;

    li {
      counter-increment: li;

      &::before {
        content: counter(li) '. ';
        color: #004ea2;
        margin-right: 10px;
      }
    }
  }

  &-unordered-list,
  ul {
    li::before {
      content: '•';
      display: inline-block;
      width: 26px;
      color: #2d5b7b;
      font-size: 30px;
      line-height: 1;
      vertical-align: top;
    }
  }

  &-paragraph,
  &-ordered-list,
  &-unordered-list,
  &-quote-by,
  p,
  ol,
  ul {
    a {
      &:link,
      &:visited,
      &:hover,
      &:active {
        padding-bottom: 5px;
        color: $link-color;
        border-bottom: border(1px, $link-color);
      }

      * {
        text-decoration: none;
      }
    }
  }
}
</style>
