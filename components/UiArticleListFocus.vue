<template>
  <div class="article-list-focus">
    <ul class="list">
      <li>
        <article>
          <a
            :href="$getHref(articleMain)"
            target="_blank"
            rel="noopener noreferrer"
            @click="emitGa"
          >
            <img v-lazy="$getImage(articleMain, 'mobile')" alt="" />
            <h1 class="main-title">{{ articleMain.title }}</h1>
          </a>
        </article>
      </li>

      <li v-for="related in articlesRelated" :key="related.id">
        <article>
          <a
            :href="$getHref(related)"
            target="_blank"
            rel="noopener noreferrer"
            @click="emitGa"
          >
            <h1>{{ related.title }}</h1>
          </a>
        </article>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UiArticleListFocus',
  props: {
    articleMain: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    articlesRelated: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      ga: {
        eventCategory: 'home',
        eventAction: 'click',
        eventLabel: 'group',
      },
    }
  },
  methods: {
    emitGa() {
      this.$emit('sendGa', this.ga)
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  color: rgba(0, 0, 0, 0.65);
  font-size: 20.8px;
  font-weight: 300;
  line-height: 1.3;
  text-align: justify;
  @include media-breakpoint-up(xl) {
    color: rgba(0, 0, 0, 0.35);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.4;
    text-align: left;
  }
  li {
    @include media-breakpoint-up(xl) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      &:last-child {
        display: none;
      }
    }
    + li {
      border-top: 2px solid #d7d7d7;
      @include media-breakpoint-up(xl) {
        border-top: none;
      }
    }
  }
  a {
    display: block;
    cursor: pointer;
    user-select: none;
  }
  img {
    width: 100%;
  }
  h1 {
    margin-top: 10px;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-wrap: break-word;
    &.main-title {
      margin-top: 13px;
      @include media-breakpoint-up(xl) {
        margin-top: 10px;
      }
    }
  }
}
</style>
