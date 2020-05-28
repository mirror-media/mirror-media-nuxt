<template>
  <section class="header-nav-topic">
    <div class="container">
      <div class="topic-container">
        <nuxt-link
          v-for="topic in topics"
          :key="topic.id"
          class="topic topic--normal"
          :to="`/topic/${topic.id}`"
          @click.native="emitGA(`topic ${topic.name}`)"
        >
          <h2>{{ topic.name }}</h2>
        </nuxt-link>
      </div>

      <nuxt-link
        to="/section/topic"
        class="topic"
        @click.native="emitGA('topic 更多')"
      >
        <h2>更多</h2>
      </nuxt-link>

      <div class="sub-brand-container">
        <a
          href="https://voice.mirrorfiction.com/"
          target="_blank"
          @click="emitGA('section mirrorvoice')"
        >
          <img src="~/assets/mirrorvoice.png" alt="鏡好聽" />
        </a>
        <a
          href="https://www.mirrorfiction.com/"
          target="_blank"
          @click="emitGA('section mirrorfiction')"
        >
          <img src="~/assets/mirrorfiction.png" alt="鏡文學" />
        </a>
        <a
          href="https://www.readr.tw/"
          target="_blank"
          @click="emitGA('section readr')"
        >
          <img src="~/assets/readrlogo-gary.png" alt="READr 讀+" />
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UIHeaderNavTopic',
  props: {
    topics: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    emitGA(eventLabel) {
      this.$emit('sendGA', {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header-nav-topic {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
    background-color: #fff;
    color: rgba(#000, 0.5);
    text-align: center;
  }
  .container {
    max-width: 1024px;
    height: 45px;
    overflow: hidden;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    user-select: none;
  }
  .topic-container {
    display: flex;
    flex-wrap: wrap;
    max-width: 582px;
  }
  .topic {
    min-width: 90px;
    height: 100%;
    padding-left: 8px;
    padding-right: 8px;
    line-height: 42px;
    cursor: pointer;
    &--normal {
      border-bottom: 3px solid #000;
      flex: 0 0 auto;
      &:hover {
        color: #fff;
        background-color: #000;
      }
    }
  }
  .sub-brand-container {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    & a {
      padding-left: 10px;
      padding-right: 10px;
      flex: 0 0 auto;
      cursor: pointer;
    }
    & img {
      height: 30px;
      width: auto;
    }
  }
}
</style>
