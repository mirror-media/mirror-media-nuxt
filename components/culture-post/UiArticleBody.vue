<template>
  <article class="article-body">
    <div v-if="doesHaveBrief" class="brief">
      <p v-for="item in brief" :key="item.id">{{ item.content }}</p>
    </div>

    <!--
      TODO: 改用更好的 render 方式，理由請見：https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential
    -->
    <template v-for="item in content">
      <!-- eslint-disable vue/no-v-html -->
      <h2
        v-if="item.type === 'header-one' && gainContent(item)"
        :id="`header-${item.id}`"
        :key="item.id"
        v-html="gainContent(item)"
      />

      <h3
        v-else-if="item.type === 'header-two' && gainContent(item)"
        :key="item.id"
        v-html="gainContent(item)"
      />
      <!-- eslint-enable vue/no-v-html -->

      <figure
        v-else-if="item.type === 'image'"
        :key="item.id"
        :class="gainAlignment(item)"
      >
        <img v-lazy="gainImgSrc(item)" alt="" />

        <figcaption v-if="gainImgCaption(item)">
          {{ gainImgCaption(item) }}
        </figcaption>
      </figure>

      <!-- eslint-disable vue/no-v-html -->
      <div
        v-else-if="item.type === 'blockquote' && gainContent(item)"
        :key="item.id"
        class="quote"
      >
        <div class="quote-icon-wrapper">
          <SvgQuoteIcon />
        </div>

        <blockquote v-html="gainContent(item)"></blockquote>
      </div>
      <!-- eslint-enable vue/no-v-html -->

      <ContainerParagraphWithAnnotation
        v-else-if="item.type === 'annotation' && gainContent(item)"
        v-slot="{ data }"
        :key="item.id"
        :content="gainContent(item)"
      >
        <UiAnnotation :key="data.id" :content="data" />
      </ContainerParagraphWithAnnotation>

      <!-- eslint-disable vue/no-v-html -->
      <p
        v-else-if="item.type === 'unstyled'"
        :key="item.id"
        v-html="gainContent(item)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </template>
  </article>
</template>

<script>
import ContainerParagraphWithAnnotation from '~/components/ContainerParagraphWithAnnotation.vue'
import UiAnnotation from '~/components/culture-post/UiAnnotation.vue'

import SvgQuoteIcon from '~/assets/quote.svg?inline'

export default {
  name: 'UiArticleBody',

  components: {
    UiAnnotation,
    ContainerParagraphWithAnnotation,

    SvgQuoteIcon,
  },

  props: {
    brief: {
      type: Array,
      default: () => [],
      required: true,
    },
    content: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  computed: {
    doesHaveBrief() {
      return this.brief.length > 0
    },
  },

  methods: {
    gainContent(item = {}) {
      return item.content?.[0]
    },

    gainAlignment(item = {}) {
      // 不需要 'center' 來判斷樣式，故排除
      return item.alignment !== 'center' && item.alignment
    },
    gainImgSrc(item = {}) {
      return item.content?.[0]?.tablet?.url
    },
    gainImgCaption(item = {}) {
      return item.content?.[0]?.description
    },
  },
}
</script>

<style lang="scss" scoped>
$quote-color: #4a90e2;

.article-body {
  padding-bottom: 60px;
  font-size: 15px;
  line-height: 2;
  @include media-breakpoint-up(md) {
    padding-bottom: 50px;
  }

  > * {
    margin: 40px auto;
    padding-left: 27px;
    padding-right: 27px;
    @include media-breakpoint-up(md) {
      padding-left: 33px;
      padding-right: 33px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &::v-deep a {
    color: rgba(199, 159, 101, 0.87);
    text-decoration: underline;
  }

  .brief {
    margin-bottom: 48px;
    @include media-breakpoint-up(lg) {
      margin-bottom: 120px;
      font-size: 18px;
      line-height: 1.67;
    }

    + * {
      margin-top: 0;
    }

    p + p {
      margin-top: 2em;
    }
  }

  h2,
  h3 {
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 60px;
  }

  h2 {
    font-size: 28px;
    @include media-breakpoint-up(lg) {
      font-size: 30px;
    }
  }

  h3 {
    font-size: 18px;
  }

  figure {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    @include media-breakpoint-up(md) {
      &.left,
      &.right {
        clear: both;
        width: 300px;
        margin-bottom: 35px;

        figcaption {
          margin-left: 0;
          margin-right: 0;
        }
      }

      &.left {
        float: left;
        margin-right: 35px;
        padding-left: 33px;
      }

      &.right {
        float: right;
        margin-left: 35px;
        padding-right: 33px;
      }
    }

    img {
      width: 100%;
      border-radius: 4px;
    }

    figcaption {
      padding-top: 10px;
      margin-top: 12px;
      margin-left: 17px;
      margin-right: 17px;
      color: rgba(#000, 0.66);
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: 1px;
      border-top: 1px solid #979797;
      @include media-breakpoint-up(lg) {
        margin-top: 16px;
        margin-left: 33px;
        margin-right: 33px;
      }
    }
  }

  .quote {
    max-width: 510px;
    margin: 30px auto;
  }

  .quote-icon-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 11px;

    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 1px;
      background-color: $quote-color;
    }

    svg {
      width: 20px;
      height: auto;
      flex-shrink: 0;
      margin-left: 33px;
      margin-right: 33px;
    }
  }

  blockquote {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.78;
    color: $quote-color;
    text-align: justify;
  }
}
</style>
