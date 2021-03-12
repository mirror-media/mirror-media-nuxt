<template>
  <article class="article-body">
    <div v-if="doesHaveBrief" class="brief">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-for="item in brief" :key="item.id" v-html="item.content" />
    </div>

    <ContentHandler v-for="item in content" :key="item.id" :item="item" />
  </article>
</template>

<script>
import ContentHandler from './ContentHandler.vue'

export default {
  name: 'UiArticleBody',

  components: {
    ContentHandler,
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
}
</script>

<style lang="scss" scoped>
.article-body {
  padding-bottom: 60px;
  font-size: 18px;
  line-height: 36px;
  text-align: justify;
  position: relative;
  &--fade-out-bottom {
    &:after {
      position: absolute;
      bottom: 0;
      content: '';
      display: block;
      width: 100%;
      height: 300px;
      background: linear-gradient(180deg, transparent 0%, white 80%);
      pointer-events: none;
    }
  }
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

  &::v-deep {
    a {
      color: rgba(199, 159, 101, 0.87);
      text-decoration: underline;
    }
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
}
</style>
