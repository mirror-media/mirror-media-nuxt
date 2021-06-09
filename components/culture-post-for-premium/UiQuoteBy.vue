<template>
  <div class="quote-by">
    <div class="quote-by__decorator decorator">
      <SvgQuoteByDecorator class="decorator__icon" />
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="quote-by__quote" v-html="quote"></p>
    <cite v-if="quoteBy" class="quote-by__cite" v-text="quoteBy"></cite>
  </div>
</template>

<script>
import SvgQuoteByDecorator from '~/assets/premium-quote-by-decorator.svg?inline'

export default {
  components: {
    SvgQuoteByDecorator,
  },
  props: {
    quote: {
      type: String,
      default: '',
    },
    quoteBy: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.quote-by {
  font-size: 18px;
  line-height: 200%;
  text-align: justify;
  color: #054f77;
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    max-width: 480px;
    margin: 0 auto !important;
  }

  &__quote {
    margin: 16px 0 0 0;
  }
  &__cite {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 16px 0 0 0;
    font-style: normal;
    &:before {
      content: '';
      display: inline-block;
      width: 32px;
      height: 1px;
      margin: 0 4px 0 0;
      background-color: #054f77;
    }
  }
}

.decorator {
  display: flex;
  align-items: center;
  &__icon {
    margin: 0 24px;
  }
  &:before,
  &:after {
    content: '';
    display: inline-block;
    flex: 1 1 auto;
    height: 2px;
    background-color: #054f77;
  }
}
</style>
