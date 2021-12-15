<template>
  <div class="bar" :class="{ agree: isAgree }" :style="cssProps">
    <div class="bar__tickets">{{ tickets }} 票</div>
    <div class="bar__rate">{{ rate }}%</div>
  </div>
</template>

<script>
export default {
  props: {
    tickets: {
      type: String,
      default: '',
    },
    rate: {
      type: Number,
      default: 0,
    },
    isAgree: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    cssProps() {
      return {
        '--rate': `${this.rate}%`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 24px;
  font-size: 13px;
  line-height: 18px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 4px;
  position: relative;
  margin-bottom: 4px;
  @include media-breakpoint-up(md) {
    padding: 3px 8px;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--rate);
    height: 24px;
    background: #e51731;
  }

  &__tickets {
    color: #ffffff;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    z-index: 20;
  }

  &__rate {
    z-index: 20;
  }
}

.agree {
  &:before {
    background: #009045;
  }
}
</style>
