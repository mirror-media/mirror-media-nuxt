<template>
  <section class="header-nav-topic">
    <div class="container">
      <div class="topic-container">
        <a
          v-for="topic in topics"
          :key="topic.id"
          class="topic topic--normal"
          :href="`/topic/${topic.id}`"
          @click="emitGA(`topic ${topic.name}`)"
        >
          <h2>{{ topic.name }}</h2>
        </a>
      </div>

      <a href="/section/topic" class="topic" @click="emitGA('topic 更多')">
        <h2>更多</h2>
      </a>

      <div class="sub-brand-container">
        <a
          v-for="subBrand in subBrands"
          :key="subBrand.name"
          :href="subBrand.href"
          target="_blank"
          rel="noopener noreferrer"
          @click="emitGA(`section ${subBrand.name}`)"
        >
          <img
            :src="require(`~/assets/${subBrand.name}.png`)"
            :alt="subBrand.title"
          />
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UiHeaderNavTopic',
  props: {
    topics: {
      type: Array,
      required: true,
      default: () => [],
    },
    subBrands: {
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
