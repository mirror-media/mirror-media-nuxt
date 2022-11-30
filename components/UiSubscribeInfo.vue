<template>
  <div class="subscribe-info" :class="type">
    <h2>注意事項</h2>
    <ul>
      <li v-for="info in infoList" :key="info.id">
        <p
          class="subscribe-info__content"
          :class="{
            'subscribe-info__content--warning': info.style === 'warning',
          }"
          v-html="info.text"
        />
        <ul>
          <li
            v-for="infoChild in infoSubList(info)"
            :key="infoChild.id"
            class="subscribe-info__sub"
          >
            <p>{{ infoChild.text }}</p>
          </li>
        </ul>
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
    infoList: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
  methods: {
    infoSubList(info) {
      return info.child ? info.child : []
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-info {
  max-width: 940px;
  margin: auto;
  padding: 0 17px 48px 17px;
  @include media-breakpoint-up(sm) {
    padding: 0 17px 60px 17px;
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
  &__content {
    color: #000000de;
    &--warning {
      color: red;
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
      .subscribe-info__sub {
        list-style: circle;
        margin-left: 8px;
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
