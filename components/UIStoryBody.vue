<template>
  <article class="story">
    <div class="story__section-datetime">
      <p :class="['story__category', section.name]" v-text="category.title" />
      <p class="story__published-date" v-text="publishedDate" />
    </div>
    <h1 class="story__title" v-text="story.title" />
    <picture class="story__hero-img">
      <img v-lazy="heroImage" :alt="story.heroCaption" />
      <figcaption v-text="story.heroCaption" />
    </picture>
    <template v-for="paragraph in content">
      <UIStoryContentHandler :key="paragraph.id" :paragraph="paragraph" />
    </template>
    <p class="smaller">
      更多內容，歡迎<a
        :href="SUBSCRIBE_LINK.href"
        target="_blank"
        rel="noopener noreferrer"
        v-text="SUBSCRIBE_LINK.title"
      />、<a :href="AUTH_LINK.href" target="_blank" rel="noopener noreferrer"
        >了解內容授權資訊</a
      >。
    </p>
  </article>
</template>

<script>
import UIStoryContentHandler from './UIStoryContentHandler.vue'
import { AUTH_LINK, SUBSCRIBE_LINK } from '~/constants/index'

export default {
  name: 'UIStoryBody',
  components: {
    UIStoryContentHandler,
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
    }
  },
  computed: {
    category() {
      return this.story.categories?.[0] ?? {}
    },
    content() {
      return this.story.content?.apiData ?? []
    },
    heroImage() {
      return (
        this.story.heroImage?.image?.resizedTargets?.mobile?.url ??
        require('~/assets/notImage.png')
      )
    },
    publishedDate() {
      return this.$dayjs(this.story.publishedDate).format('YYYY.MM.DD HH:mm')
    },
    section() {
      return this.story.sections?.[0] ?? {}
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  h1,
  h2 {
    color: #000;
    font-size: 24px; // 1.5rem
    text-align: left;
  }

  p {
    color: #171717;
    font-size: 18px;
    line-height: 36px;
    text-align: justify;
    &.smaller {
      font-size: 16px;
      line-height: 1.5;
    }
  }

  ul,
  ol {
    list-style: none;
    padding: 0 0 0 40px;
    color: rgba(0, 0, 0, 0.702);
    line-height: 2.2;
    letter-spacing: 0.3px;
    li {
      text-align: left;
    }
  }

  ul {
    li {
      &::before {
        content: '•';
        display: inline-block;
        width: 26px;
        color: #2d5b7b;
        font-size: 30px;
        line-height: 1;
        vertical-align: top;
      }
    }
  }
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
}

picture {
  display: block;
  figcaption {
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.498);
    font-size: 15px;
    line-height: 1.7;
  }
}

.story {
  padding: 0 0 20px;
  color: #000;
  line-height: 1.15;
  text-align: justify;
  word-break: break-word;
  @include media-breakpoint-up(lg) {
    width: 695px;
  }
  > * {
    width: calc(100% - 50px);
    max-width: 645px;
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(lg) {
      width: 100%;
      max-width: none;
    }
    + h2 {
      margin-top: 40px;
    }
    + p {
      margin-top: 1.5em;
    }
    + ol,
    + ul,
    + .embeddedcode {
      margin-top: 20px;
    }
  }
  &::v-deep {
    a {
      &:link,
      &:visited,
      &:hover,
      &:active {
        padding-bottom: 5px;
        color: #3195b3;
        border-bottom: 1px solid #3195b3;
      }
      * {
        text-decoration: none;
      }
    }
  }
  &__section-datetime {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 20px;
    @include media-breakpoint-up(md) {
      margin-top: 0;
    }
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
    @each $name, $color in $sections-color {
      &.#{$name} {
        &::before {
          background-color: $color;
        }
      }
    }
  }
  &__published-date {
    color: #a1a1a1;
    font-size: 16px; // 1rem
    font-style: italic;
    font-weight: 400;
    @include media-breakpoint-up(md) {
      font-size: 17px;
    }
  }
  &__title {
    margin-top: 13px;
    font-size: 28px; // 1.75rem
    font-weight: 400;
    line-height: 1.25;
    @include media-breakpoint-up(md) {
      margin-top: 25px;
      font-size: 32px;
    }
  }
  &__hero-img {
    display: block;
    width: 100%;
    max-width: none;
    margin-top: 20px;
    img {
      width: 100%;
    }
    img[lazy='loading'] {
      height: 250px;
      object-fit: contain;
    }
    figcaption {
      max-width: 645px;
      margin: 5px 0 0;
      padding: 0 25px;
      color: #34495e;
      font-size: 16px;
      line-height: 1.3;
      @include media-breakpoint-up(md) {
        padding: 0;
        margin: 5px auto 0;
      }
      @include media-breakpoint-up(lg) {
        max-width: none;
      }
    }
  }
  .quoteby {
    position: relative;
    padding: 20px 0 0 30px;
    margin-top: 70px;
    color: #3a759e;
    font-size: 24px;
    line-height: 44px;
    border-top: 3px solid #255577;
    border-left: 3px solid #255577;
    @include media-breakpoint-up(md) {
      width: 575px;
    }
    &::before {
      content: '';
      position: absolute;
      top: -50px;
      left: 60px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 50px 0 0 70px;
      border-color: transparent transparent transparent #255577;
    }
    &::after {
      content: '';
      position: absolute;
      top: -44px;
      left: 63px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 44px 0 0 62px;
      border-color: transparent transparent transparent #fff;
    }
  }
  .embeddedcode {
    ::v-deep {
      iframe {
        max-width: 100%;
        margin: auto;
      }
    }
  }
}
</style>
