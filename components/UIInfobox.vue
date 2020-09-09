<template>
  <div class="infobox">
    <div class="wrapper">
      <p v-if="content.title" class="title">{{ content.title }}</p>
      <div class="body" v-html="content.body"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UIInfobox',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
}
</script>

<style lang="scss" scoped>
.infobox {
  padding-left: 18px;
  padding-right: 18px;
  margin-top: 48px;
  margin-bottom: 48px;
  position: relative;
  text-align: left;

  &::before,
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    left: 0;
    border-style: solid;
  }

  &::before {
    border-color: #255577;
    border-style: solid;
    border-width: 12px 18px;
    top: 30px;
  }

  &::after {
    border-color: #7b7b7b transparent transparent;
    border-width: 10px 0 0 18px;
    top: 54px;
  }
}

.wrapper {
  padding: 30px 24px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 14px rgba(146, 146, 146, 0.52);
  @include media-breakpoint-up(sm) {
    padding-left: 50px;
    padding-right: 50px;
  }
}

.title {
  color: #3a6888;
  margin-bottom: 15px;
  font-size: 22px;
  line-height: 1.15;

  @include media-breakpoint-up(sm) {
    font-size: 25px;
  }
}

.body {
  &::v-deep {
    p,
    ul,
    ol {
      color: rgba(#000, 0.64);
    }

    > * {
      + p,
      + ul,
      + ol {
        margin-top: 1.5em;
      }
    }

    p {
      font-size: 16px;
      text-align: left;
    }

    ol {
      list-style: decimal;
    }

    ul {
      list-style: disc;

      @include media-breakpoint-down(xs) {
        line-height: 2;
        letter-spacing: 0.8px;
        margin-left: 16px;
        padding-left: 0;
      }
    }

    li::before {
      content: none;
    }
  }
}
</style>
