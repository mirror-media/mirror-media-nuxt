<template>
  <article class="content">
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

      <figure v-else-if="item.type === 'image'" :key="item.id">
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
  name: 'UiCulturePostContent',

  components: {
    UiAnnotation,
    ContainerParagraphWithAnnotation,

    SvgQuoteIcon,
  },

  props: {
    content: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  methods: {
    gainContent(item = {}) {
      return item.content?.[0]
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

.content {
  width: 300px;
  padding-top: 50px;
  padding-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  border-top: solid 1px #979797;
  @include media-breakpoint-up(md) {
    width: 700px;
    padding-bottom: 62px;
    border-top: none;
  }
  @include media-breakpoint-up(lg) {
    padding-top: 73px;
  }

  > * {
    width: 266px;
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(md) {
      width: 634px;
    }

    + * {
      margin-top: 30px;
    }
  }

  &::v-deep a {
    color: rgba(199, 159, 101, 0.87);
    text-decoration: underline;
  }
}

p {
  font-size: 15px;
  line-height: 2;
}

h2,
h3 {
  font-family: source-han-serif-tc, 'Songti TC', serif;
  font-weight: 900;
  line-height: 1.5;
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

  img {
    width: 100%;
    min-height: 100px;
    font-size: 13px;
    border-radius: 4px;
  }

  figcaption {
    width: 266px;
    padding-top: 10px;
    margin-top: 12px;
    margin-left: auto;
    margin-right: auto;
    color: rgba(#000, 0.66);
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: 1px;
    border-top: 1px solid #979797;
    @include media-breakpoint-up(md) {
      width: 634px;
    }
    @include media-breakpoint-up(lg) {
      margin-top: 16px;
    }
  }
}

.quote {
  max-width: 510px;
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
</style>
