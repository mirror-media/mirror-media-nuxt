<template>
  <lazy-component v-if="hasItems" class="story-list" @show="$emit('show')">
    <div v-for="item in items" :key="item.slug" class="item">
      <div class="item__title">
        <nuxt-link :to="`/story/${item.slug}`" v-text="item.title" />
      </div>
      <nuxt-link
        v-if="showImage"
        :to="`/story/${item.slug}`"
        class="item__image"
      >
        <img
          :src="getImageSrc(item.heroImage)"
          :alt="item.title"
          loading="lazy"
        />
      </nuxt-link>
    </div>
  </lazy-component>
</template>

<script>
export default {
  name: 'UIStoryListRelated',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    hasItems() {
      return this.items.length > 0
    },
    imageIds() {
      return this.items.map((item) => item.heroImage)
    },
  },
  methods: {
    getImageSrc(id) {
      const data = this.images?.find((item) => item.id === id) || {}
      return data.image?.resizedTargets?.mobile?.url
    },
    showImage(id) {
      return this.images.length > 0 && this.getImageSrc(id)
    },
  },
}
</script>

<style lang="scss" scoped>
.story-list {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    color: grey;
    background-color: #eee;
    &::before {
      content: '';
      display: block;
      width: 10px;
      background-color: grey;
    }
    + .item {
      margin-top: 16px;
    }
    &__title {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 1em;
      @include media-breakpoint-up(md) {
        padding: 1em 2em;
      }
      a {
        display: -webkit-box;
        max-height: calc(18px * 1.3 * 2);
        font-size: 18px;
        line-height: 1.3;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &__image {
      position: relative;
      width: 33%;
      @include media-breakpoint-up(md) {
        width: 25%;
        padding-top: calc(25% * 0.5625);
      }
      @include media-breakpoint-up(lg) {
        width: 20%;
        padding-top: calc(20% * 0.6666);
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      }
    }
  }
}
</style>
