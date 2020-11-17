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
        v-if="item.type === 'header-two' && gainContent(item)"
        :key="item.id"
        v-html="gainContent(item)"
      />

      <p
        v-if="item.type === 'unstyled'"
        :key="item.id"
        v-html="gainContent(item)"
      />
      <!-- eslint-enable vue/no-v-html -->

      <figure v-if="item.type === 'image'" :key="item.id">
        <img v-lazy="gainImgSrc(item)" alt="" />

        <figcaption v-if="gainImgCaption(item)">
          {{ gainImgCaption(item) }}
        </figcaption>
      </figure>

      <ContainerParagraphWithAnnotation
        v-if="item.type === 'annotation' && gainContent(item)"
        v-slot="{ data }"
        :key="item.id"
        :content="gainContent(item)"
      >
        <UiAnnotation :key="data.id" :annotation="data" />
      </ContainerParagraphWithAnnotation>
    </template>
  </article>
</template>

<script>
import ContainerParagraphWithAnnotation from '~/components/ContainerParagraphWithAnnotation.vue'
import UiAnnotation from '~/components/culture-post/UiAnnotation.vue'

export default {
  name: 'UiCulturePostContent',

  components: {
    UiAnnotation,
    ContainerParagraphWithAnnotation,
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

  &::v-deep p {
    font-size: 15px;
    line-height: 2;

    + p {
      margin-top: 30px;
    }
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

    + p {
      margin-top: 40px;
    }
  }

  &::v-deep a {
    color: rgba(199, 159, 101, 0.87);
    text-decoration: underline;
  }
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
</style>
