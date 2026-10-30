<template>
  <div class="subscribe-campaign-info" :class="type">
    <h2>活動注意事項</h2>
    <ul>
      <li
        v-for="info in campaignInfoList"
        :key="info.id"
        :class="{ warning: info.style === 'warning' }"
      >
        {{ info.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      require: true,
      default: 'papermag',
    },
    campaignInfoList: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-campaign-info {
  max-width: 940px;
  margin: auto;
  padding: 0 17px 48px 17px;
  @include media-breakpoint-up(sm) {
    padding: 0 17px 20px 17px;
  }

  h2 {
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000de;
    margin-bottom: 12px;

    @include media-breakpoint-up(sm) {
      font-size: 24px;
    }
  }
  ul {
    list-style: disc;
    margin-left: 1rem;

    li {
      max-width: 940px;
      margin: auto;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      color: #000000de;

      &.warning {
        color: red;

        &::marker {
          color: #000000de;
        }
      }
    }
  }
}
.membership {
  ul {
    list-style: decimal;
    li {
      line-height: 150%;
    }
  }
}
</style>
